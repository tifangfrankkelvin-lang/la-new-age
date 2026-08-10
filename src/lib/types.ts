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
export type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
};