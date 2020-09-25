const express = require('express');

const { userById, allUsers, getUser, updatedUser, deletedUser, userPhoto, addFollowing, addFollower, removeFollowing, removeFollower, findPeople, hasAuthorization } = require('../controllers/user');
const { requireSignIn } = require('../controllers/auth');

const router = express.Router();

router.put('/user/follow', requireSignIn, addFollowing, addFollower);
router.put('/user/unfollow', requireSignIn, removeFollowing, removeFollower);

router.get('/users', allUsers);
router.get('/user/:userId', requireSignIn, getUser);
router.put('/user/:userId', requireSignIn, hasAuthorization, updatedUser);
router.delete('/user/:userId', requireSignIn, hasAuthorization, deletedUser);

router.get('/user/photo/:userId', userPhoto);

router.get('/user/findpeople/:userId', requireSignIn, findPeople);

router.param("userId", userById);

module.exports = {
    userRouter: router
}