import express from "express";
import { createPost, deletePost, getPost, getTimelinePosts, likePost, updatePost } from "../Controllers/PostController.js";

const router=express.Router()


// create a new post
router.post('/',createPost)
// get a post
router.get('/:id',getPost)
// update a post
router.put('/:id',updatePost)
// delete a post
router.delete('/:id',deletePost)
// like a post
router.put('/:id/like',likePost)
// get timeline post
router.get('/:id/timeline',getTimelinePosts)
export default router;