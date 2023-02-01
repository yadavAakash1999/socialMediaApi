const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/posts');
const multer = require('multer')
const path = require("path");
dotenv.config();
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser : true, useUnifiedTopology : true}, ()=>{
    console.log("Connected to MongoDB");
});

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use(express.json());
app.use(cors())
app.use(helmet())
app.use(morgan('common'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      cb(null, req.body.name);
    },
  });
  
  const upload = multer({ storage: storage });
  app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
      return res.status(200).json("File uploded successfully");
    } catch (error) {
      console.error(error);
    }
  });


app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use('/api/posts', postRouter);

app.listen(8080, ()=>{
    console.log("server started on 8080");
})