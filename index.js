import express from 'express';
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import AuthRoute from './Routes/AuthRoute.js';
import UserRoute from'./Routes/UserRoute.js';
import PostRoute from './Routes/PostRoute.js';
import UploadRoute from './Routes/UploadRoute.js';


dotenv.config();
const PORT=process.env.PORT || 5000

// Routes
const app=express();

// to serve images for public
app.use(express.static('public'))
app.use('/images',express.static("images"))
// Middleware
app.use(bodyParser.json({limit:'30mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'30mb',extended:true}));
app.use(cors())


// const url = process.env.MONGO_URI;

const connectionParams={
    useNewUrlParser: true,
    useUnifiedTopology: true
}
mongoose.connect(process.env.MONGO_URI,connectionParams)
    .then( () => {
        app.listen(PORT);
        console.log(`Connected to database at ${PORT}`);
    })
    .catch((error) => {
        console.error(`Error connecting to the database. \n${error}`);
    })

    // usage of routes

    app.use('/auth',AuthRoute);
    app.use('/user',UserRoute);
    app.use('/post',PostRoute);
    app.use('/upload',UploadRoute);
    