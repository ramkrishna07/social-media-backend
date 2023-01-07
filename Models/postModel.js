import mongoose from "mongoose";

const postSchema=new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
    },
    firstname:{
        type: String,
        required: true,
    },
    lastname:{
        type: String,
        required: true,
    },
    desc:String,
    location: String,
    likes:[],
    comments:{
        type: Array,
        default: [],
    },
    image:String,
    profileImage:String,
},
{
    timestamps:true
}
);

const PostModel=new mongoose.model("Posts",postSchema)

export default PostModel