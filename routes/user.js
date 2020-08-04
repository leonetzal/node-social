const express = require('express');

const { userById, allUsers, getUser, updatedUser, deletedUser } = require('../controllers/user');
const { requireSignIn } = require('../controllers/auth');

const router = express.Router();

router.get('/users', requireSignIn, allUsers);
router.get('/user/:userId', requireSignIn, getUser);
router.put('/user/:userId', requireSignIn, updatedUser);
router.delete('/user/:userId', requireSignIn, deletedUser);

router.param("userId", userById);

module.exports = {
    userRouter: router
}