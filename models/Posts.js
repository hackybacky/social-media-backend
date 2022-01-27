const mongoose = require("mongoose");
//creating user schema 

const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        max:500,
    },
    img: {
        type:String,
    },
    likes: {
        type: Array,
        default:[],
        
    },


},
    {
        timestamps: true
    }

);

//exporting model as User (only accessed through name User)
module.exports = mongoose.model("Post", PostSchema)