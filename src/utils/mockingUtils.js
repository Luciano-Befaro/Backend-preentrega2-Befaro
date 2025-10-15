import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

export const generateMockUser = () => {
  const roles = ["user", "admin"];
  return {
    _id: faker.database.mongodbObjectId(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: bcrypt.hashSync("coder123", 10),
    role: roles[Math.floor(Math.random() * roles.length)],
    pets: []
  };
};

export const generateMockPet = () => {
  return {
    _id: faker.database.mongodbObjectId(),
    name: faker.animal.dog(),
    species: faker.animal.type(),
    age: faker.number.int({ min: 1, max: 15 })
  };
};

export const generateManyUsers = (count = 50) =>
  Array.from({ length: count }, () => generateMockUser());

export const generateManyPets = (count = 50) =>
  Array.from({ length: count }, () => generateMockPet());