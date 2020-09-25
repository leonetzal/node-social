const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    picture: {
        data: Buffer,
        contentType: String
    },
    posted_by: {
        type: ObjectId,
        ref: "User"
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: Date,
    likes: [{ type: ObjectId, ref: "User" }],
    comments: [
        {
            text: String,
            created_at: {
                type: Date,
                default: Date.now
            },
            posted_by: {
                type: ObjectId,
                ref: "User"
            }
        }
    ]
});

module.exports = mongoose.model("Post", postSchema);