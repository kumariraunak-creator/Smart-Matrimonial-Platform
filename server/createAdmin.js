const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await User.findOne({
      email: "admin@smartmatrimonial.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      await mongoose.connection.close();
      return;
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await User.create({
      name: "Super Admin",
      email: "admin@smartmatrimonial.com",
      password: hashedPassword,
      role: "admin",
      accountStatus: "approved",
      verificationStatus: "verified",
    });

    console.log("Admin created successfully");

    await mongoose.connection.close();
  } catch (error) {
    console.log("Error creating admin:", error.message);
    await mongoose.connection.close();
  }
};

createAdmin();