const Post = require('../models/post');

exports.getPost = (req, res) => {
    const posts = Post.find()
        .select("_id title body")
        .then(posts => {
            res.status(200).json({
                posts
            })
        })
        .catch(err => console.log(err))
}

exports.createPost = (req, res) => {
    const post = new Post(req.body);
    post.save()
        .then(post => {
            res.status(200).json({
                post
            });
        });
}