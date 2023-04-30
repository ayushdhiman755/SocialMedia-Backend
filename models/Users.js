const mongoose = require("mongoose")

const UsersSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        min: 3,
        max: 20
    },
    email: {
        type: String,
        require: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        require: true,
        min: 6
    },
    profilePicture: {
        type: String,
        default: "https://ucarecdn.com/65c1476b-7939-4802-a0be-67bf017a57f5/"
    },
    coverPicture: {
        type: String,
        default: "https://ucarecdn.com/1a43be85-bc10-40f1-9a5a-4a73ffbb3bb8/"
    },
    followers: {
        type: Array,
        default: []
    },
    followings: {
        type: Array,
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    desc: {
        type: String,
        max: 50
    },
    city: {
        type: String,
        max: 50
    },
    from: {
        type: String,
        max: 50
    },
    relationship: {
        type: Number,
        enum: [1, 2, 3]
    }
}, { timestamps: true })
module.exports = mongoose.model("User", UsersSchema)
