const router = require("express").Router()
const Post = require("../models/Post");
const Users = require("../models/Users");
//create a post


router.post("/:id",(req,res)=>{
    console.log("body ",req.body)
    console.log("id",req.params.id)
    res.status(200)
})

router.post("/", async (req, res) => {
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save();
        
        res.status(200).json(savedPost)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

//update a post
router.put("/:id", async (req, res) => {
    // console.log("update",req.body)
    // res.status(200).json("message")
    try {
        const post = await Post.findById(req.params.id)
        if (post.userId === req.body.userId) {
            await post.update({ $set: {desc:req.body.Desc} })
            res.status(200).json("post updated")
        }
        else {
            res.status(403).json("you can only update your post")
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }

})

//delete a post
router.delete("/:id", async (req, res) => {
    console.log("Delete called with post ID :  ",req.params.id)
    console.log("Delete called with userId ID :  ",req.body)
    try {
        const post = await Post.findById(req.params.id)

        if (post.userId === req.body.userId) {
            await post.deleteOne()
            res.status(200).json("post deleted")
        }
        else {
            res.status(403).json("you can only delete your post")
        }
    } catch (err) {
        // console.log(err)
        res.status(500).json(err)
    }
})


// like/Dislike a post

router.put("/:id/like", async (req, res) => { //:id => post id
    try {
        const post = await Post.findById(req.params.id)
        if (!post.likes.includes(req.body.userId)) {   //userId= user inerested to like or dislike
            await post.updateOne({ $push: { likes: req.body.userId } })
            res.status(200).json("the post has been liked")
        }
        else {
            await post.updateOne({ $pull: { likes: req.body.userId } })
            res.status(200).json("the post has been disliked")

        }
    } catch (err) {
        res.status(500).json(err)

    }
})
//get a post
router.get("/:id", async (req, res) => {
    console.log("body ",req.body)
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    } catch (err) {
        res.status(500).json(err)

    }
})

//get timeline posts

router.get("/timeline/:userId", async (req, res) => {
    console.log("fetching all posts")
    try {
        const currentUser = await Users.findById(req.params.userId)
        console.log("current user", currentUser._id)
        const userPosts = await Post.find({ userId: currentUser._id })
        const friendsPost = await Promise.all(   //promise is use so that all the elements of current users can be iterated then it will be assigned to friend post 
            currentUser.followings.map(friendId => {
                return Post.find({ userId: friendId })
            })
        )
        res.status(200).json(userPosts.concat(...friendsPost))
    } catch (err) {
        res.status(500).json(err)
    }
})
//get user's all posts

router.get("/profile/:username", async (req, res) => {
    console.log("fetching all posts")
    try {
        const user = await Users.findOne({ username: req.params.username })
        const posts = await Post.find({ userId: user._id })
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json(err)
    }
})


router.get("/", async (req, res) => {
    res.send("post page")
})

module.exports = router