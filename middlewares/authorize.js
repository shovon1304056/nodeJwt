const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    // get auth header value

    let token = req.header('Authorization');
    if(!token){
        return res.status(401).send('Access denied. No token provided.');
    }

    token = token.replace('Bearer ', '');
    //token = token.split(' ')[1].trim();
    
    // verify token

    try{
        const decoded = jwt.verify(token,process.env.JwtSecretKey);
        
        req.user = decoded;
        req.user.hi = 'hi';
        next();
    }
    catch(err){
        return res.status(401).send('Invalid token.');
    }
}