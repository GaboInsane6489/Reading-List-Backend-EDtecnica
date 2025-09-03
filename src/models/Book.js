// src/models/Book.js
// Define el "esquema" y el "modelo" Book (Libro) en MongoDB.

import mongoose from "mongoose";

// Creamos un esquema: describe la forma de los documentos de la colección "books".
const bookSchema = new mongoose.Schema(
  {
    // Título del libro: obligatorio, tipo string, se recortan espacios en extremos
    title: { type: String, required: true, trim: true },

    // Autor del libro: obligatorio, tipo string
    author: { type: String, required: true, trim: true },

    // Estado de lectura: restringido a 3 valores posibles
    status: {
      type: String,
      enum: ["to-read", "reading", "finished"], // valores permitidos
      default: "to-read", // valor por defecto
    },

    // Calificación del libro: opcional, entre 0 y 5
    rating: { type: Number, min: 0, max: 5 },

    // Notas personales: opcional, string vacío por defecto
    notes: { type: String, default: "" },

    // Etiquetas libres: array de strings. Si no se envía, será []
    tags: { type: [String], default: [] },
  },
  {
    // timestamps agrega createdAt y updatedAt automáticamente
    timestamps: true,
  }
);

// Exportamos el "modelo" Book construido a partir del esquema.
// Mongoose creará (o usará) la colección "books" (plural, minúsculas).
export default mongoose.model("Book", bookSchema);
