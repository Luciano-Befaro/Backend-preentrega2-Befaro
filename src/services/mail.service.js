import { mailTransport } from '../config/nodemailer.js'

export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`

  await mailTransport.sendMail({
    from: `"Ecommerce Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Recuperación de contraseña',
    html: `
      <p>Hacé clic en el botón para restablecer tu contraseña:</p>
      <a href="${resetUrl}" style="padding:10px 20px; background-color:#007bff; color:white; text-decoration:none">Restablecer contraseña</a>
      <p>Este enlace expirará en 1 hora.</p>
    `
  })
}