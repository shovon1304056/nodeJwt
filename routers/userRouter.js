const express = require('express');
const { User } = require('../models/users');
const bcrypt = require('bcrypt');
const router = express.Router();
const authorize = require('../middlewares/authorize');

const newUser = async(req, res) => {

    let existingUser = await User.findOne({
        email: req.body.email
    });

    console.log(existingUser);

    if (existingUser) {
        return res.status(400).send("User already exists!");
    }

    

    let reqData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }

    const salt = await bcrypt.genSalt(10);
    reqData.password = await bcrypt.hash(reqData.password, salt);

    let user = new User(reqData);
    
      
    try{
        const result = await user.save();
        
        const token = user.generateJWT();
        
        res.send({
            message: `User  ${result.name} created successfully!`,
            data: result,
            token: token
        });

    } catch (err) {
        const errMsgs = [];
        for (field in err.errors) {
            errMsgs.push(err.errors[field].message);
        }
        return res.status(400).send(errMsgs);
    }


}

router.route('/')
    .post(newUser);

router.route('/me')
.get(authorize, (req, res) => {
    res.send(req.user);
});

module.exports = router;