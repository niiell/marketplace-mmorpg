"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from '../../lib/supabase';
import Link from "next/link";
import { useForm } from "react-hook-form";
import gsap from "gsap";
import { Card, CardBody, CardFooter, Input, Select, SelectItem, Button } from "@nextui-org/react";

interface FilterParams {
  title?: string;
  category_id?: string;
  game_id?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  minRating?: string | number;
}

const PAGE_SIZE = 12;

export default function MarketplacePage() {
  const [listings, setListings] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, watch } = useForm();

  const [filter, setFilter] = useState<FilterParams>({
    title: "",
    category_id: "",
    game_id: "",
    minPrice: "",
    maxPrice: "",
    minRating: ""
  });

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    supabase.from("categories").select("id, name").then(({ data }) => {
      setCategories(data || []);
    });
    supabase.from("games").select("id, name").then(({ data }) => {
      setGames(data || []);
    });
  }, []);

  const fetchListings = async (filters: FilterParams = {}, pageNum = 1, append = false) => {
    setLoading(true);
    let query = supabase
      .from("listings")
      .select("id, title, price, image_url, category_id, game_id, rating, description")
      .range((pageNum - 1) * PAGE_SIZE, pageNum * PAGE_SIZE - 1);
    // Full-text search
    if (filters.title) query = query.textSearch("title,description", filters.title, { type: 'websearch' });
    if (filters.category_id) query = query.eq("category_id", filters.category_id);
    if (filters.game_id) query = query.eq("game_id", filters.game_id);
    if (filters.minPrice) query = query.gte("price", filters.minPrice);
    if (filters.maxPrice) query = query.lte("price", filters.maxPrice);
    if (filters.minRating) query = query.gte("rating", filters.minRating);
    const { data, error } = await query;
    if (!error) {
      if (append) {
        setListings((prev) => [...prev, ...(data || [])]);
      } else {
        setListings(data || []);
      }
      setHasMore((data?.length || 0) === PAGE_SIZE);
    }
    setLoading(false);
  };

  useEffect(() => {
    setPage(1);
    fetchListings(filter, 1, false);
  }, [filter]);

  const onFilter = (data: FilterParams) => {
    setFilter({
      ...filter,
      ...data
    });
  };

  useEffect(() => {
    gsap.utils.toArray('.market-card').forEach((el: any) => {
      el.addEventListener('mouseenter', () => {
        gsap.to(el, { scale: 1.04, boxShadow: '0 8px 32px #0002', duration: 0.2 });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { scale: 1, boxShadow: '0 2px 8px #0001', duration: 0.2 });
      });
    });
  }, [listings]);

  // Infinite scroll observer
  useEffect(() => {
    const currentLoader = loader.current;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        fetchListings(filter, page + 1, true);
        setPage((p) => p + 1);
      }
    }, { threshold: 1 });

    if (currentLoader) observer.observe(currentLoader);
    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [hasMore, loading, filter, page]);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Marketplace</h1>
      <form onSubmit={handleSubmit(onFilter)} className="mb-8 grid grid-cols-1 md:grid-cols-6 gap-4">
        <Input
          type="text"
          placeholder="Cari item..."
          {...register("title")}
          className="col-span-2"
        />
        <Select {...register("category_id")} placeholder="Kategori" className="col-span-1">
          <>
            <SelectItem key="" value="">Semua Kategori</SelectItem>
            {categories.map((cat: any) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </>
        </Select>
        <Select {...register("game_id")} placeholder="Game" className="col-span-1">
          <>
            <SelectItem key="" value="">Semua Game</SelectItem>
            {games.map((game: any) => (
              <SelectItem key={game.id} value={game.id}>{game.name}</SelectItem>
            ))}
          </>
        </Select>
        <Input type="number" min={0} placeholder="Harga Min" {...register("minPrice")} className="col-span-1" />
        <Input type="number" min={0} placeholder="Harga Max" {...register("maxPrice")} className="col-span-1" />
        <Input type="number" min={1} max={5} placeholder="Min Rating" {...register("minRating")} className="col-span-1" />
        <Button type="submit" color="primary" className="col-span-1">Filter</Button>
      </form>
      {loading && listings.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-72 w-full">
              <div className="h-1/2 bg-gray-300 rounded-t-lg" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-2/3" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {listings.map((item) => (
            <Link
              key={item.id}
              href={`/product/${item.id}`}
              className="market-card block"
              style={{ textDecoration: 'none' }}
            >
              <Card shadow="sm" isPressable className="h-full">
                <CardBody className="overflow-visible p-0">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardBody>
                <CardFooter className="flex flex-col items-start gap-1 p-4">
                  <h2 className="text-lg font-semibold text-blue-900">{item.title}</h2>
                  <span className="text-blue-700 font-bold">Rp {item.price}</span>
                  {item.rating && (
                    <span className="text-yellow-500 text-sm">Rating: {item.rating}★</span>
                  )}
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
      <div ref={loader} />
      {loading && listings.length > 0 && <p className="text-center mt-4">Loading more...</p>}
      {!hasMore && !loading && listings.length > 0 && <p className="text-center mt-4">Semua data sudah ditampilkan.</p>}
    </div>
  );
}
