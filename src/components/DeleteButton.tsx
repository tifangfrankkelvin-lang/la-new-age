"use client";

export default function DeleteButton({ label = "Delete" }: { label?: string }) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm("Delete this product? This can't be undone.")) {
          e.preventDefault();
        }
      }}
      className="text-red-600 text-xs font-semibold uppercase hover:underline"
    >
      {label}
    </button>
  );
}