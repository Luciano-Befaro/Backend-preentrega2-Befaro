export default class UserDAO {
  async findById(id) { return UserModel.findById(id); }
  async updatePassword(id, hash) { return UserModel.findByIdAndUpdate(id, { password: hash }); }
}

// repository/userRepository.js
import UserDAO from '../dao/userDao.js';
export default class UserRepository {
  constructor() { this.dao = new UserDAO(); }
  getUserById(id) { return this.dao.findById(id); }
  changePassword(id, hash) { return this.dao.updatePassword(id, hash); }
}