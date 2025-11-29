export interface GeneralStats {
  total_posts: number;
  total_comments: number;
  total_users: number;
  recent_posts_week: number;
}

export interface CategoryStats {
  id: number;
  name: string;
  posts_count: number;
}

export interface TopPoster {
  id: number;
  full_name: string;
  email: string;
  posts_count: number;
}

export interface CategoryMostCommented {
  id: number;
  name: string;
  comments_count: number;
}

export interface CategoryDetail {
  id: number;
  name: string;
  description?: string;
}

export interface CategoryDetailStats {
  total_posts: number;
  total_comments: number;
}

export interface TopPost {
  id: number;
  title: string;
  comments_count: number;
  created_at: string;
}

export interface Statistics {
  general: GeneralStats;
  posts_by_category: CategoryStats[];
  top_posters: TopPoster[];
  categories_most_commented: CategoryMostCommented[];
}

export interface CategoryStatistics {
  category: CategoryDetail;
  stats: CategoryDetailStats;
  top_posts: TopPost[];
}


