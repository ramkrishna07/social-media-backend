import express from "express";
import { deleteUser, getUser, updateUser, followUser, UnFollowUser, getAllUsers } from "../Controllers/UserController.js";
import authMiddleWare from "../MiddleWare/authMiddleWare.js";
const router =express.Router();

router.get('/',getAllUsers)
// getting
router.get('/:id',getUser)
// updating
router.put('/:id',authMiddleWare,updateUser)
// deleting account
router.delete('/:id',authMiddleWare,deleteUser)
// follow a user
router.put('/:id/follow',authMiddleWare,followUser)
// unfollow a user
router.put('/:id/unfollow',authMiddleWare,UnFollowUser)

export default router;