import { Request, Response } from "express";
import { ObjectId, WithId } from "mongodb";
import { CommentsEntity } from "../entities/comments.entity";
import { LikesEntity } from "../entities/likes.entity";
import { ProfilesEntity } from "../entities/profiles.entity";
import { ReelsEntity } from "../entities/reels.entity";
import { SaveEntity } from "../entities/saves.entity";
import { db } from "../rdb/mongodb";
import { Collections } from "../util/constants";
import { CommentReelInput } from "./dto/comment-string.dto";
import { CreateReelsInput } from "./dto/create-reels.dto";
import { EditReelsInput } from "./dto/edit-reels.dto";

const reels = db.collection<ReelsEntity>(Collections.REELS);
const profiles = db.collection<ProfilesEntity>(Collections.PROFILES);
const likes = db.collection<LikesEntity>(Collections.LIKES);
const comments = db.collection<CommentsEntity>(Collections.COMMENTS);
const saves = db.collection<SaveEntity>(Collections.SAVES);

const getReelsByUserId = async (userId: ObjectId) => {
  const result = await reels.find({ userId });
  return result;
};
export const getReels = async (req: Request, res: Response) => {
  const userId = new ObjectId(req.user!.userId);
  const result = await getReelsByUserId(userId);
  return res.json(result);
};
export const getCreatorReels = async (req: Request, res: Response) => {
  const userId = new ObjectId(req.params.userId);
  const result = await getReelsByUserId(userId);
  return res.json(result);
};
export const createReels = async (req: Request, res: Response) => {
  const userId = new ObjectId(req.user!.userId);
  const body = req.body as CreateReelsInput;
  await reels.insertOne({
    caption: body.caption,
    videoUrl: body.videoUrl,
    userId,
    saveCount: 0,
    commentCount: 0,
    shareCount: 0,
    likeCount: 0,
    createdAt: new Date(),
  });
  await profiles.updateOne({ _id: userId }, { $inc: { postCount: 1 } });
  return res.status(200).json({ message: "ok" });
};
export const editReels = async (req: Request, res: Response) => {
  const userId = new ObjectId(req.user!.userId);
  const body = req.body as EditReelsInput;
  await reels.updateOne({ _id: userId }, { $set: { caption: body.caption } });
  return res.status(200).json({ message: "ok" });
};
export const likeReel = async (req: Request, res: Response) => {
  const userId = new ObjectId(req.user!.userId);
  const reelsId = new ObjectId(req.params.id);

  const liked = await reels.findOne({ userId, reelsId });
  if (liked) {
    await reels.deleteOne({ userId, reelsId });
    const reel = await reels.findOneAndUpdate(
      { _id: reelsId },
      { $inc: { likeCount: -1 } },
      { returnDocument: "after" }
    );
    return res.json({ reel, like: liked });
  }
  const like: WithId<LikesEntity> = {
    _id: new ObjectId(),
    userId,
    reelsId,
    createdAt: new Date(),
    deletedAt: new Date(),
  };
  await likes.insertOne(like);
  const reel = await reels.findOneAndUpdate(
    { _id: userId },
    { $inc: { likeCount: 1 } },
    { returnDocument: "after" }
  );
  return res.json({ reels, like: liked });
};
export const createComment = async (req: Request, res: Response) => {
  const userId = new ObjectId(req.user!.userId);
  const reelsId = new ObjectId(req.params.id);
  const body = req.body as CommentReelInput;
  const reel = await reels.findOneAndUpdate(
    { _id: reelsId },
    { $inc: { commentCount: 1 } },
    { returnDocument: "after" }
  );
  if (reel) {
    const comment: WithId<CommentsEntity> = {
      _id: new ObjectId(),
      userId,
      reelsId,
      comment: body.comment,
      createdAt: new Date(),
    };
    await comments.insertOne(comment);
    return res.json({ reel, comment });
  }
  return res.status(404).json("Reel not found");
};
export const deleteComment = async (req: Request, res: Response) => {
  const userId = new ObjectId(req.user!.userId);
  const commentId = new ObjectId(req.params.id);

  const { deletedCount } = await comments.deleteOne({ userId, _id: commentId });
  if (deletedCount) {
    const reel = await reels.findOneAndUpdate(
      { _id: commentId },
      { $inc: { commentCount: -1 } },
      { returnDocument: "after" }
    );
    return res.json(reel);
  }
  return res.status(401).json("Reel not found");
};

export const saveReel = async (req: Request, res: Response) => {
  const userId = new ObjectId(req.user!.userId);
  const reelsId = new ObjectId(req.params.id);
  const save = await saves.insertOne({ userId, reelsId });
  if (save) {
    await saves.deleteOne({ userId, reelsId });
    await reels.updateOne(
      { userId, _id: reelsId },
      { $inc: { saveCount: -1 } }
    );
  } else {
    await saves.insertOne({ reelsId, userId });
    await reels.updateOne({ userId, _id: reelsId }, { $inc: { saveCount: 1 } });
  }
  return res.json({ message: "ok" });
};

