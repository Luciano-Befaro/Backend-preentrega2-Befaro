export const UserDTO = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role
})