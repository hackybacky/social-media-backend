const { append } = require("express/lib/response");
const { process_params } = require("express/lib/router");

const router = require("express").Router();
const Post= require('../models/Posts')

//create a Post

router.post("/",async (req, res) => {
    const newPost = await new Post(req.body);

    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost)

        
    } catch {
        res.status(500).json(err)
    }
})

//update post

router.put('/:id',async (req, res) => {
    const user = await Post.findById(req.params.id)
   
    if (user.userId === req.body.userId) {
        try {
            user.updateOne({ $set: req.body });
            res.status(200).json("post updated successfully")
        } catch {
            res.status(403).json(err);
        }
    }
    else {
        res.status(403).json(" YOu can update only your post ")
    }
})

//delete post


router.delete('/:id',async (req, res) => {
    
    
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
        try {

            await post.deleteOne();
            res.status(200).json("post deleted successfully")
            
        } catch {
            res.status(403).json(err);
        }
    }
    else {
        res.status(403).json("YOu can delete only your post")
    }
    //if(user.userId==req.body.user)
    
})







module.exports = router;