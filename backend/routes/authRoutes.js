import express from "express"
import { login, logout, signup,verifyEmail,forgotPassword,resetPassword,checkAuth} from "../controllers/authControllers.js"
import { verifyToken } from "../middlewares/verifyToken.js"


const router = express.Router()

router.post("/check-auth",verifyToken, checkAuth);
router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
router.post("/verify-email",verifyEmail)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token",resetPassword)

export default router