import { ObjectId } from "mongodb";

export interface ProfilesEntity {
  userId: ObjectId;
  fullName: string;
  username: string;
  bio: string;

  region: string;

  avatarURL: string;
  bannerURL: string;
  websiteURL: string;

  postCount: number;
  followingCount: number;
  followersCount: number;
}
