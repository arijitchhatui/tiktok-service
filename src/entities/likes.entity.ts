import { ObjectId } from "mongodb";

export interface LikesEntity {
  userId: ObjectId;
  reelsId: ObjectId;
  createdAt: Date;
  deletedAt: Date;
}
