export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  barcode: string | null;
  ncm: string | null;
  cest: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateProduct {
  sku: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  barcode: string | null;
  ncm: string | null;
  cest: string | null;
}

export interface UpdateProduct {
  sku: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  barcode: string | null;
  ncm: string | null;
  cest: string | null;
}
