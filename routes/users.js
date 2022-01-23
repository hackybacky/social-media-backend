const router = require("express").Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

//:id here refers to the value of paramater present in
//req.params container here id can be any string but we taken id

router.put('/:id', async (req, res) => {
    
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        //checking if password update is required or not 
        if (req.body.password) {
            //updating password 
            try {
                //hasing password 
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);


            }
            catch (err) {

                return res.status(500).json(err)
            }
        }
        //finding user by params id and then updating the whole set of value 
        try {
            //findByIdAndUpdate(req.params.id, { $set: req.body }) set is used to set all previous parameter as
            //it is and set new value if any for their value change
            //findByIdAndUpdate method to find the user with given id and then udate the user
            const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body });
            res.status(200).json("Account has be updated successfully")
            
            
        }
        catch (err) {
            return res.status(500).json(err)
        }

    }
    else {
        res.status(500).json("you can update only you account");
    }
});

/////delete user from our system

router.delete('/:id', async (req, res) => {
    //checking if user is deleting its own account
    if (req.params.id === req.body.userId || req.body.isAdmin) {

        try {
            //finding user whom we want to delete and then delete;
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json("User deleted Successfully")
           
        } catch (err) {
            
            res.status(500).json(err)
        }
        
    }
    else {
        res.status(500).json("You can delete only your account")
    }
    
});

//get User getting user information for frontend and many other work;

router.get('/:id', async (req, res) => {
    
    try {
        //finding user by id given in params or we can say after path 
        const user = await User.findById(req.params.id);
        //user._doc contains all the information about user .User is retrieved from database
        // we only want to send information other then password
        const { password, updatedAt, ...other } = user._doc
        res.status(200).json(other);
    } catch (err) {
        res.status(500).json(err);
    }
    
});


///followers and following request handler
//id is id of accoutn you want to follow 
router.put('/:id/follow', async (req, res) => {
    //checking if u are following yourself or not you cann't follow yourself
    if (req.body.userId !== req.params.id) {
        try {
            //retrieving data of current account 
            // and accoutn you want to follow 
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            //checking if u already followed that accoutn or not 
            if (!user.followers.includes(req.body.userId)) {

                user.followers.push(req.body.userId);
                user.save();
                currentUser.following.push(req.params.id);
                currentUser.save();
                res.status(200).json("YOU successfully followed this account")
                
            }
            else {
                //if accoutn already followed 
                res.status(403).json("yOU already followed this account");
            }
            
        } catch (err) {
            res.status(500).json(err);
        }
    }
    else {
        res.status(500).json("you can not follow yourself")
    }
});

//Unfollow a user

//Here id is a the id which of user which you   want to
//unfollow we got to there page and unfollow them

router.put('/:id/unfollow', async (req, res) => {
    //if user unfollowing itself or not
    if (req.body.userId !== req.params.id) {
        try {
            //user is the user you want to unfollow 
            //yu are current user 
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            //checking if user includes current follower or not
            if (user.followers.includes(req.body.userId)) {
                //if incldues then pulling from user and current user 
                user.followers.pull(req.body.userId);
                user.save();
                currentUser.following.pull(req.params.id);
                currentUser.save();
                res.status(200).json("YOU successfully unfollowed this account")

            }
            else {
                //if you are not following that account u cann't unfollow them
                res.status(403).json("you are not following this account");
            }

        } catch (err) {
            res.status(500).json(err);
        }
    }
    else {
        
        res.status(500).json("you can not unfollow yourself")
    }
});

module.exports = router