const router = require('express').Router();
const orderModel = require('../models/OrderModel');
const { tokenMiddleware, adminAndTokenMiddleware } = require('./tokenMiddleware');

// CREATE Order
// only user with token can create a order
router.post('/:id', tokenMiddleware, async (req, res) => {

    try {
        const order = new orderModel(req.body);
        const savedOrder = await order.save();
        res.status(201).json({
          success: true,
          message: "order created successfully",
          data: savedOrder,
        });
    } catch (error) {
        res
          .status(500)
          .json({ success: false, message: "order not created", reason: error });
    }
} )


// UPDATE order
// only user with token can update a order
router.put('/:id', adminAndTokenMiddleware, async (req, res) => {

  try {
    // update the order information
    const updatedOrder = await orderModel.findByIdAndUpdate(
      req.body.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    if (updatedOrder) {
      
      res.status(200).json({
        success: true,
        message: "method (:update) was successful",
        data: updatedOrder,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "method (:update) failed",
        reason: "order not found",
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


// DELETE ANY ORDER RECORD
// only admin with token can delete any order record
router.delete("/:id", adminAndTokenMiddleware, async (req, res) => {
  try {
    const orderDel = await orderModel.findByIdAndDelete(req.body.id);
    if (orderDel) {
      res.status(200).json({
        success: true,
        message: "method (:delete) was successful",
        data: "order has been deleted",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "method (:delete) failed",
        reason: "order account not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "method (:delete) failed. Could not delete the order record",
      reason: error,
    });
  }
})

// FIND A user order
// user with token can view her orders
router.get("/:id", tokenMiddleware, async (req, res) => {
  try {
    const foundOrders = await orderModel.find({ userId: req.params.id});
    if (foundOrders) {
      res.status(200).json({
        success: true,
        message: "method (:get) was successful",
        data: foundOrders,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "method (:get) failed",
        reason: "orders not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "method (:get) failed. Could not get Orders",
      reason: error,
    });
  }
})


// ALL ORDERS
// admin with token can view all orders
router.get("all/:id", adminAndTokenMiddleware, async (req, res) => {
  try {
    const allOrders = await orderModel.find({});

    if (allOrders) {
      res.status(200).json({
        success: true,
        message: "method (:get) was successful",
        data: allOrders,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "method (:get) failed",
        reason: "orders not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "method (:get) failed. Could not find all orders",
      reason: error,
    });
  }
})


// ORDER STATISTICS
// admin with valid admin status and token should be able to 
// get all statistics of orders from db
router.get("/admin/stats/:id", adminAndTokenMiddleware, async (req, res) => {
  
    // find date for last year today
    const date = new Date();
    lastYearToday = new Date(date.setFullYear(date.getFullYear() - 1));
  
    try {
  
      const dataAggregate = await orderModel.aggregate([
        {
          $match: { createdAt: { $gte: lastYearToday } }
        },
        {
          $project: { month: { $month: "$createdAt" }, sales: "$amount", products: "$products" },
        },
        {
          $group: { _id: "$month", count: { $sum: 1}, total: { $sum: "$sales" } }
        }
      ])
  
      if (dataAggregate) {
        // const { password, ...others } = foundUser._doc;
        res.status(200).json({
          success: true,
          message: "method (:get) was successful",
          title: "A Year Today Sales Per Month",
          data: dataAggregate,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "method (:get) failed",
          reason: "order stats not found",
        });
      }
      
    } catch (error) {
        console.log(error);
      res.status(500).json({
        success: false,
        message: "method (:get) failed. Could not retrieve order statistics",
        reason: error,
      });
    }
  })


module.exports = router