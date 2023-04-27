const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
    userId: {
        type: String,
        require: true
    },
    commentText: {
        type: String,
        require: true
    },
    postId: {
        type: String,
        require: true
    }
}, { timestamps: true })
module.exports=mongoose.model("Comments",commentSchema);