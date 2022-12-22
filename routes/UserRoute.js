const router = require('express').Router();
const userModel = require('../models/UserModel');
const CryptoJS = require('crypto-js');
const dotenv = require('dotenv');
const JWT = require('jsonwebtoken');
const { authAndTokenMiddleware } = require('./tokenMiddleware');

router.put('/:id', authAndTokenMiddleware, async (req, res) => {
    if (req.body.password) {
      const encryptPassword = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PHRASE
      ).toString();

      req.body.password = encryptPassword;
    }

    try {
      // update the user information
      const updatedUser = await userModel.findByIdAndUpdate(
        req.user.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      // strip password out
      const { password, ...others } = updatedUser._doc;

      res.status(200).json({
        success: true,
        message: "update was successfully",
        data: others,
      });
    } catch (error) {
        res.status(500).json({
          success: false,
          message: "update failed",
          reason: error,
        });
    }
})

module.exports = router