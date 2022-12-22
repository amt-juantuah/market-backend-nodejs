const router = require('express').Router();
const userModel = require('../models/UserModel');
const CryptoJS = require('crypto-js');
const dotenv = require('dotenv');
const JWT = require('jsonwebtoken');
const { tokenMiddleware, adminAndTokenMiddleware } = require('./tokenMiddleware');

// users with valid token will be able to update their records
router.put('/:id', tokenMiddleware, async (req, res) => {
  
    if (req.body.password) {
      // encrypt password
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
      if (updatedUser) {
        const { password, ...others } = updatedUser._doc;

        res.status(200).json({
          success: true,
          message: "method (:update) was successful",
          data: others,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "method (:update) failed",
          reason: "user account not found",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "method (:update) failed",
        reason: error,
      });
    }
})


// users with valid token should be able to delete their record
router.delete("/:id", tokenMiddleware, async (req, res) => {
  
    try {
      const docDel = await userModel.findByIdAndDelete(req.params.id);
      if (docDel) {
        res.status(200).json({
          success: true,
          message: "method (:delete) was successful",
          data: "user has been deleted",
        });
      } else {
        res.status(500).json({
          success: false,
          message: "method (:delete) failed",
          reason: "user account not found",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "method (:delete) failed",
        reason: error,
      });
    }
})

// admin with valid admin status and token should be able to 
// delete any users record
router.delete("/admin/:id", adminAndTokenMiddleware, async (req, res) => {
  
    try {
      const docDel = await userModel.findByIdAndDelete(req.body.deleteId);
      if (docDel) {
        res.status(200).json({
          success: true,
          message: "method (:delete) was successful",
          data: "user has been deleted",
        });
      } else {
        res.status(500).json({
          success: false,
          message: "method (:delete) failed",
          reason: "user account not found",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "method (:delete) failed",
        reason: error,
      });
    }
})


// admin with valid admin status and token should be able to 
// get a different user from db
router.get("/:id", tokenMiddleware, async (req, res) => {
  try {
    const foundUser = await userModel.findById(req.body.getId);
    if (foundUser) {
      const { password, ...others } = foundUser._;
      res.status(200).json({
        success: true,
        message: "method (:get) was successful",
        data: others,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "method (:get) failed",
        reason: "user account not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "method (:get) failed",
      reason: error,
    });
  }
})

module.exports = router

/*
201: created successfully
400: bad request from client
401: Unauthenticated--not authenticated (client identity not known to server)
403: Forbidden (client identity known to server but client not authorised to access resource)

*/ 