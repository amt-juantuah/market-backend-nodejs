const userModel = require('../models/UserModel')
const router = require('express').Router();
const CryptoJS = require('crypto-js');
const dotenv = require('dotenv');
const JWT = require('jsonwebtoken');
// const { findOne } = require('../models/UserModel');

dotenv.config();

/* ROUTER FOR SIGNING UP OR REGISTERING A NEW USER */
// register a new user
router.post("/register", async (req, res) => {

  // check that all params were provided
  if (!req.body.username || !req.body.email || !req.body.password || !req.body.fullname) {
    res
      .status(400)
      .json({
        success: false,
        error: "Bad request!. Send needed params (username, email, password, fullname)",
      });
  }

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
    const { password, ...others } = savedUser._doc;
    res.status(201).json({
      success: true,
      message: "user created successfully",
      data: others,
    });

  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "user not created", reason: error });
  }
});


/* ROUTER FOR LOGING IN A USER */
// Login in a user
router.post("/login", async (req, res) => {

  // check that all params were provided
  if (!req.body.username || !req.body.password) {
    res.status(400).json({
      success: false,
      message: "Send needed params (username, password)",
      error: "Bad request!"
    });
  }

  try {
  
    // find the user from the db
      const user = await userModel.findOne({ username: req.body.username});
      
      // if user is not present, send an error message
      if (!user) {
        res.status(401).json({
          success: false,
          message: "Client not authenticated. Could be because of wrong credentials provided by client",
          error: "Unauthenticated!"
        })
      } else {
        // decrypt the password of the user in the db
        const decrypted = CryptoJS.AES.decrypt(user.password, process.env.PHRASE).toString(CryptoJS.enc.Utf8);

        // compare the decrypted password with the password used in login
        // if the two are same, then log the user in, else dont
        if (decrypted !== req.body.password) {
          res.status(401).json({
            success: false,
            message: "Client not authenticated. Could be because of ixcwr credentials provided by client",
            error: "Unauthenticated!"
          })
        } else {

          // provide JWT access token to user
          const accessToken = JWT.sign(
            {
              id: user._id,
              isAdmin: user.isAdmin,
            },
            process.env.JWT_SK,
            { expiresIn: "3d"}
          );
          // strip password out and send other details to frontend
          const { password, ...others } = user._doc;
          res.status(200).json({
            success: true,
            message: "Login successful",
            data: others,
            token: accessToken
          })
        }
      }

  } catch (error) {

    res
    .status(500)
    .json({ success: false, message: "user does not exist", reason: error });
  }
})

module.exports = router;