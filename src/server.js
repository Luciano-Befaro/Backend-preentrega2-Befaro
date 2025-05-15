import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import path from "path";
import mongoose from "mongoose";

// Import conexión y rutas
import { connectMongo } from "./config/mongo.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

// WebSocket
import ProductManager from "./managers/ProductManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// Servidor y conexión Mongo
const httpServer = app.listen(PORT, async () => {
  await connectMongo();
  console.log("🟢 Conectado a MongoDB Atlas");
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Socket.io (para realtimeproducts)
const io = new Server(httpServer);
export { io };

const productManager = new ProductManager();

io.on("connection", (socket) => {
  console.log("🛜 Cliente conectado via WebSocket");

  socket.on("addProduct", async (data) => {
    await productManager.addProduct({
      ...data,
      description: "Producto desde websocket",
      code: "socket-code",
      price: parseInt(data.price),
      stock: 1,
      status: true,
      category: "general",
      thumbnails: [],
    });

    const products = await productManager.getProducts();
    io.emit("products", products);
  });
});