import express from "express";
import auth from "../middleware/auth.js";
import * as ctrl from "../controllers/postController.js";
import { validatePost } from "../middleware/validation.js";

const router = express.Router();

router.get("/", ctrl.getAllPosts);
router.get("/:id", ctrl.getPost);
router.post("/", auth, validatePost, ctrl.createPost);
router.put("/:id", auth, validatePost, ctrl.updatePost);
router.delete("/:id", auth, ctrl.deletePost);
router.post("/:id/like", auth, ctrl.toggleLike);

export default router;
