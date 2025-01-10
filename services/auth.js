const JWT = require('jsonwebtoken');

require('dotenv').config();

const secret = process.env.JWT_SECRET_KEY;

function createTokenForUser(user){
       const payload = {
        _id: user._id,
        Username: user.fullName,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        role: user.role,
       }; 

       //TODO: set expire date.
       const token = JWT.sign(payload,secret,{
              expiresIn: '24h' // expires in 24 hours
       });

       return token;
}

function validateToken(token){
       const payload = JWT.verify(token,secret);
       return payload;
}

module.exports = {createTokenForUser,validateToken};