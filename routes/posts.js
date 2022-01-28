const { append } = require("express/lib/response");
const { process_params } = require("express/lib/router");

const router = require("express").Router();
const Post = require('../models/Posts');
const User = require("../models/User");

//create a Post

router.post("/", async (req, res) => {
    const newPost = await new Post(req.body);

    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost)


    } catch {
        res.status(500).json(err)
    }
})

//update post

router.put('/:id', async (req, res) => {

    try {
        const user = await Post.findById(req.params.id)
        if (user.userId === req.body.userId) {

            await Post.findByIdAndUpdate(req.params.id, { $set : req.body });

            res.status(200).json("post updated successfully")
        }

        else {
            res.status(403).json(" YOu can update only your post ")
        }
    }
    catch (err) {
        res.status(403).json(err);
    }
})

//delete post


router.delete('/:id', async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {


            await post.deleteOne();
            res.status(200).json("post deleted successfully")

        }
        else {
            res.status(403).json("YOu can delete only your post")
        }
    }
    catch (err) {
        res.status(403).json(err);
    }


    //if(user.userId==req.body.user)

})


//like dislike

router.put('/:id/like', async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("post liked successfully");
        }
        else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("post disliked ")
        }

    }
    catch (err) {
        res.status(500).json(err);
    }
})


// get post

router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post);

    } catch (err) {
        res.status(500).json(err);
    }
})


///get timeline

router.get('/timeline/all', async (req, res) => {
    try {

        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.following.map((friendId) => {
                return Post.find({ userId: friendId })
            })
        );
        res.json(userPosts.concat(...friendPosts));

    } catch (err) {
        res.status(500).json(err);
    }
})



module.exports = router;