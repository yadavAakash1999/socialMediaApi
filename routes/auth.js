const router = require('express').Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');

//REGISTER
router.post("/register", async (req, res)=>{
                
        try{
            // HASHED PASSWORD
            const salt = await bcrypt.genSalt(10);
            const hashedpassword = await bcrypt.hash(req.body.password, salt);

            //CREATE NEW USER
            const newUser = new User({
                username : req.body.username,
                email : req.body.email,
                password : hashedpassword,
            })

            // RESPOND
            const user = await newUser.save();
            res.status(200).json(user);
        }
        catch(err){
            res.status(500).json(err);
        }
    
})

//lOGIN
    router.post("/login", async (req, res)=>{
        try{
            const user = await User.findOne({email : req.body.email});
            !user && res.status(400).send('user not found');

            const validpassword = await bcrypt.compare(req.body.password, user.password);
            !validpassword && res.status(404).json("password not match")

            res.status(200).json(user);
        
        }
        catch(err){
            res.status(500).json(err);
        }

    })

module.exports = router;