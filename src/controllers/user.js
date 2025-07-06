const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { uploadOnCloudinary } = require('../utils/cloudinary');
require('dotenv').config();

const createUser = async(req, res) => {
    try {
        console.log(req.body)
        const {firstName, lastName, email, password, bio} = req.body;
        const profileImage = req.file ? req.file.path : null; // Get the file path from multer
        // console.log(profileImage)
        if(!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                message: "First name and last name are required"
            })
        }
        const user = await User.findOne({firstName})
        if(user) {
            return res.status(400).json({
                message: "User already exists"
            })
        }
        
        //hashing the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //upload on cloudinary
        const imgUrl = profileImage ? await uploadOnCloudinary(profileImage) : null;
        // console.log(imgUrl)


        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password : hashedPassword,
            profileImg : imgUrl || "https://imgs.search.brave.com/aU1zD9-yEGXSRpo4uMnCYChjXA-J3KPcnEY3tlusTbI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMDEv/ODQwLzYxMi9zbWFs/bC9waWN0dXJlLXBy/b2ZpbGUtaWNvbi1t/YWxlLWljb24taHVt/YW4tb3ItcGVvcGxl/LXNpZ24tYW5kLXN5/bWJvbC1mcmVlLXZl/Y3Rvci5qcGc", // if no image is provided, set it to null
            bio : bio || null
        })

        res.status(201).json({
            message: "User created successfully",
            newUser
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
}

const loginUser = async(req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            })
        }

        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid password"
            })
        }

        //jwt token generation
        const payload = {
            id: user._id,
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1d'});

        res.status(200).json({
            message: "Login successful",
            user,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
}

const getAllUsers = async(req, res) => {
    try {
        const users = await User.find({});
        res.status(201).json({
            users
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports = {
    createUser,
    loginUser,
    getAllUsers
}