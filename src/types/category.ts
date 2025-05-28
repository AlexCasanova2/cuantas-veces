export interface Category {
  id: number;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryDTO {
  name: string;
  color: string;
}

export interface UpdateCategoryDTO {
  name?: string;
  color?: string;
} 