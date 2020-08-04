const express = require('express');

const { getPost, createPost } = require('../controllers/post');
const { requireSignIn } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { createPostValidator } = require('../helpers');

const router = express.Router();

router.get('/post', getPost);
router.post('/post', requireSignIn, createPostValidator, createPost);

router.param("userId", userById);

module.exports = {
    postRouter: router
}