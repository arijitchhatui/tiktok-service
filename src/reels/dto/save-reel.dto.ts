import { ObjectId } from "mongodb";

export interface SaveReelsInput {
  userId: ObjectId;
  reelsId: ObjectId;
}
