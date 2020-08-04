const _ = require('lodash');

const User = require('../models/user');

exports.userById = (req, res, next, id) => {
    User.findById(id)
    .exec((err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: "User not found"
            });
        }
        req.profile = user;
        next();
    });
}

exports.hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id === req.auth._id;
    if (!authorized) {
        return res.status(403).json({
            error: "User is not authorized to perform this action!"
        });
    }
}

exports.allUsers = (req, res) => {
    User.find((err, users) => {
        if(err) {
            return res.status(400).json({
                err
            });
        }
        res.json({
            users
        });
    })
    .select("_id name email created_at");
}

exports.getUser = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    req.profile.__v = undefined;
    return res.json(req.profile);
}

exports.updatedUser = (req, res, next) => {
    let user = req.profile;
    user = _.extend(user, req.body);
    user.updated_at = Date.now();
    user.save(err => {
        if(err) {
            return res.status(400).json({
                error: "You aren't authorized to perform this action"
            });
        }
        user.hashed_password = undefined;
        user.salt = undefined;
        user.__v = undefined;
        res.json({
            user
        });
    });
}

exports.deletedUser = (req, res, next) => {
    let user = req.profile;
    user.remove((err, user) => {
        if(err) {
            return res.status(400).json({
                err
            });
        }
        res.json({
            message: `User "${user.name}" deleted succesfully!`
        });
    });
}