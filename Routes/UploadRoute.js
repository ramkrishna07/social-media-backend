import express from 'express'
const router =express.Router()
import multer from 'multer'

// it is used for storing the images into local storage into public/images folder
const storage=multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,"public/images");
    },
    filename: (req,file,cb)=>{
        cb(null,req.body.name);
    },
});

const upload=multer({storage: storage});

router.post('/',upload.single("file",(req,res)=>{
    try {
        return res.status(201).json("file uploaded successfully")
    } catch (error) {
        console.log(error);
    }
}))

export default router