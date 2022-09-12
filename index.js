const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');

const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require("./routes/posts");
const commentRoute = require("./routes/comment");

const multer = require('multer');
const path = require("path")
dotenv.config();

mongoose.connect(process.env.MONGO_DB, () => {
    console.log("Connected to Mongo")
})

//use our image file directly on the web 

app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
    destination:(req, file, cb) =>{
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({storage})
app.post("/api/upload", upload.single("file"), (req, res) =>{
    try {
        return res.status(200).json("file uploaded succesfully. ")

    } catch (error) {
        res.status(500).json(error)
        
    }
})
//routers

app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/posts", postRoute)
app.use("/api/comment", commentRoute)

// app.get("/",(req, res) => {
//     res.send("welcome to home page");
// })

app.listen(8800, () => {
    console.log("Backend Server running .....")
})