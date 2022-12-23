const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        img: {
            type: String,
            required: true,
        },

        category: {
            type: Array,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
            index: true,
            unique: true
        },
        price: {
            type: Number,
            required: true,
        },
        source: {
            type: String,
            required: true,
        },
        discount: {
            type: Number,
            default: 0,
        },
        volumeperpiece: {
            type: String,
            required: true,
        },
        sku: {
            type: String,
            required: true,
        },
        skuquantity: {
            type: Number,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("productModel", productSchema);