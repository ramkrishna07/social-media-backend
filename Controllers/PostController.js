import mongoose from "mongoose";
import PostModel from "../Models/postModel.js";
import UserModel from "../Models/userModel.js";


// create new post

export const createPost=async(req,res)=>{
    const {userId,desc,image,location}=req.body;
    const user=await UserModel.findById(userId);
    const newPost=new PostModel({
        userId,
        username:user.username,
        firstname:user.firstname,
        lastname:user.lastname,
        profileImage:user.profilePicture,
        desc,
        location,
        likes:[],
        comments:[],
        image,
    });
    // const newPost=new PostModel(req.body);

    try{
        await newPost.save()
        res.status(201).json(newPost)
    }catch(error){
        res.status(500).json(error)
    }
}

// get a post

export const getPost=async(req,res)=>{
    const id =req.params.id

    try{
        const post =await PostModel.findById(id)
        res.status(201).json(post)
    }catch(error){
        res.status(500).json(error)
    }
}

// update a post

export const updatePost=async(req,res)=>{
    const postId =req.params.id
    const {userId}=req.body

    try{
        const post=await PostModel.findById(postId)
        // if user want to update own post
        if(post.userId===userId){
            await post.updateOne({$set:req.body})
            res.status(201).json("post updated")
        }
         // if user want to update other's post
        else{
            res.status(403).json("Access forbiden")
        }
    }catch(error){
        res.status(500).json(error)
    }
}

// delete a post

export const deletePost=async(req,res)=>{
    const id =req.params.id
    const {userId}=req.body

    try{

        const post =await PostModel.findById(id)
        // if user want to delete own post
        if(post.userId===userId){
            await post.deleteOne();
            res.status(201).json("post deleted")
        }
        // if user want to delete other's post
        else{
            res.status(403).json("Access forbiden")
        }
    }catch(error){
        res.status(500).json(error)
    }
}


//like or dislike a post

export const likePost=async(req,res)=>{
    const id =req.params.id
    const {userId}=req.body

    try{


        const post =await PostModel.findById(id)
        // if not like till now
        if(!post.likes.includes(userId)){
            await post.updateOne({$push : {likes : userId}})
            res.status(201).json("post liked")
        }
        // dislike a post
        else{
            await post.updateOne({$pull : {likes : userId}})
            res.status(201).json("post unliked")
        }
    }catch(error){
        res.status(500).json(error)
    }
}

// get timeline post

export const getTimelinePosts=async(req,res)=>{
    const userId=req.params.id

    try{

        const currentUserPosts=await PostModel.find({userId : userId})
        const followingPosts=await UserModel.aggregate([
            {
                $match: {
                    _id : new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from : "posts",
                    localField : "following",
                    foreignField : "userId",
                    as : "followingPosts"
                }
            },
            {
                $project: {
                    followingPosts : 1,
                    _id: 0
                }
            }
        ])

        res.status(201).json(currentUserPosts.concat(...followingPosts[0].followingPosts)
        .sort((a,b)=>{
            return b.createdAt -a.createdAt; // it will show latest post on timeline
        })
        );
    }catch(error){
        res.status(500).json(error)
    }
}