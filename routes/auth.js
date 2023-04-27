const router = require("express").Router()
const User = require("../models/Users")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const fetchUser = require("../middleware/fetchUser")

dotenv.config()
const JWT_SEC = process.env.JWT_SECRETE

//Register
router.post("/register", async (req, res) => {
    const mailAddress=req.body.email
    const found=await User.findOne({email:mailAddress})
    console.log(found," FOUND")
    if(found)
    {   
        res.status(208).json({message:"already registered"})
    }   
    else
    //generating encrypted password
    try {

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        //creating new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })

        //saving user to database and response
        const user = await newUser.save();
        // res.status(200).json(user)


        // trial code
        const authToken = jwt.sign({ email: user.email, password: user.password }, JWT_SEC)
        data = { "meyushAuthToken": authToken }
        res.status(200).json(data)

    }
    catch (err) {
        res.status(500).json(err)
        console.log(err.message)
    }
})

//login
// router.post("/login", async (req, res) => {
//     console.log("login : ", req.body.email, req.body.password)
//     try {
//         const user = await User.findOne({ email: req.body.email })
//         if (!user) {
//             res.status(404).json("user not found")
//         }
//         else {
//             const validPassword = await bcrypt.compare(req.body.password, user.password)
//             !validPassword && res.status(400).json("wrong password")
//             user && validPassword && res.status(200).json(user)
//         }
//     } catch (err) {
//         res.status(500).json(err)
//         console.log(err.message)
//     }
// })

//Login Trial With AuthToken
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            console.log("user not found");
            res.status(404).json("user not found")
        }
        else {
            const validPassword = await bcrypt.compare(req.body.password, user.password)
            if (validPassword) {
                const authToken = jwt.sign({ email: user.email, password: user.password }, JWT_SEC)
                res.status(200).json({ "meyushAuthToken": authToken })
            }
            else {
                console.log("invalid password")
                res.status(401).json("Invalid Password")
            }
        }
    } catch (err) {
        res.status(500).json(err)
        console.log(err.message)
    }
})


//get Users Details

router.post("/userDetails", fetchUser, async (req, res) => {
    console.log("fetchUser Called")

    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        console.log("user not found",req.body.email)
        res.status(404).json({ error: "user not found" })
    }
    else {
        const validPassword = req.body.password === user.password    
        if (!validPassword) {
            console.log("password mismatch")
            res.status(401).json({ error: "Invalid Password" })
        }
        else {
            console.log("user found",user)
            res.status(200).json(user)
        }
    }

})

module.exports = router