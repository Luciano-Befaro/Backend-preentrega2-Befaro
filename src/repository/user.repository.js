import { UserModel } from '../models/user.model.js'

export class UserRepository {
  async findByEmail(email) {
    return await UserModel.findOne({ email })
  }

  async findById(id) {
    return await UserModel.findById(id)
  }

  async save(user) {
    return await UserModel.create(user)
  }

  async updatePassword(id, password) {
    return await UserModel.findByIdAndUpdate(id, { password })
  }

  async setResetToken(email, token, expiresAt) {
    return await UserModel.findOneAndUpdate(
      { email },
      { resetToken: token, resetTokenExp: expiresAt }
    )
  }

  async findByResetToken(token) {
    return await UserModel.findOne({
      resetToken: token,
      resetTokenExp: { $gt: new Date() }
    })
  }

  async clearResetToken(id) {
    return await UserModel.findByIdAndUpdate(id, {
      resetToken: null,
      resetTokenExp: null
    })
  }
}