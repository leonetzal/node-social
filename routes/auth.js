const express = require('express');

const { userById } = require('../controllers/user');
const { signUp, signIn, signOut } = require('../controllers/auth');
const { userSignupValidator } = require('../helpers');

const router = express.Router();

router.post('/signup', userSignupValidator, signUp);
router.post('/signin', signIn);
router.post('/signout', signOut);

router.param("userId", userById);

module.exports = {
    authRouter: router
}