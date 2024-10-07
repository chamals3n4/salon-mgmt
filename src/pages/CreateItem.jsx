import { useState } from "react";
import supabase from "@/Config/SupabaseClient";
import { PhotoIcon } from "@heroicons/react/24/outline";

export default function CreateItem() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!imgFile) return;

    const filePath = `items/${imgFile.name}`;
    const { data, error } = await supabase.storage
      .from("item-images")
      .upload(filePath, imgFile);

    if (error) {
      console.error("Error uploading image:", error.message);
      return;
    }

    const { publicURL, error: urlError } = supabase.storage
      .from("item-images")
      .getPublicUrl(filePath);

    if (urlError) {
      console.error("Error getting public URL:", urlError.message);
    } else {
      return publicURL; // Ensure the URL is returned
    }
  };

  const handleCreateItem = async (e) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true);

    // Wait for the image to upload and get the URL
    const imageUrl = await handleUpload();

    if (!imageUrl) {
      setLoading(false);
      return;
    }

    // Now proceed to create the item in the database
    const { data, error } = await supabase.from("items").insert([
      {
        name,
        price: parseFloat(price),
        image_url: imageUrl, // Use the image URL from the upload
      },
    ]);

    if (error) {
      console.error("Error creating item:", error.message);
    } else {
      console.log("Item created successfully:", data);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleCreateItem}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Create New Store Item
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Add a new item for sale in the store.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="price"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Price
              </label>
              <div className="mt-2">
                <input
                  id="price"
                  name="price"
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="cover-photo"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Cover photo
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <PhotoIcon
                    aria-hidden="true"
                    className="mx-auto h-12 w-12 text-gray-300"
                  />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={(e) => setImgFile(e.target.files[0])}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Item"}
        </button>
      </div>
    </form>
  );
}
