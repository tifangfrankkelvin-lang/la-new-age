export type Product = {
  id: string;
  slug: string;
  name: string;
  part_number: string;
  price: number;
  category: string;
  fitment: string;
  description: string;
  image_url: string | null;
  in_stock: boolean;
  condition: "new" | "used";
  created_at: string;
};