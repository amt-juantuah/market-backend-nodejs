const userModel = require('../models/UserModel')
const router = require('express').Router();
const CryptoJS = require('crypto-js');
const dotenv = require('dotenv');
const { findOne } = require('../models/UserModel');

dotenv.config();


// register a new user
router.post("/register", async (req, res) => {
  try {
    // create new user with the params from the new registration
    const newUser = new userModel({
      username: req.body.username,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PHRASE
      ).toString(),
      fullname: req.body.fullname,
      represents: req.body.represents,
      companyname: req.body.companyname,
      isAdmin: req.body.isAdmin,
    });

    // save the new user if exists
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(501).json(error);
  }
});

router.post(('/login'), async (req, res) => {
    try {
        const user = await findOne()    
    } catch (error) {
        res.status(500).json('user not found');
    }
    
})

module.exports = router;