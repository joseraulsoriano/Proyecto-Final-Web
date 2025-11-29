export enum CategoryStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED'
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  status: CategoryStatus;
  created_by?: number;
  created_at: string;
  updated_at: string;
  posts_count?: number;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  status?: CategoryStatus;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  status?: CategoryStatus;
}


