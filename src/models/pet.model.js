import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  name: String,
  species: String,
  age: Number
});

export const PetModel = mongoose.model("Pet", petSchema);