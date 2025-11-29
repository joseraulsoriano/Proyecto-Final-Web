import { User } from './user.interface';
import { Post } from './post.interface';

export interface Comment {
  id: number;
  content: string;
  post: Post;
  author: User;
  created_at: string;
  updated_at: string;
}

export interface CreateCommentRequest {
  content: string;
  post_id: number;
}

export interface UpdateCommentRequest {
  content?: string;
}


