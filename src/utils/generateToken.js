import jwt from 'jsonwebtoken'

export const generateToken = (user, expiresIn = '1h') => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn })
}