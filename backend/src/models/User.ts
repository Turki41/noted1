import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    profileImageUrl: {type: String, default: null},
    role: {type: String, enum: ['admin', 'user'], default: 'user'} // Role-based access
}, {timestamps: true})

const User = mongoose.model('User', UserSchema)

export default User