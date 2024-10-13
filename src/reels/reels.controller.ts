import { Router } from "express";
import { auth } from "../auth/middleware";
import {
  createComment,
  createReels,
  deleteComment,
  editReels,
  getComments,
  getCreatorReels,
  getLikes,
  getReels,
  likeReel,
  saveReel,
  shareReel,
} from "./reels.service";

const router = Router();

router.get("/reels", auth, getReels);

router.get("/reels/:userId", auth, getCreatorReels);

router.post("/reels/create", auth, createReels);

router.patch("/reels/:id/edit", auth, editReels);

router.put("/reels/:id/like", auth, likeReel);

router.put("/reels/:id/create-comment", auth, createComment);

router.get("/reels/:id/comments", auth, getComments);

router.delete("/reels/:id/delete-comment", auth, deleteComment);

router.patch("/reels/:id/save", auth, saveReel);

router.post("/reels/:id/share", auth, shareReel);

router.get("/reels/:id/likes", auth, getLikes);

export default router;
