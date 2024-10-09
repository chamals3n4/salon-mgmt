import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import supabase from "@/Config/SupabaseClient";

export default function AddItem() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    if (!name || !price || !image) {
      setStatus("Please fill all fields and select an image.");
      return;
    }

    try {
      // Upload image to Supabase Storage
      const fileExt = image.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("item-images")
        .upload(`images/${fileName}`, image);
      console.log(image);
      if (uploadError) throw uploadError;
      console.log(image);
      // Get public URL for the uploaded image
      const { data: urlData } = supabase.storage
        .from("item-images")
        .getPublicUrl(`images/${fileName}`);

      // Insert item data into the database
      const { data, error } = await supabase
        .from("items")
        .insert([{ name, price, image_url: urlData.publicUrl }])
        .select();

      if (error) throw error;

      setStatus("Item added successfully!");
      setName("");
      setPrice("");
      setImage(null);
    } catch (error) {
      console.error("Error adding item:", error);
      setStatus("Error adding item. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6">Add New Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="image">Image</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>
        <Button type="submit">Add Item</Button>
      </form>
      {status && (
        <Alert className="mt-4">
          <AlertDescription>{status}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
