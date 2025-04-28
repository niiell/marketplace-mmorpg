"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useForm } from "react-hook-form";
import gsap from "gsap";
import { Card, CardBody, CardFooter, Input, Select, SelectItem, Button } from "@nextui-org/react";

export default function MarketplacePage() {
  const [listings, setListings] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, watch } = useForm();

  const [filter, setFilter] = useState({
    title: "",
    category_id: "",
    minPrice: "",
    maxPrice: "",
    minRating: ""
  });

  useEffect(() => {
    supabase.from("categories").select("id, name").then(({ data }) => {
      setCategories(data || []);
    });
  }, []);

  const fetchListings = async (filters = {}) => {
    setLoading(true);
    let query = supabase.from("listings").select("id, title, price, image_url, category_id, rating");
    if (filters.title) query = query.ilike("title", `%${filters.title}%`);
    if (filters.category_id) query = query.eq("category_id", filters.category_id);
    if (filters.minPrice) query = query.gte("price", filters.minPrice);
    if (filters.maxPrice) query = query.lte("price", filters.maxPrice);
    if (filters.minRating) query = query.gte("rating", filters.minRating);
    const { data, error } = await query;
    if (!error) setListings(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchListings(filter);
  }, [filter]);

  const onFilter = (data: any) => {
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

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Marketplace</h1>
      <form onSubmit={handleSubmit(onFilter)} className="mb-8 grid grid-cols-1 md:grid-cols-5 gap-4">
        <Input
          type="text"
          placeholder="Cari item..."
          {...register("title")}
          className="col-span-2"
        />
        <Select {...register("category_id")} placeholder="Kategori" className="col-span-1">
          <SelectItem key="" value="">Semua Kategori</SelectItem>
          {categories.map((cat: any) => (
            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
          ))}
        </Select>
        <Input type="number" min={0} placeholder="Harga Min" {...register("minPrice")} className="col-span-1" />
        <Input type="number" min={0} placeholder="Harga Max" {...register("maxPrice")} className="col-span-1" />
        <Input type="number" min={1} max={5} placeholder="Min Rating" {...register("minRating")} className="col-span-1" />
        <Button type="submit" color="primary" className="col-span-1">Filter</Button>
      </form>
      {loading ? (
        <p>Loading...</p>
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
    </div>
  );
}