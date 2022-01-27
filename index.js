const express = require("express");
const mongoose  = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();
const userRouter = require("./routes/users")
const userAuth = require("./routes/auth")
const userPost=require("./routes/posts")
//user to hide important keys
dotenv.config();
//connecting database
mongoose.connect(process.env.mongo_url, { useNewUrlParser: true,useUnifiedTopology:true }, () => {
    console.log("connected to MongoDB")
});
//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

//user all path after that appended eg userRouter get appended after api/user

app.use("/api/users", userRouter);
app.use("/api/auth", userAuth); 
app.use("/api/posts",userPost)
//listening port 8800

app.listen(8800, () =>  {
    console.log("Running at 8800")
})