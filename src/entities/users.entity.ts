import { ObjectId } from "mongodb";

export interface UsersEntity {
  _id: ObjectId;
  email: string;
  password: string;
  username: string;
  dateOfBirth: Date;
  gender: string;
  updatedAt: Date;
  createdAt: Date;
}
