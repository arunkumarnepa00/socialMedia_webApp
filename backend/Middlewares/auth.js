var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

const isAuthenticated = expressJwt({
    secret: process.env.SECRET,
    algorithms: ['HS256'],
    userProperty: 'auth'
})
const isAuthorized = (req, res, next) => {
    let checker =req.profile && req.auth && req.profile._id == req.auth.id;
    if(!checker){
        return res.status(400).json({
            err:"Acess Denied....., user not authorized"
        })
    }
    next();
}
const isAdmin = (req, res, next) => {
    if(req.profile.role=== 0){
        return res.status(400).json({
            err:"Acess Denied only admins can acess"
        })
    }
   next();
}

module.exports = { isAuthenticated, isAuthorized, isAdmin }