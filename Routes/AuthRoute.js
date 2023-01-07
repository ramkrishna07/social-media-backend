import express from 'express';
import { loginUser, registerUser } from '../Controllers/AuthController.js';
const router=express.Router()

// router.get('/',async(req,res)=>{
//     res.send("Auth Routes")
// })

router.post('/register',registerUser)
router.post('/login',loginUser)

export default router