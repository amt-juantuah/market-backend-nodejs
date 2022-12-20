const userModel = require('../models/UserModel')
const router = require('express').Router();


// register a new user
router.post('/register', async (req, res) => {

    // check that all required params are provided
    if (req.body.username 
        && req.body.email
        && req.body.password
        && req.body.fullname
        ) {
        // asunc await for db transaction
        try {
            // create new user with the params from the new registration
            const newUser = new userModel(
                {
                    username: req.body.username,
                    email: req.body.email,                    
                    password: req.body.password,
                    fullname: req.body.fullname,
                    represents: req.body.represents,
                    companyname: req.body.companyname,
                    isAdmin: req.body.isAdmin,
                }
            );
    
        // save the new user if exists
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
        } catch (error) {
            res.status(500).json(error)
        }
    } 
    else {
        res.status(400).json("an error occured with some user details missing")
    }
    

    
})

module.exports = router;