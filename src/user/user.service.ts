import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { FollowersEntity } from "../entities/followers.entity";
import { ProfilesEntity } from "../entities/profiles.entity";
import { UsersEntity } from "../entities/users.entity";
import { db } from "../rdb/mongodb";
import { Collections } from "../util/constants";
import { UpdateUserInput } from "./dto/update-user.dto";

const users = db.collection<UsersEntity>(Collections.USERS);
const profiles = db.collection<ProfilesEntity>(Collections.PROFILES);
const followers = db.collection<FollowersEntity>(Collections.FOLLOWERS);

export const updatePostCount = async (userId: ObjectId, count: 1 | -1) => {
  await profiles.updateOne({ userId }, { $inc: { postCount: count } });
};

export const updateFollowerCount = async (userId: ObjectId, count: 1 | -1) => {
  await profiles.updateOne({ userId }, { $inc: { followersCount: count } });
};

export const updateFollowingCount = async (userId: ObjectId, count: 1 | -1) => {
  await profiles.updateOne({ userId }, { $inc: { followingCount: count } });
};

export const getUserProfile = async (req: Request, res: Response) => {
  const userId = new ObjectId(req.user!.userId);

  const user = await users.findOne({ _id: userId });

  return res.json(user);
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const userId = new ObjectId(req.user!.userId);
  const body = req.body as UpdateUserInput;

  const username = body.username
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");

  const existingUsername = await users.findOne({
    username,
    _id: { $ne: userId },
  });
  if (existingUsername)
    return res.status(404).json({ message: "Username already exists!" });

  const user = await users.findOneAndUpdate(
    { _id: userId },
    { $set: { username, updatedAt: new Date() } },
    { returnDocument: "after" }
  );
  const userProfile = await profiles.findOneAndUpdate(
    { userId },
    {
      $set: {
        username,
        bio: body.bio,
        websiteURL: body.websiteURl,
        bannerURL: body.bannerURL,
      },
    },
    { returnDocument: "after" }
  );
  const result = {
    ...userProfile,
  };
  return res.status(200).json(result);
};

export const getFollowing = async (req: Request, res: Response) => {
  const followingUserId = new ObjectId(req.user!.userId);
  const following = await followers
    .aggregate([
      {
        $match: {
          followingUserId,
        },
      },
      {
        $lookup: {
          from: Collections.PROFILES,
          foreignField: "followedUserId",
          localField: "userId",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
        },
      },
      {
        $replaceRoot: {
          newRoot: "$user",
        },
      },
    ])
    .toArray();

  return res.json(following);
};
export const getFollowers = async (req: Request, res: Response) => {
  const followedUserId = new ObjectId(req.user!.userId);
  const follower = followers
    .aggregate([
      {
        $match: {
          followedUserId,
        },
      },
      {
        $lookup: {
          from: Collections.PROFILES,
          foreignField: "followingUserId",
          localField: "userId",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
        },
      },
      {
        $replaceRoot: {
          newRoot: "$user",
        },
      },
    ])
    .toArray();
  return res.json(follower);
};
export const followProfile = async (req: Request, res: Response) => {
  const followingUserId = new ObjectId(req.user!.userId);
  const followedUserId = new ObjectId(req.params.userId);

  await followers.insertOne({
    followingUserId,
    followedUserId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await updateFollowerCount(followedUserId, 1);
  await updateFollowingCount(followingUserId, 1);

  return res.json({ message: "OK" });
};

export const unFollowProfile = async (req: Request, res: Response) => {
  const followingUserId = new ObjectId(req.user!.userId);
  const followedUserId = new ObjectId(req.params.userId);

  await followers.findOneAndDelete({
    followingUserId,
    followedUserId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await updateFollowerCount(followedUserId, 1);
  await updateFollowingCount(followingUserId, 1);

  return res.json({ message: "OK" });
};
