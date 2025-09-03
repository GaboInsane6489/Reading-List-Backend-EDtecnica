// src/db.js
// Este módulo se encarga únicamente de conectar a MongoDB usando Mongoose.

import mongoose from "mongoose";

/**
 * Conecta a MongoDB usando la URL que se le pase.
 * @param {string} uri - cadena de conexión (por ejemplo, process.env.MONGO_URI)
 */
export async function connectDB(uri) {
  // Intentamos conectar: si hay error, el .catch del server se enterará.
  await mongoose.connect(uri);
  // Si llegamos aquí, la conexión fue exitosa.
  console.log("✅ Conectado a MongoDB");
}
