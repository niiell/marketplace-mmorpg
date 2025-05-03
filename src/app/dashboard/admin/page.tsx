"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // For simplicity, save data to a mock API or local storage
    // In real app, integrate with backend or file system (e.g. .mdx files)
    try {
      // Example: POST to /api/admin/food (to be implemented)
      const res = await fetch("/api/admin/food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, price, category }),
      });

      if (res.ok) {
        setMessage("Food item saved successfully.");
        setTitle("");
        setDescription("");
        setPrice("");
        setCategory("");
        router.refresh();
      } else {
        setMessage("Failed to save food item.");
      }
    } catch (error) {
      setMessage("Error saving food item.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard - Add Food Item</h1>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block font-semibold mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="description" className="block font-semibold mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="price" className="block font-semibold mb-1">
            Price
          </label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="category" className="block font-semibold mb-1">
            Category
          </label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Food Item
        </button>
      </form>
    </div>
  );
}
