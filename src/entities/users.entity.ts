import { ObjectId } from "mongodb";

export interface UsersEntity {
  _id: ObjectId;
  email: string;
  password: string;
  dateOfBirth: Date;
  gender: string;
  createdAt: Date;
}
