import express from "express";
import mongoose from "mongoose";
import mocksRouter from "./routes/mocks.router.js";
import usersRouter from "./routes/users.router.js";
import petsRouter from "./routes/pets.router.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔗 Conexión a MongoDB
mongoose
  .connect("mongodb://localhost:27017/backend-preentrega2")
  .then(() => console.log("🟢 Conectado a MongoDB"))
  .catch(err => console.error("🔴 Error MongoDB:", err));

// 🚏 Rutas principales
app.use("/api/mocks", mocksRouter);
app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);

export default app;
