const express = require('express');

const { userById } = require('../controllers/user');
const { signUp, signIn, signOut, forgotPassword, resetPassword, socialLogin } = require('../controllers/auth');
const { userSignupValidator, passwordResetValidator } = require('../helpers');

const router = express.Router();

router.post('/signup', userSignupValidator, signUp);
router.post('/signin', signIn);
router.post('/signout', signOut);

router.put("/forgot-password", forgotPassword);
router.put("/reset-password", passwordResetValidator, resetPassword);

router.post("/social-login", socialLogin);

router.param("userId", userById);

module.exports = {
    authRouter: router
}