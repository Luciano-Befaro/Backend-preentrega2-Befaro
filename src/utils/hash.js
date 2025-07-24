import bcrypt from 'bcrypt'

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10)
}

export const comparePasswords = async (plain, hashed) => {
  return await bcrypt.compare(plain, hashed)
}