const router = require('express').Router();
const productModel = require('../models/ProductModel');
const { adminAndTokenMiddleware } = require('./tokenMiddleware');

// CREATE PRODUCT
// only admin can create a new product
router.post('/:id', adminAndTokenMiddleware, async (req, res) => {

    if (!req.body.img || !req.body.category || !req.body.description 
        || !req.body.title || !req.body.price || !req.body.source 
        || !req.body.volumeperpiece || !req.body.sku || !req.body.skuquantity) {
            res.status(400).json({
              success: false,
              error:
                "Bad request!. Send needed params to create product",
            });
        }
    try {
        const product = new productModel(req.body);
        const savedProduct = await product.save();
        res.status(201).json({
          success: true,
          message: "product created successfully",
          data: savedProduct,
        });
    } catch (error) {
        res
          .status(500)
          .json({ success: false, message: "product not created", reason: error });
    }
} )

// UPDATE PRODUCT
// only admin can update a product
router.put('/:id', adminAndTokenMiddleware, async (req, res) => {

    try {
      // update the product information
      const updatedProduct = await productModel.findByIdAndUpdate(
        req.body.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      if (updatedProduct) {
        
        res.status(200).json({
          success: true,
          message: "method (:update) was successful",
          data: updatedProduct,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "method (:update) failed",
          reason: "product not found",
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


// DELETE ANY PRODUCT RECORD
// admin with valid admin status and token should be able to 
// delete any product record
router.delete("/:id", adminAndTokenMiddleware, async (req, res) => {
    try {
      const prodDel = await productModel.findByIdAndDelete(req.body.id);
      if (prodDel) {
        res.status(200).json({
          success: true,
          message: "method (:delete) was successful",
          data: "product has been deleted",
        });
      } else {
        res.status(500).json({
          success: false,
          message: "method (:delete) failed",
          reason: "product account not found",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "method (:delete) failed. Could not delete the product record",
        reason: error,
      });
    }
})

// FIND A PRODUCT
// anyone can view a product
router.get("/:id", async (req, res) => {
  try {
    const foundProduct = await productModel.findById(req.params.id);
    if (foundProduct) {
      res.status(200).json({
        success: true,
        message: "method (:get) was successful",
        data: foundProduct,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "method (:get) failed",
        reason: "product account not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "method (:get) failed. Could not get product",
      reason: error,
    });
  }
})


// ALL PRODUCTS
// anyone can view a product
router.get("/", async (req, res) => {
  try {
    let products;

    const queryIsNew = req.query.new;

    const queryIsCategory = req.query.category;


    if (queryIsNew && !queryIsCategory) {
        products = await productModel.find({}).sort({createdAt: -1}).limit(20);
    } else if (!queryIsNew && queryIsCategory) {
        products = await productModel.find({
            category: {
                $in: [queryIsCategory]
            }
        });
    } else if (queryIsNew && queryIsCategory) {
        products = await productModel.find({
            category: {
                $in: [queryIsCategory]
            }
        }).sort({createdAt: -1}).limit(20);
    } else {
        products = await productModel.find({});
    }

    if (products) {
      res.status(200).json({
        success: true,
        message: "method (:get) was successful",
        data: products,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "method (:get) failed",
        reason: "products not found",
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



module.exports = router;