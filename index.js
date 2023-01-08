import express from 'express';
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import AuthRoute from './Routes/AuthRoute.js';
import UserRoute from'./Routes/UserRoute.js';
import PostRoute from './Routes/PostRoute.js';
import UploadRoute from './Routes/UploadRoute.js';

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

dotenv.config();
const url = process.env.MONGO_DB;

const connectionParams={
    useNewUrlParser: true,
    useUnifiedTopology: true
}
mongoose.connect(url,connectionParams)
    .then( () => {
        app.listen(PORT);
        console.log(`Connected to database at ${PORT}`);
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })

    // usage of routes

    app.use('/auth',AuthRoute);
    app.use('/user',UserRoute);
    app.use('/post',PostRoute);
    app.use('/upload',UploadRoute);
    