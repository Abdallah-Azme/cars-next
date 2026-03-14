import type { Pagination } from "./vehicles";

export type SubCategory = {
  id: number;
  title: string;
  description: string ;
  image: string ;
};

export type Category = {
  id: number;
  title: string;
  description: string ;
  image: string ;
  subCategoriesCount: number;
  subCategories: SubCategory[];
};

export type CategoriesSResponse = {
  success: boolean|string;
  message: string;
  data: Category[];
  pagination:Pagination
};