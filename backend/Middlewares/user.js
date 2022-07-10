const User = require('../Models/user')

const getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                err: "unable to find the user"
            })
        }
        req.profile = user;

        next();
    })
}

module.exports =getUserById;