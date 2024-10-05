import { ObjectId } from "mongodb";

export interface CommentsEntity {
  userId: ObjectId;
  reelsId: ObjectId;
  comment: string;
  createdAt: Date;
}
