import { ObjectId } from "mongodb";

export interface ShareEntity {
  sharedUserId: ObjectId;
  sharingUserId: ObjectId;
  reelsId: ObjectId;
}
