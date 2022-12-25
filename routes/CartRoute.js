const router = require('express').Router();
const cartModel = require('../models/CartModel');
const { tokenMiddleware, adminAndTokenMiddleware } = require('./tokenMiddleware');

// CREATE Cart
// only user with token can create a cart
router.post('/:id', tokenMiddleware, async (req, res) => {

    try {
        const cart = new cartModel(req.body);
        const savedCart = await cart.save();
        res.status(201).json({
          success: true,
          message: "cart created successfully",
          data: savedCart,
        });
    } catch (error) {
        res
          .status(500)
          .json({ success: false, message: "cart not created", reason: error });
    }
} )


// UPDATE CART
// only user with token can update a cart
router.put('/:id', tokenMiddleware, async (req, res) => {

  try {
    // update the cart information
    const updatedCart = await cartModel.findByIdAndUpdate(
      req.body.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    if (updatedCart) {
      
      res.status(200).json({
        success: true,
        message: "method (:update) was successful",
        data: updatedCart,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "method (:update) failed",
        reason: "cart not found",
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


// DELETE ANY Cart RECORD
// only user with token can delete any cart record
router.delete("/:id", tokenMiddleware, async (req, res) => {
  try {
    const cartDel = await cartModel.findByIdAndDelete(req.body.id);
    if (cartDel) {
      res.status(200).json({
        success: true,
        message: "method (:delete) was successful",
        data: "cart has been deleted",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "method (:delete) failed",
        reason: "cart account not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "method (:delete) failed. Could not delete the cart record",
      reason: error,
    });
  }
})

// FIND A user Cart
// user with token can view her cart
router.get("/:id", tokenMiddleware, async (req, res) => {
  try {
    const foundCart = await cartModel.findOne({ userId: req.params.id});
    if (foundCart) {
      res.status(200).json({
        success: true,
        message: "method (:get) was successful",
        data: foundCart,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "method (:get) failed",
        reason: "Cart account not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "method (:get) failed. Could not get Cart",
      reason: error,
    });
  }
})


// ALL CARTS
// admin with token can view all carts
router.get("all/:id", adminAndTokenMiddleware, async (req, res) => {
  try {
    const allCarts = await cartModel.find({});

    if (allCarts) {
      res.status(200).json({
        success: true,
        message: "method (:get) was successful",
        data: allCarts,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "method (:get) failed",
        reason: "carts not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "method (:get) failed. Could not find all carts",
      reason: error,
    });
  }
})



module.exports = router