const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');

const Post = require('../models/post');

exports.postById = (req, res, next, id) => {
    Post.findById(id)
        .populate("posted_by", "_id name")
        .populate("comments.posted_by", "_id name")
        .populate('posted_by', '_id name role')
        .exec((err, post) => {
            if (err || !post) {
                return res.status(400).json({
                    error: err
                });
            }
            req.post = post;
            next();
        });
}

exports.getPosts = (req, res) => {
    const posts = Post.find()
        .populate("posted_by", "_id name")
        .populate('comments', 'text created_at')
        .populate('comments.posted_by', '_id name')
        .select("_id title body created_at likes")
        .sort({ created_at: -1 })
        .then(posts => {
            res.status(200).json(
                posts
            )
        })
        .catch(err => console.log(err))
}

exports.createPost = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image couldn't be uploaded!"
            });
        }
        let post = new Post(fields);
        post.posted_by = req.profile;
        if (files.picture) {
            post.picture.data = fs.readFileSync(files.picture.path);
            post.picture.content_type = files.picture.type;
        }
        post.save((err, post) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(post);
        })
    });
}

exports.postByUser = (req, res) => {
    Post.find({ posted_by: req.profile._id })
        .populate("posted_by", "_id name")
        .select("_id title body created_at likes")
        .sort({ created_at: -1 })
        .exec((err, posts) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(posts);
        })
}

exports.isPosted = (req, res, next) => {
    let sameUser = req.post && req.auth && req.post.posted_by._id == req.auth._id;
    let adminUser = req.post && req.auth && req.auth.role === 'admin';
    let isPosted = sameUser || adminUser;
    if (!isPosted) {
        return res.status(403).json({
            error: "User is not authorized"
        });
    }
    next();
}

exports.updatePost = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Picture couldn't be uploaded!"
            });
        }
        let post = req.post;
        post = _.extend(post, fields);
        post.updated_at = Date.now();
        if (files.picture) {
            post.picture.data = fs.readFileSync(files.picture.path);
            post.picture.contentType = files.picture.type;
        }
        post.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(post);
        });
    })
}

exports.deletePost = (req, res) => {
    let post = req.post;
    post.remove((err, post) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json({
            post: post.title,
            message: "Post deleted successfully"
        })
    });
}

exports.postPicture = (req, res, next) => {
    if (req.post.picture.data) {
        res.set("Content-Type", req.post.picture.contentType);
        return res.send(req.post.picture.data);
    }
    next();
}

exports.getPost = (req, res) => {
    return res.json(req.post);
}

exports.like = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, { $push: { likes: req.body.userId } }, { new: true })
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(result);
        });
}

exports.unlike = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, { $pull: { likes: req.body.userId } }, { new: true })
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(result);
        });
}

exports.comment = (req, res) => {
    let comment = req.body.comment;
    comment.posted_by = req.body.userId;
    Post.findByIdAndUpdate(req.body.postId, { $push: { comments: comment } }, { new: true })
        .populate('comments.posted_by', '_id name')
        .populate('posted_by', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(result);
        });
}

exports.uncomment = (req, res) => {
    let comment = req.body.comment;
    Post.findByIdAndUpdate(req.body.postId, { $pull: { comments: { _id: comment._id } } }, { new: true })
        .populate('comments.posted_by', '_id name')
        .populate('posted_by', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(result);
        });
}