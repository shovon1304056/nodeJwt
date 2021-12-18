const jwt = require('jsonwebtoken');
const { Schema, model } = require('mongoose');

const userSchema = Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
    }
});

userSchema.methods.generateJWT = function () {
    const token = jwt.sign(
        { _id: this._id, email: this.email },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "3h" }
    )
    return token;
}

module.exports.User = model('User', userSchema);