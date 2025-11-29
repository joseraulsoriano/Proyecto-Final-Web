import { User } from './user.interface';
import { Category } from './category.interface';

export enum PostStatus {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
  ARCHIVED = 'ARCHIVED'
}

export interface Tag {
  id: number;
  name: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  category: Category;
  author: User;
  status: PostStatus;
  tags: Tag[];
  comments_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  category_id: number;
  status?: PostStatus;
  tag_ids?: number[];
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  category_id?: number;
  status?: PostStatus;
  tag_ids?: number[];
}

export interface PostFilters {
  category?: number;
  status?: PostStatus;
  author?: number;
  search?: string;
}


