const router = require("express").Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

//:id here refers to the value of paramater present in
//req.params container here id can be any string but we taken id

router.put('/:id', async (req, res)=>{
    
    if (req.body.userId === req.params.id) {
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
            
            const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body });
            res.status(200).json("Account has be updated successfully")
            
            
        }
        catch (err){
            return res.status(500).json(err)
        }

    }
    else {
        res.status(500).json("you can update only you account");
    }
})

module.exports = router