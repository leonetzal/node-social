const express = require('express');

const { getPost, createPost } = require('../controllers/post');
const { createPostValidator } = require('../helpers');

const router = express.Router();

router.get('/post', getPost);
router.post('/post', createPostValidator, createPost);

module.exports = {
    router
}