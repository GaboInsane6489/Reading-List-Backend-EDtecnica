// src/middlewares/error.js
// Middlewares para 404 y manejo centralizado de errores.

/**
 * Si nadie respondió antes, es que la ruta no existe.
 * Devolvemos 404 con un JSON simple.
 */
export function notFound(_req, res) {
  res.status(404).json({ error: "Ruta no encontrada" });
}

/**
 * Manejador de errores final. Si en algún controlador hacemos "throw new Error(...)",
 * Express caerá aquí. También captura errores de async/await.
 */
export function onError(err, _req, res, _next) {
  // Log en consola para desarrolladores
  console.error("❌ Error:", err);

  // Código de estado: si el error trae .status lo respetamos; sino usamos 500
  const code = err.status || 500;

  // Mensaje simple para el cliente
  res.status(code).json({
    error: err.message || "Error interno del servidor",
  });
}
