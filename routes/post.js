const express = require('express');

const { getPosts, createPost, postByUser, postById, isPosted, deletePost, updatePost, postPicture, getPost, like, unlike, comment, uncomment } = require('../controllers/post');
const { requireSignIn } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { createPostValidator } = require('../helpers');

const router = express.Router();

router.get('/posts', getPosts);

router.put("/post/like", requireSignIn, like);
router.put("/post/unlike", requireSignIn, unlike);

router.put("/post/comment", requireSignIn, comment);
router.put("/post/uncomment", requireSignIn, uncomment);

router.get('/post/:postId', getPost);
router.put('/post/:postId', requireSignIn, isPosted, updatePost);
router.delete('/post/:postId', requireSignIn, isPosted, deletePost);

router.post('/post/by/:userId', requireSignIn, createPost, createPostValidator);
router.get("/post/by/:userId", requireSignIn, postByUser);

router.get('/post/picture/:postId', postPicture);

router.param("userId", userById);
router.param("postId", postById);

module.exports = {
    postRouter: router
}