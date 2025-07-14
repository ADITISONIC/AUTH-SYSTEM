import { User } from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { genrateVericationCode } from "../utils/genrateVericationCode.js";
import { generateTokenAndSetCookies } from "../utils/generateTokenAndSetCookies.js";
import {
  sendVerificationEmail,
  sendWelcomeMail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../mailtrap/emails.js";
import CryptoJS from "crypto-js";

export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }
    const useralreadyexits = await User.findOne({ email });
    if (useralreadyexits) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = genrateVericationCode();
    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });
    await user.save();
    generateTokenAndSetCookies(res, user._id);
    await sendVerificationEmail(user.email, verificationToken);
    res.status(201).json({
      success: true,
      message: "User signed In",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error,
    });
  }
};

export const login = async (req, res) => {
    const {email,password} = req.body
    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid redentials"
            })
        }
        const ispasswordvalid = await bcrypt.compare(password,user.password)
        if(!ispasswordvalid){
            return res.status(400).json({
                message:"Invalid credentials"
            })
        } 
        generateTokenAndSetCookies(res,user._id)
        user.lastLogin = new Date()
        await user.save()
        res.status(200).json({
          success: true,
          message: "logged in",
          user: {
            ...user._doc,
            password: undefined,
          },
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message:"login failed"
        })
    }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "logged out successfully" });
  
  } catch (error) {
    console.log(error)  
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }
    console.log("User just before welcome mail:", user);
    console.log(user.email); // undefined?
    console.log(user._doc?.email); // try this if using Mongoose
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save(); // <-- Call the save method properly

    await sendWelcomeMail(user.email, user.name); // <-- Email should now be valid

    res.status(201).json({
      success: true,
      message: "Email verified",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const forgotPassword = async (req,res)=>{
    const {email} = req.body
    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }
        const resetToken = CryptoJS.SHA256("message").toString();
        const resetTokenExpiresAt = Date.now() + 1 *60 * 60 *1000
        user.resetPasswordToken = resetToken
        user.resetPasswordExpiresAt = resetTokenExpiresAt
        await user.save()
        await sendPasswordResetEmail(user.email,`${process.env.CLIENT_URL}/reset-password/${resetToken}`)
        res.status(200).json({
            success:true,
            message:"Password reset email sent"
        })
    } catch (error) {
        console.log(error)
    }
}

export const resetPassword = async (req,res)=>{
    try {
        const {token} = req.params
        const {password} = req.body
        const user = await User.findOne({
            resetPasswordToken:token,
            resetPasswordExpiresAt:{$gt:Date.now()}
        })
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid or expires token"
            })
        }
        const hashedPassword = await bcrypt.hash(password,10)
        user.password = hashedPassword
        user.resetPasswordToken = undefined
        user.resetPasswordExpiresAt = undefined
        await user.save()
        await sendResetSuccessEmail(user.email)
    } catch (error) {
        console.log(error)
    }
}

export const checkAuth = async (req,res)=>{
    try {
        const user = await User.findById(req.userId)
        res.status(200).json({
          ...user._doc,
          password: undefined,
        });
    } catch (error) {
         console.log(error)
    }
}