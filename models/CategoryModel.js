const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        img: {
            type: String,
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
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("categoryModel", categorySchema);