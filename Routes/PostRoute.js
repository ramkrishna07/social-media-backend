import express from "express";
import { createPost, deletePost, getPost, getTimelinePosts, likePost, updatePost } from "../Controllers/PostController.js";
import authMiddleWare from "../MiddleWare/authMiddleWare.js";
const router=express.Router()


// create a new post
router.post('/',createPost)
// get a post
router.get('/',getPost)
// update a post
router.put('/:id',authMiddleWare,updatePost)
// delete a post
router.delete('/:id',authMiddleWare,deletePost)
// like a post
router.put('/:id/like',authMiddleWare,likePost)
// get timeline post
router.get('/:id/timeline',authMiddleWare,getTimelinePosts)
export default router;