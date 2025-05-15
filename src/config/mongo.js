import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://Luciano:coder123@cluster0.kuubzfv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


export const connectMongo = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("🟢 Conectado a MongoDB");
  } catch (err) {
    console.error("🔴 Error al conectar a MongoDB:", err.message);
  }
};