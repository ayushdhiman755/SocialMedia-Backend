const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()

const JWT_SEC = process.env.JWT_SECRETE

const fetchUser = (req, res, next) => {
    console.log("fetchUser called")
    const token = req.body.meyushAuthToken
    if (!token) {
        res.status(400).json({ error: "Invalid credential use a valid web token" })
    }
    try {
        const data = jwt.verify(token, JWT_SEC)
        req.body.email = data.email
        req.body.password = data.password
        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({ error: "use a valid web token" })
    }

}

module.exports = fetchUser