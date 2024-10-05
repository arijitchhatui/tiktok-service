import { ObjectId } from "mongodb";

export interface SaveEntity {
  userId: ObjectId;
  reelsId: ObjectId;
}
