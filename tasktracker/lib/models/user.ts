import mongoose from "mongoose"
import type { User } from "../types"

export interface UserDocument extends Omit<User, "id">, mongoose.Document {
  _id: mongoose.Types.ObjectId
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
})

// Ensure index on email for faster lookups
userSchema.index({ email: 1 })

export const UserModel = mongoose.models.User || mongoose.model<UserDocument>("User", userSchema)