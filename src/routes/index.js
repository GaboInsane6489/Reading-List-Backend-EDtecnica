// src/routes/index.js
// Define las rutas de la API y asocia cada ruta a su controlador.

import { Router } from "express";
import {
  createBook,
  listBooks,
  getBook,
  updateBook,
  removeBook,
} from "../controllers/bookController.js";

// Creamos un enrutador de Express: nos permite definir endpoints limpios.
const router = Router();

/**
 * Ruta de "salud" o "heartbeat": útil para comprobar rápidamente
 * si el servidor está funcionando.
 */
router.get("/api/health", (_req, res) => res.json({ ok: true }));

// CRUD de libros (Create, Read, Update, Delete)
router.post("/api/books", createBook); // Crear un libro
router.get("/api/books", listBooks); // Listar libros (con filtro/paginación simple)
router.get("/api/books/:id", getBook); // Obtener un libro por ID
router.patch("/api/books/:id", updateBook); // Actualización parcial por ID
router.delete("/api/books/:id", removeBook); // Borrar por ID

// Exportamos el router para montarlo en server.js
export default router;
