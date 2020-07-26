const jwt = require('jsonwebtoken');
const models = require('../models');
const bcrypt = require("bcryptjs");

var authService ={
    
    // For login 
    signUser: function(user){
        const token = jwt.sign({
            username: user.username,
            userid: user.userid
        }, 
        'secretkey', 
        {
            expiresIn: '1h'
        });
        return token;
    },

    // For get /user
    verifyUser: function(token){
        try {
            let decoded = jwt.verify(token, 'secretkey');
            return models.User.findByPk(decoded.userid);
        } catch (err){
            console.log(err);
            return null;
        }
    },
    
    hashPassword: function(plainTextPassword){
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(plainTextPassword, salt);
        return hash;
    },
    
    comparePasswords: function(plainTextPassword, hashedPassword) {
        return bcrypt.compareSync(plainTextPassword, hashedPassword);
    }
}

module.exports = authService;