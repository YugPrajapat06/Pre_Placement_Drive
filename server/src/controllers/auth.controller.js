import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";


const registerCtlr = async (req, res) => {
    const { username, email, password, number, role } = req.body;
    
    try {
        const isUserExist = await userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        });

        if (isUserExist) {
            return res.status(409).json({
                message: "User already exist",
                success: false
            });
        }

        const user = await userModel.create({
            username,
            email,
            password,
            number,
            role
        });

        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username,
                role : user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        res.cookie("token", token)


        return res.status(201).json({
            message: "User registered successfully",
            success: true,
            user,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server is Failed to Register, try after some time...",
            success: false,
            error : error
        });
    }
}

const loginCtlr = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User does not exist",
                success: false
            });
        }

        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Invalid credentials",
                success: false
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username,
                role : user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        res.cookie("token", token)

        return res.status(200).json({
            message: "User logged in successfully",
            success: true,
            user,
            token
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server is Failed to Login, try after some time...",
            success: false
        })
    }
}

const getMeCtlr = async (req, res) => {
    const userId = req.user.userId;

    const user = await userModel.findById(userId).select("-password");

    if(!user){
        return res.status(404).json({
            message: "User does not exist",
            success: false
        });
    }

    return res.status(200).json({
        message: "User fetched successfully",
        success: true,
        user
    })
}

export default {
    registerCtlr,
    loginCtlr,
    getMeCtlr
}