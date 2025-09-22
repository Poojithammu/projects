import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js"; 
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = "mongodb://localhost:27017/formApp";
console.log(MONGO_URI);

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);

    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    if (existingAdmin) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const adminUser = new User({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    });

    await adminUser.save();

    console.log("Admin user created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin user:", err);
    process.exit(1);
  }
}

createAdmin();
