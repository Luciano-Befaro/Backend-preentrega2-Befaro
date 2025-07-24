import { UserRepository } from '../repository/user.repository.js'
import { hashPassword, comparePasswords } from '../utils/hash.js'
import { generateToken } from '../utils/generateToken.js'
import { sendPasswordResetEmail } from '../services/mail.service.js'
import { UserDTO } from '../dto/user.dto.js'
import { v4 as uuidv4 } from 'uuid'

const repo = new UserRepository()

export const register = async (req, res) => {
  const { name, email, password } = req.body
  const existing = await repo.findByEmail(email)
  if (existing) return res.status(409).json({ error: 'Usuario ya registrado' })

  const hash = await hashPassword(password)
  const user = await repo.save({ name, email, password: hash })
  res.status(201).json(UserDTO(user))
}

export const login = async (req, res) => {
  const { email, password } = req.body
  const user = await repo.findByEmail(email)
  if (!user || !(await comparePasswords(password, user.password)))
    return res.status(401).json({ error: 'Credenciales inválidas' })

  const token = generateToken(UserDTO(user))
  res.json({ token })
}

export const current = async (req, res) => {
  const user = await repo.findById(req.user.id)
  res.json(UserDTO(user))
}

export const requestResetPassword = async (req, res) => {
  const { email } = req.body
  const user = await repo.findByEmail(email)
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })

  const token = uuidv4()
  const expiration = new Date(Date.now() + 60 * 60 * 1000) // 1h
  await repo.setResetToken(email, token, expiration)
  await sendPasswordResetEmail(email, token)

  res.json({ message: 'Email enviado' })
}

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body
  const user = await repo.findByResetToken(token)
  if (!user) return res.status(400).json({ error: 'Token inválido o expirado' })

  if (await comparePasswords(newPassword, user.password))
    return res.status(400).json({ error: 'La contraseña no puede ser igual a la anterior' })

  const hash = await hashPassword(newPassword)
  await repo.updatePassword(user._id, hash)
  await repo.clearResetToken(user._id)
  res.json({ message: 'Contraseña actualizada' })
}
