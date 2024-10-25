import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MONGODB Connection Successful!");
  } catch (err) {
    console.log("--->Error:", err);
    process.exit(1);
  }
};
