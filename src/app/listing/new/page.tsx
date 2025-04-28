"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

const schema = z.object({
  title: z.string().min(3, "Judul wajib diisi"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  price: z.coerce.number().min(1, "Harga wajib diisi dan > 0"),
  stock: z.coerce.number().min(1, "Stok wajib diisi dan > 0"),
  game_id: z.string().min(1, "Game wajib dipilih"),
  category_id: z.string().min(1, "Kategori wajib dipilih"),
  image: z.any().refine((file) => file && file.length === 1, "Gambar wajib diupload"),
});

type FormData = z.infer<typeof schema>;

export default function NewListingPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [games, setGames] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("games").select("id, name").then(({ data }) => setGames(data || []));
    supabase.from("categories").select("id, name").then(({ data }) => setCategories(data || []));
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      // Upload image to Supabase Storage via Uploadthing
      const file = data.image[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage.from("listing-images").upload(fileName, file);
      if (uploadError) throw new Error("Gagal upload gambar: " + uploadError.message);
      const imageUrl = supabase.storage.from("listing-images").getPublicUrl(fileName).data.publicUrl;
      // Insert listing
      const { error: insertError } = await supabase.from("listings").insert({
        title: data.title,
        description: data.description,
        price: data.price,
        stock: data.stock,
        game_id: data.game_id,
        category_id: data.category_id,
        image_url: imageUrl,
      });
      if (insertError) throw new Error("Gagal menyimpan listing: " + insertError.message);
      toast.success("Listing berhasil diupload!");
      reset();
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan");
    }
  };

  return (
    <div className="max-w-lg mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Upload Listing Baru</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Judul</label>
          <input type="text" {...register("title")} className="w-full border rounded px-3 py-2" />
          {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block mb-1">Deskripsi</label>
          <textarea {...register("description")} className="w-full border rounded px-3 py-2" rows={4} />
          {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1">Harga (IDR)</label>
            <input type="number" min={1} {...register("price")}
              className="w-full border rounded px-3 py-2" />
            {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>}
          </div>
          <div className="flex-1">
            <label className="block mb-1">Stok</label>
            <input type="number" min={1} {...register("stock")}
              className="w-full border rounded px-3 py-2" />
            {errors.stock && <p className="text-red-600 text-sm mt-1">{errors.stock.message}</p>}
          </div>
        </div>
        <div>
          <label className="block mb-1">Game</label>
          <select {...register("game_id")} className="w-full border rounded px-3 py-2">
            <option value="">Pilih Game</option>
            {games.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
          {errors.game_id && <p className="text-red-600 text-sm mt-1">{errors.game_id.message}</p>}
        </div>
        <div>
          <label className="block mb-1">Kategori</label>
          <select {...register("category_id")} className="w-full border rounded px-3 py-2">
            <option value="">Pilih Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.category_id && <p className="text-red-600 text-sm mt-1">{errors.category_id.message}</p>}
        </div>
        <div>
          <label className="block mb-1">Gambar</label>
          <input type="file" accept="image/*" {...register("image")} className="w-full" />
          {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition">
          {isSubmitting ? "Mengupload..." : "Upload Listing"}
        </button>
      </form>
    </div>
  );
}