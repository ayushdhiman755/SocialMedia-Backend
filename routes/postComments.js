const { spawn } = require("child_process")
const all_Classes = ['not_cyberbullying', 'gender', 'religion', 'other_cyberbullying', 'age', 'ethnicity']

const router = require("express").Router();
const Comments = require("../models/Comments");
const Post = require("../models/Post")
router.post("/comment", async (req, res) => {
    console.log(req.body)
    const newComment = new Comments(req.body)
    console.log("calling python ")
    const pyPr = spawn('python', ["/images/JuModel/Predict.py", newComment.commentText])
    try {
        pyPr.stdout.on("data", async data => {
            console.log("python says ",newComment.commentText," is ",all_Classes[parseInt(data.toString())])
            var bully = parseInt(data.toString())
            if (bully === 0) {
                try {
                    const savedComment = await newComment.save();
                    const post = await Post.findById(req.body.postId)
                    await post.updateOne({ $push: { comments: savedComment.id } });
                    console.log(err, "comment save successfully")
                    res.status(200).json("comment updates successfully");
                }
                catch (err) {
                    console.log(err, "comment save error")
                    res.status(500).json(err)
                }
            }
            else {
                console.log("bully ",all_Classes[bully])
                res.status(500).json({ "cyberBully": all_Classes[bully] })
            }
            // res.status(200).json(all_Classes[])
        })
        pyPr.stderr.on("data", err => {
            console.log("Error ", err.toString())
            res.status(500).json(err.toString())
        })
        pyPr.on("close ", (code) => {
            console.log(code.toString())
            console.log("python program close with code : ", code.toString());
        })
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
    // console.log(newComment.commentText)
    // res.status(200).json("success")
})

router.post("/get", async (req, res) => {
    let postId = req.body.postId;
    console.log(postId)
    const commentId = await Post.findById(postId, "comments");
    // res.status(200).json("ok");
    const comments = await Promise.all(
        commentId.comments.map(commentid => {
            return Comments.findById(commentid, "userId commentText createdAt")
        })
    )
    res.status(200).json(comments);
})
module.exports = router