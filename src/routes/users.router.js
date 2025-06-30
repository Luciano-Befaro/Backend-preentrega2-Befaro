import { Router } from 'express';
import User from '../models/User.js';
import { createHash } from '../utils/hash.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

// Get all users
router.get('/', authenticateJWT, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// Get by ID
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch {
    res.status(400).json({ error: 'Invalid ID' });
  }
});

// Update
router.put('/:id', authenticateJWT, async (req, res) => {
  const { first_name, last_name, age, password, role } = req.body;
  try {
    const updates = { first_name, last_name, age, role };
    if (password) updates.password = createHash(password);
    const updated = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.json(updated);
  } catch {
    res.status(400).json({ error: 'Update failed' });
  }
});

// Delete
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch {
    res.status(400).json({ error: 'Invalid ID' });
  }
});

export default router;