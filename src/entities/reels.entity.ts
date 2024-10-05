import { ObjectId } from "mongodb";

export interface ReelsEntity {
  userId: ObjectId;
  caption: string;
  videoUrl: string;
  likeCount: number;
  shareCount: number;
  saveCount: number;
  commentCount: number;
  createdAt: Date;
}
