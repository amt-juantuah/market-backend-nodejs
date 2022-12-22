const router = require('express').Router();
const userModel = require('../models/UserModel');
const CryptoJS = require('crypto-js');
const dotenv = require('dotenv');
const JWT = require('jsonwebtoken');
const { authAndTokenMiddleware } = require('./tokenMiddleware');

router.put('/:id', authAndTokenMiddleware, async (req, res) => {
    if (req.body.password) {
      const encryptPassword = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PHRASE
      ).toString();
    }
})

module.exports = router