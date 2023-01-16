import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// get all user

export const getAllUsers=async (req,res)=>{
    try {
        let users=await UserModel.find()

        users=users.map((user)=>{
            const {password,...otherDetails}=user._doc
            return otherDetails
        })
        res.status(201).json(users)
    } catch (error) {
        res.status(500).json(error);
    }
}


// get a user from database
export const getUser=async(req,res)=>{
    const id=req.params.id;
    try{
        const user=await UserModel.findById(id);

        if(user){
            // take away the password from response
            const {password, ...otherDetails}=user._doc
            res.status(201).json(otherDetails)
        }
        else{
            res.status(404).json("No such user exist")
        }
    }catch(error){
        res.status(500).json(error)
    }
   
};

// update a user
export const updateUser=async(req,res)=>{
    const id =req.params.id
    const {_id,currentUserAdminStatus,password}=req.body

    // updating own profile or admin updating a user
    if(id===_id){
        try{
            // update password
            if(password){
                const salt=await bcrypt.genSalt(10);
                // converting entered password for updating to hashed password
                req.body.password=await bcrypt.hash(password,salt);
            }
            // id== whom information updating, req.body== informations which are updating, (new=true)==get information of updated user
            const user=await UserModel.findByIdAndUpdate(id,req.body,{
                new:true,
            });
            const token=jwt.sign(
                {username: user.username,id: user._id},
                process.env.JWT_KEY,
                {expiresIn:"1h"}
            );
            res.status(201).json({user,token})
        }catch(error){
            res.status(500).json(error)
        }
    }
    else{
        res.status(403).json("Access Denied you can't update other profile")
    }
}

// delete user

export const deleteUser=async(req,res)=>{
    const id =req.params.id;

    const {currentUserId,currentUserAdminStatus}=req.body

    if(currentUserId===id || currentUserAdminStatus){
        try{
            await UserModel.findByIdAndDelete(id)
            res.status(201).json("User account deleted successfully")
        }catch(error){
            res.status(500).json(error)
        }
    }
    else{
        res.status(403).json("Access Denied you can't delete other profile")
    }
}

// Follow a user
export const followUser=async (req,res)=>{
    const id =req.params.id

    const {_id}=req.body

    //currentUserId== wants to follow, id==whom user wants to follow
    // if try to follow himself
    if(_id===id){
        res.status(403).json("Action forbidden")
    }
    else{
        try{
            // whom user want to follow
            const followUser=await UserModel.findById(id)
            // who want to follow
            const followingUser=await UserModel.findById(_id)

            // if not follow already
            if(!followUser.followers.includes(_id)){
                // updating followers
                await followUser.updateOne({$push:{followers:_id}})
                // updating following
                await followingUser.updateOne({$push:{following:id}})
                res.status(201).json("User followed")
            }
            else{
                res.status(403).json("User is already followed by you")
            }
        }catch(error){
            res.status(500).json(error)
        }
    }
}
// Unfollow a user
export const UnFollowUser=async (req,res)=>{
    const id =req.params.id

    const {_id}=req.body

    //currentUserId== wants to follow, id==whom user wants to follow
    // if try to follow himself
    if(_id===id){
        res.status(403).json("Action forbidden")
    }
    else{
        try{
            // whom user want to follow
            const followUser=await UserModel.findById(id)
            // who want to follow
            const followingUser=await UserModel.findById(_id)

            // if follow already
            if(followUser.followers.includes(_id)){
                // updating followers
                await followUser.deleteOne({$pull:{followers:_id}})
                // updating following
                await followingUser.deleteOne({$pull:{following:id}})
                res.status(201).json("User unfollowed")
            }
            else{
                res.status(403).json("User is not followed by you")
            }
        }catch(error){
            res.status(500).json(error)
        }
    }
}