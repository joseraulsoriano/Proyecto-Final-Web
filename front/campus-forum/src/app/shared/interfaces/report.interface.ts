import { User } from './user.interface';
import { Post } from './post.interface';
import { Comment } from './comment.interface';

export enum ReportType {
  POST = 'POST',
  COMMENT = 'COMMENT'
}

export enum ReportStatus {
  PENDING = 'PENDING',
  REVIEWED = 'REVIEWED',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED'
}

export interface Report {
  id: number;
  type: ReportType;
  reported_by: User;
  post?: Post;
  comment?: Comment;
  reason: string;
  status: ReportStatus;
  reviewed_by?: User;
  action_taken?: string;
  created_at: string;
  reviewed_at?: string;
}

export interface CreateReportRequest {
  type: ReportType;
  post_id?: number;
  comment_id?: number;
  reason: string;
}

export interface ResolveReportRequest {
  action_taken: string;
}


