import express from "express";
import { PetModel } from "../models/pet.model.js";

const router = express.Router();

// GET /api/pets - obtiene todas las mascotas guardadas
router.get("/", async (req, res) => {
  try {
    const pets = await PetModel.find();
    res.status(200).json({ status: "success", payload: pets });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

export default router;