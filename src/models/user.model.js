import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  resetToken: String,
  resetTokenExp: Date
})

export const UserModel = mongoose.model('User', UserSchema)