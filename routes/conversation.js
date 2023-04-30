const router = require("express").Router()
const Conversation = require("../models/Conversation")

//new Conversation
router.post("/", async (req, res) => {
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.recieverId]
    })
    try {
        const savedConversation = await newConversation.save()
        res.status(200).json(savedConversation)
    } catch (error) {
        console.log(error)
        res.status(500).json("Internal server error")
    }
})



//get Conversation of a user

router.get("/:userId", async (req, res) => {
    try {
        const conversation = await Conversation.find({
            members: { $in: [req.params.userId] }
        })
        res.status(200).json(conversation)
    } catch (error) {
        console.log(error)
        res.status(500).json("Internal server error")
    }
})


//get conversation using two users id 

router.get("/getchat/:userId1/:userId2", async (req, res) => {
    try {

        // console.log(req.params.userId1, req.params.userId2, "request data")
        // res.json({ "the": "the" })
        const conversation = await Conversation.findOne({
            members: { $all: [req.params.userId1, req.params.userId2] }
        })
        console.log(conversation, "convo")
        if (conversation) {
            res.status(200).json(conversation)
        }
        else {
            const newConversation = new Conversation({
                members: [req.params.userId1, req.params.userId2]
            })
            const savedConversation = await newConversation.save()
            res.status(200).json(savedConversation)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})



module.exports = router