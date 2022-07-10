const User = require('../Models/user');
var jwt = require('jsonwebtoken');

const signup = (req, res) => {


    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
        return res.status(400).json({
            err: "Please provide mandatory details"
        })
    }

    User.findOne({ email: email }).then((user) => {
        if (user) {
            return res.status(400).json({ err: "User already exists" })
        }
    }).catch((err) => {
        return res.status(400).json({ err: "unable to check the email" })
    })

    const user = new User(req.body);
    user.hashpwd(req.body.password);
    user.save().then((user) => {
        if (!user) {
            return res.status(400).json({ err: "user not saved properly" })
        }
        return res.status(200).json({ msg: "user created successfully" })
    }).catch(err => {
        return res.status(400).json({ err: "unable to save the user" })
    })


}


const signin = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            err: "please provide mandatory details"
        })
    }
    User.findOne({ email: email }, function (err, item) {
        if (err || !item) {
            return res.status(400).json({
                err: "unable to find the user"
            })
        }
        
        if (item.authenticate(password)){
            var token = jwt.sign({ id: item._id }, process.env.SECRET);
            const user={_id:item._id}
            return res.status(200).json({ token,user})
        } else {
            return res.status(400).json({
                err: "please check our password"
            })
        }


    })

}

const signout = (req, res) => {
    res.json({
        msg: "User signout"
    })

}


module.exports = { signup, signin, signout }