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

// USER DELETE INFO
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
        message: "method (:delete) failed. Could not delete",
        reason: error,
      });
    }
})

// DELETE ANY USER'S RECORD
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
        message: "method (:delete) failed. Could not delete the user record",
        reason: error,
      });
    }
})

// FIND A USER
// admin with valid admin status and token should be able to 
// get a different user from db
router.get("/admin/:id", adminAndTokenMiddleware, async (req, res) => {
  try {
    const foundUser = await userModel.findById(req.body.getId);
    if (foundUser) {
      const { password, ...others } = foundUser._doc;
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
      message: "method (:get) failed. Could not get user",
      reason: error,
    });
  }
})


// ALL USERS
// admin with valid admin status and token should be able to 
// get all users from db
router.get("/admin/all/:id", adminAndTokenMiddleware, async (req, res) => {
  try {
    const foundUsers = await userModel.find({});
    if (foundUsers) {
      // const { password, ...others } = foundUser._doc;
      res.status(200).json({
        success: true,
        message: "method (:get) was successful",
        data: foundUsers,
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
      message: "method (:get) failed. Could not find all",
      reason: error,
    });
  }
})

// USER STATISTICS
// admin with valid admin status and token should be able to 
// get all statistics of users from db
router.get("/admin/stats/:id", adminAndTokenMiddleware, async (req, res) => {
  
  // find date for last year today
  const date = new Date();
  lastYearToday = new Date(date.setFullYear(date.getFullYear() - 1));

  try {

    const dataAggregate = await userModel.aggregate([
      {
        $match: { createdAt: { $gte: lastYearToday } }
      },
      {
        $project: { month: { $month: "$createdAt" } }
      },
      {
        $group: { _id: "$month", total: { $sum: 1 } }
      }
    ])

    if (dataAggregate) {
      // const { password, ...others } = foundUser._doc;
      res.status(200).json({
        success: true,
        message: "method (:get) was successful",
        data: dataAggregate,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "method (:get) failed",
        reason: "user stats not found",
      });
    }
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "method (:get) failed. Could not retrieve user statistics",
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