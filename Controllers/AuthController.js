import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

// registering a new user
export const registerUser=async(req,res)=>{
    const salt=await bcrypt.genSalt(10)
    const hashedPass=await bcrypt.hash(req.body.password,salt)
    req.body.password=hashedPass
    // mapping
    const newUser=new UserModel(req.body)
    const {username}=req.body

    try{

        const oldUser=await UserModel.findOne({username})

        if(oldUser){
            return res.status(400).json({message:"username is already register"})
        }
        const user=await newUser.save();

        const token=jwt.sign({
            username: user.username, id:user._id
        },process.env.JWT_KEY,{expiresIn: '1h'})
        res.status(201).json({user,token});
    }catch(error){
        res.status(500).json({message:error.message})
    }
};

// login user

export const loginUser=async (req,res)=>{
    const{username,password}=req.body

    try{
        // finding the username on the database
        const user=await UserModel.findOne({username:username})

        if(user){
            // if user matched then comparing the password present at the database and the entered password
            const validity=await bcrypt.compare(password,user.password)
            // if password not matched
            if(!validity){
                res.status(400).json("wrong password")
            }
            else{
                const token=jwt.sign({
                    username: user.username, id:user._id
                },process.env.JWT_KEY,{expiresIn: '1h'})
                res.status(201).json({user,token})
            }
        }
        else{
            res.status(404).json("User does not exists")
        }
    }catch(error){
        res.status(500).json({message:error.message});
    }
}