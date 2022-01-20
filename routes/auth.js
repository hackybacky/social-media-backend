const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
router.post('/register', async (req, res) => {
    
    
    try {
        ///hashing password

       

       
        const Username = req.body.username;
        const Email = req.body.email;

        //checking if user already exists

        const nUser = await User.findOne({ email: req.body.email })

        if (nUser) {
            return res.status(500).json("User already exists with this email")
        }
        
        //checking if any required field empty or not

        if (!Username || !Email || !req.body.password) {
            return res.send("please fill all details")
        }
        //if all ok saving user into database database accessed by model

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        const newUser = await new User({
            username: Username,
            password: hashedPassword,
            email: Email,
            relationship:req.body.relationship
        })

        const user = await newUser.save();
        res.status(200).json(user);
        console.log("user saved successfully on auth/register page")
    }
    catch (err) {
        res.status(500).json(err);
    }
    
})

router.post('/login', async (req, res) => {
    try {
        //findding user with useremail

        const user = await User.findOne({ email: req.body.email });

        //checking user exits or not

        if (!user) return res.status(404).json("User not found")
        
        //validating password

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        
        if(!validPassword ){
            return  res.status(404).json("password incorrect")
    
        }
         
        //if password correct sending user information 
        res.status(200).json(user)
        
    }
    catch (err) {
        if (err) {
            res.status(500).json(err)
        }
    }
})

//exporting router 
module.exports = router