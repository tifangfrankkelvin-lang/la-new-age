"use client";

import { useTransition } from "react";

export default function DeleteButton({
  onDelete,
  label = "Delete",
}: {
  onDelete: () => Promise<{ error?: string }>;
  label?: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm("Delete this product? This can't be undone.")) return;

    startTransition(async () => {
      const result = await onDelete();
      if (result?.error) {
        alert(`Couldn't delete: ${result.error}`);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="text-red-600 text-xs font-semibold uppercase hover:underline disabled:opacity-50"
    >
      {isPending ? "Deleting..." : label}
    </button>
  );
}