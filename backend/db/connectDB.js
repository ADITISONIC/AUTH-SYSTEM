import mongoose from "mongoose";

export const connectDB = async () =>{
    try {
     const con = await mongoose.connect(process.env.MONGO_URI)
     console.log("mongo connected")
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

