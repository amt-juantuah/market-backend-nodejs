const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            index: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            index: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
        fullname: {
            type: String,
            required: true,
        },
        represents: {
            type: String,
        },
        companyname: {
            type: String,
            default: "",
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
    {
        collection: "users"
    }
);

const userModel = mongoose.model('userModel', userSchema);

// userModel.createIndexes();

module.exports = userModel;