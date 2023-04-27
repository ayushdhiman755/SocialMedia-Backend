const router = require("express").Router()
const Users = require("../models/Users");
const User = require("../models/Users")
const bcrypt = require("bcrypt")
//Update user
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);

            } catch (err) {
                return res.status(500).json(err)
            }
        }
        console.log(req.body.password)
        try {
            const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body })
            res.status(200).json("account has been updated")
        }
        catch (err) {
            return res.status(500).json(err)
        }


    } else {
        return res.status(403).json("you can only update your account")
    }
})
//delete user
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);

            } catch (err) {
                return res.status(500).json(err)
            }
        }
        try {
            const user = await User.findByIdAndDelete(req.params.id)
            res.status(200).json("account has been deleted")
        }
        catch (err) {
            return res.status(500).json(err)
        }
    } else {
        return res.status(403).json("you can only delete your account")
    }
})

router.get("/allUsers/", async (req, res) => {
    try {
        const userName = req.query.username;
        const result = await Users.find({ username: new RegExp('^' + userName , "i","g") })
        res.status(200).json({ result });
    } catch (err) {
        console.log(err)
    }
})

//get a user
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const { password, updatedAt, ...other } = user //destructuring document from mongoose to return other items then password   
        // console.log(user._docs)
        // console.log("get user by id : ",other )
        res.status(200).json(other)
    }
    catch (err) {
        res.status(500).json(err)
        console.log(err)
    }
})

//get a user
router.get("/", async (req, res) => {
    // console.log("username : ",req.query.username)
    // console.log("userId : ",req.query.userId)
    const userId = req.query.userId;  //like localhost:8800/api/user?userId=908min
    const username = req.query.username //like localhost:8800/api/user?username=kfmak
    console.log(userId, "userId")
    console.log(username, "userName")
    try {
        const user = userId
            ? await User.findById(userId)
            : await User.findOne({ username })
        const { password, updatedAt, ...other } = user //destructuring document from mongoose to return other items then password   
        // console.log(user._docs)
        // console.log("get user by id / name : ",other )
        res.status(200).json(other)
    }
    catch (err) {
        res.status(500).json(err)
        console.log(err.message)
    }
})
//follow a user

router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        console.log("follow called")
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } })
                await currentUser.updateOne({ $push: { followings: req.params.id } })
                res.status(200).json("user has been followed")
            } else {
                res.status(403).json("you already follow the user")
            }
        } catch (err) {
            res.status(500).json(err)

        }
    }
})
//Unfollow a user

router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        console.log("unfollow called")
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } })
                await currentUser.updateOne({ $pull: { followings: req.params.id } })
                res.status(200).json("user has been unfollow")
            } else {
                res.status(403).json("you don't follow the user")
            }
        } catch (err) {
            res.status(500).json(err)
            console.log(err)

        }
    }
})


//Get user Friends
router.get("/friends/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
        const friends = await Promise.all(
            user.followings.map(frienId => {
                return User.findById(frienId).select({ "_id": 1, "username": 1, "profilePicture": 1 })
            })
        )

        // ALTERNATE METHOD
        // const friends = await Promise.all(
        //     user.followings.map(frienId => {
        //         return User.findById(frienId)
        //     })
        // )
        // friends.map(friend => {
        //     const { _id, username, profilePicture } = friend
        //     friendList.push({ _id, username, profilePicture })
        // })
        res.status(200).json(friends)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router