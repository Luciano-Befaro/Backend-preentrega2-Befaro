import express from "express";
import { UserModel } from "../models/user.model.js";
import { PetModel } from "../models/pet.model.js";
import {
  generateManyUsers,
  generateManyPets
} from "../utils/mockingUtils.js";

const router = express.Router();

// GET /api/mocks/mockingusers - genera 50 usuarios simulados
router.get("/mockingusers", async (req, res) => {
  try {
    const users = generateManyUsers(50);
    res.status(200).json({ status: "success", payload: users });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// GET /api/mocks/mockingpets - genera mascotas simuladas
router.get("/mockingpets", async (req, res) => {
  try {
    const pets = generateManyPets(50);
    res.status(200).json({ status: "success", payload: pets });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// POST /api/mocks/generateData - genera y guarda en MongoDB
router.post("/generateData", async (req, res) => {
  try {
    const { users = 0, pets = 0 } = req.body;

    const mockUsers = generateManyUsers(users);
    const mockPets = generateManyPets(pets);

    const insertedPets = await PetModel.insertMany(mockPets);
    const insertedUsers = await UserModel.insertMany(mockUsers);

    res.status(201).json({
      status: "success",
      message: "Datos generados e insertados correctamente",
      counts: {
        users: insertedUsers.length,
        pets: insertedPets.length
      }
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

export default router;