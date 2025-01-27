import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"], // Fixed typo: `require` -> `required`
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"], // Fixed typo
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"], // Fixed typo
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: {
    type: String,
    default: null, // Optional: Explicitly set default to `null`
  },
  forgotPasswordTokenExpiry: {
    type: Date,
    default: null,
  },
  verifyToken: {
    type: String,
    default: null,
  },
  verifyTokenExpiry: {
    type: Date,
    default: null,
  },
});

// Check if the model is already compiled to avoid OverwriteModelError
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
