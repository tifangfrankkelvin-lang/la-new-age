"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";
import type { Product, ProductImage } from "@/lib/types";
import { deleteProductImage, setCoverPhoto } from "@/app/admin/(protected)/products/actions";

type Props = {
  initialProduct?: Product;
  initialImages?: ProductImage[];
  action: (formData: FormData) => Promise<{ error?: string }>;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProductForm({
  initialProduct,
  initialImages = [],
  action,
}: Props) {
  const router = useRouter();
  const [name, setName] = useState(initialProduct?.name ?? "");
  const [slug, setSlug] = useState(initialProduct?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!initialProduct);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState(initialImages);
  const [managingImage, setManagingImage] = useState<string | null>(null);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    setError(null);
    const result = await action(formData);
    setSaving(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  async function handleDeleteImage(imageId: string) {
    if (!initialProduct) return;
    if (!confirm("Remove this photo?")) return;

    setManagingImage(imageId);
    const result = await deleteProductImage(imageId, initialProduct.slug);
    setManagingImage(null);

    if (result.error) {
      alert(`Couldn't remove photo: ${result.error}`);
      return;
    }
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  }

  async function handleSetCover(imageUrl: string) {
    if (!initialProduct) return;
    setManagingImage(imageUrl);
    const result = await setCoverPhoto(
      initialProduct.id,
      imageUrl,
      initialProduct.slug
    );
    setManagingImage(null);

    if (result.error) {
      alert(`Couldn't set cover photo: ${result.error}`);
    } else {
      router.refresh();
    }
  }

  return (
    <form action={handleSubmit} className="max-w-2xl space-y-5">
      <div>
        <label className="text-xs uppercase tracking-widest text-brand-mid block mb-1">
          Name
        </label>
        <input
          name="name"
          required
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="w-full border border-brand-mid/30 text-sm px-3 py-2 text-brand-steel"
        />
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest text-brand-mid block mb-1">
          URL Slug
        </label>
        <input
          name="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugTouched(true);
          }}
          className="w-full border border-brand-mid/30 text-sm px-3 py-2 text-brand-steel font-mono"
        />
        <p className="text-xs text-brand-mid mt-1">
          Used in the page URL — auto-filled from the name, edit if needed.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs uppercase tracking-widest text-brand-mid block mb-1">
            Part Number
          </label>
          <input
            name="part_number"
            required
            defaultValue={initialProduct?.part_number}
            className="w-full border border-brand-mid/30 text-sm px-3 py-2 text-brand-steel"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-brand-mid block mb-1">
            Price ($)
          </label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={initialProduct?.price}
            className="w-full border border-brand-mid/30 text-sm px-3 py-2 text-brand-steel"
          />
        </div>
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest text-brand-mid block mb-1">
          Condition
        </label>
        <select
          name="condition"
          required
          defaultValue={initialProduct?.condition ?? "used"}
          className="w-full border border-brand-mid/30 text-sm px-3 py-2 text-brand-steel"
        >
          <option value="new">New</option>
          <option value="used">Used</option>
        </select>
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest text-brand-mid block mb-1">
          Category
        </label>
        <select
          name="category"
          required
          defaultValue={initialProduct?.category ?? ""}
          className="w-full border border-brand-mid/30 text-sm px-3 py-2 text-brand-steel"
        >
          <option value="" disabled>
            Select a category
          </option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest text-brand-mid block mb-1">
          Fitment
        </label>
        <input
          name="fitment"
          required
          placeholder="e.g. 2015–2020 Ford F-150"
          defaultValue={initialProduct?.fitment}
          className="w-full border border-brand-mid/30 text-sm px-3 py-2 text-brand-steel"
        />
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest text-brand-mid block mb-1">
          Description
        </label>
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={initialProduct?.description}
          className="w-full border border-brand-mid/30 text-sm px-3 py-2 text-brand-steel"
        />
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest text-brand-mid block mb-2">
          Photos
        </label>

        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            {images.map((img) => {
              const isCover = img.image_url === initialProduct?.image_url;
              const isBusy = managingImage === img.id || managingImage === img.image_url;
              return (
                <div key={img.id} className="relative border border-brand-mid/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.image_url}
                    alt=""
                    className="w-full h-24 object-cover"
                  />
                  {isCover && (
                    <span className="absolute top-1 left-1 bg-brand-orange text-white text-[9px] uppercase px-1.5 py-0.5">
                      Cover
                    </span>
                  )}
                  <div className="flex">
                    {!isCover && (
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleSetCover(img.image_url)}
                        className="flex-1 text-[10px] uppercase text-brand-steel hover:text-brand-orange py-1 border-t border-brand-mid/20 disabled:opacity-50"
                      >
                        Set Cover
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleDeleteImage(img.id)}
                      className="flex-1 text-[10px] uppercase text-red-600 hover:underline py-1 border-t border-l border-brand-mid/20 disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <input
          name="images"
          type="file"
          accept="image/*"
          multiple
          className="w-full text-sm text-brand-steel"
        />
        <p className="text-xs text-brand-mid mt-1">
          {images.length > 0
            ? "Select more photos to add to the gallery. The first uploaded photo becomes the cover if none is set."
            : "Select one or more photos. The first one becomes the cover photo (shown on cards and listings)."}
        </p>
      </div>

      <label className="flex items-center gap-2 text-sm text-brand-steel">
        <input
          type="checkbox"
          name="in_stock"
          defaultChecked={initialProduct?.in_stock ?? true}
        />
        In stock
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="bg-brand-navy text-white text-sm font-semibold uppercase tracking-wide px-6 py-3 hover:bg-brand-orange transition-colors disabled:opacity-50"
      >
        {saving ? "Saving..." : initialProduct ? "Save Changes" : "Add Product"}
      </button>
    </form>
  );
}