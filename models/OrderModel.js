const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    { 
        userId: {
            type: String,
            required: true,
        },
        products: [
            {
                productId: {
                    type: String,
                },
                productName: {
                    type: String,
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
            }
        ],
        amount: {
            type: Number,
            required: true
        },
        useraddress: {
            type: Object,
            required: true,
        },
        status: {
            type: String,
            default: "pending",
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("orderModel", orderSchema);