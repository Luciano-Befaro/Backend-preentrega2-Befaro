import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import path from "path";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js"; 

import ProductManager from "./managers/ProductManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

// Configurar Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Middlewares para parsear JSON y URL encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter); // 👈 Ruta para las vistas (home y realtimeproducts)

// Crear servidor HTTP
const httpServer = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Instanciar socket.io
export const io = new Server(httpServer);

// Instanciar ProductManager
const productManager = new ProductManager();

// Configuración de socket.io
io.on("connection", (socket) => {
  console.log("🛜 Nuevo cliente conectado vía WebSocket");

  // Cuando un cliente envía un producto nuevo
  socket.on("addProduct", async (data) => {
    await productManager.addProduct({
      ...data,
      description: "Producto agregado en tiempo real",
      code: "auto",
      stock: 1,
      status: true,
      category: "general",
      thumbnails: []
    });

    const products = await productManager.getProducts();
    io.emit("products", products); // Enviar a todos los clientes actualizados
  });
});