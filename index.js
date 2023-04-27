const express = require("express")
const mongoose = require("mongoose")
const helmet = require("helmet")
const morgan = require("morgan")
const app = express()
const cors = require("cors")
const dotenv = require("dotenv")
const conversationRoutes = require("./routes/conversation")
const messageRoutes = require("./routes/messages")
const userRoutes = require("./routes/user")
const authRoutes = require("./routes/auth")
const postRoutes = require("./routes/post")
const multer = require("multer")
const path = require("path")
const commentRoutes=require("./routes/postComments")
dotenv.config()
app.use(cors())
mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGO_URL, (err) => {
    if (err) {
        console.log(err.message)
    }
    else {
        console.log("database connected ;)")
        console.log("path", path.dirname(""))
    }
})



app.use("/images", express.static(path.join(__dirname + "/public/images")))

//Middleware
app.use(express.json()) //body parser  for post requests
app.use(helmet())
app.use(morgan("common")) // middleware to display request details on backend console

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images")
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name)
    }
})

const upload = multer({ storage: storage })


app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        return res.status(200).json("file uploades successfully")
    } catch (error) {
        console.log(error)
    }
})

app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/post", postRoutes)
app.use("/api/conversation", conversationRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/comments", commentRoutes)


app.get("/", (req, res) => {
    res.send("welcome to home page")
})


app.listen(process.env.PORT, () => {
    console.log("server running")
})