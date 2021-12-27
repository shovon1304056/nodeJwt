const express = require('express');
const { User } = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const authUser = async(req, res) => {

    let existingUser = await User.findOne({
        email: req.body.email
    });

    if (!existingUser) {
        return res.status(400).send("User not found! User naming or password is incorrect!");
    }

    let reqData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }

   const validUser = await bcrypt.compare(reqData.password, existingUser.password);

   if(!validUser){
       return res.status(400).send("User not found! User naming or password is incorrect!");
   }

   // create payload
   const token = jwt.sign({
       _id: existingUser._id,
       email : existingUser.email
   },'secretKey');


   res.send(token);

}

router.route('/')
    .post(authUser);


module.exports = router;