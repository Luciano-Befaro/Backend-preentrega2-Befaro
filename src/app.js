import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import passport from './config/passport.js';
import sessionRouter from './routes/sessions.router.js';
import userRouter from './routes/users.router.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Rutas
app.use('/api/sessions', sessionRouter);
app.use('/api/users', userRouter);

// Conexión a MongoDB (actualizada sin opciones deprecadas)
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('🚀 MongoDB Connected');
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });