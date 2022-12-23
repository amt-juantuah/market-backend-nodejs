const router = require('express').Router();
const categoryModel = require('../models/CategoryModel');
const { tokenMiddleware, adminAndTokenMiddleware } = require('./tokenMiddleware');

// CREATE CATEGORY
// only admin can create a new category
router.post('/:id', adminAndTokenMiddleware, async (req, res) => {

    if (!req.body.img || !req.body.description || !req.body.title) {
            res.status(400).json({
              success: false,
              error:
                "Bad request!. Send needed params to create category",
            });
        }
    try {
        const category = new categoryModel(req.body);
        const savedCategory = await category.save();
        res.status(201).json({
          success: true,
          message: "category created successfully",
          data: savedCategory,
        });
    } catch (error) {
        res
          .status(500)
          .json({ success: false, message: "category not created", reason: error });
    }
} )


// UPDATE CATEGORY
// only admin can update a category
router.put('/:id', adminAndTokenMiddleware, async (req, res) => {

    try {
      // update the category information
      const updatedCategory = await categoryModel.findByIdAndUpdate(
        req.body.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      if (updatedCategory) {
        
        res.status(200).json({
          success: true,
          message: "method (:update) was successful",
          data: updatedCategory,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "method (:update) failed",
          reason: "category not found",
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


// DELETE ANY CATEGORY RECORD
// admin with valid admin status and token should be able to 
// delete any category record
router.delete("/:id", adminAndTokenMiddleware, async (req, res) => {
    try {
      const catDel = await categoryModel.findByIdAndDelete(req.body.id);
      if (catDel) {
        res.status(200).json({
          success: true,
          message: "method (:delete) was successful",
          data: "category has been deleted",
        });
      } else {
        res.status(500).json({
          success: false,
          message: "method (:delete) failed",
          reason: "category account not found",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "method (:delete) failed. Could not delete the category record",
        reason: error,
      });
    }
})


// FIND A CATEGORY
// anyone can view a category
router.get("/:id", async (req, res) => {
    try {
      const foundCategory = await categoryModel.findById(req.params.id);
      if (foundCategory) {
        res.status(200).json({
          success: true,
          message: "method (:get) was successful",
          data: foundCategory,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "method (:get) failed",
          reason: "category account not found",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "method (:get) failed. Could not get category",
        reason: error,
      });
    }
  })


// ALL CATEGORIES
// anyone can view all categories
router.get("/", async (req, res) => {
  try {
    const foundCategories = await categoryModel.find({});
    if (foundCategories) {
      res.status(200).json({
        success: true,
        message: "method (:get) was successful",
        data: foundCategories,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "method (:get) failed",
        reason: "categories not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "method (:get) failed. Could not find categories",
      reason: error,
    });
  }
});
module.exports = router