// Aquí implementamos la lógica de cada endpoint (crear, listar, obtener, actualizar, borrar).

import Book from "../models/Book.js";

/**
 * Crea un libro nuevo.
 * Método/URL: POST /api/books
 * Body JSON esperado: { title, author, status?, rating?, notes?, tags? }
 */
export async function createBook(req, res) {
  // 1) Leemos los campos enviados en el cuerpo de la petición
  const { title, author, status, rating, notes, tags } = req.body;

  // 2) Validación mínima: title y author son obligatorios
  if (!title || !author) {
    return res.status(400).json({ error: "title y author son requeridos" });
  }

  // 3) Creamos el documento en Mongo usando el modelo Book
  //    Uso de trim() en title/author para limpiar espacios
  const book = await Book.create({
    title: title.trim(),
    author: author.trim(),
    status, // si no viene, Mongoose pondrá "to-read" (default)
    rating, // si viene, Mongoose validará min/max
    notes,
    tags,
  });

  // 4) Respondemos con 201 (creado) y el libro resultante
  res.status(201).json(book);
}

/**
 * Lista libros con filtro y paginación sencilla.
 * Método/URL: GET /api/books
 *
 * Query params opcionales:
 *   q=texto       → busca en title/author (insensible a mayúsculas)
 *   status=...    → filtra por "to-read" | "reading" | "finished"
 *   tag=js        → filtra por etiquetas que contengan "js"
 *   page=1        → página actual (1-based, es decir, primera página es 1)
 *   limit=50      → cantidad de items por página
 *
 * Respuesta: { total, page, limit, items: [...] }
 */
export async function listBooks(req, res) {
  // 1) Leemos parámetros de consulta (query string) como strings
  const { q, status, tag } = req.query;

  // 2) Convertimos page y limit a números;
  //    si vienen vacíos, usamos page=1 y limit=50 por defecto.
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 50;

  // 3) Por seguridad, si page/limit no son números válidos, forzamos valores sanos
  const safePage = Number.isFinite(page) && page > 0 ? page : 1; // isFinite verifica que sea un número finito
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 50;

  // Construimos un objeto "filter" paso a paso:
  //    - Si llega "q": queremos los libros cuyo título o autor contenga ese texto (regex "i" = case-insensitive)
  //    - Un regex es una expresión regular que permite buscar patrones en strings.
  //    - Si llega "status": filtramos por ese estado exacto
  //    - Si llega "tag": pedimos libros cuyo array "tags" contenga ese valor

  //   	•	Si te llega q (el texto a buscar), agregas una condición OR:
  // “tráeme documentos cuyo title o author contengan q, sin distinguir mayúsculas/minúsculas”.
  // 	•	{ $regex: q, $options: "i" } significa:
  // 	•	$regex: q → usa q como patrón de expresión regular.
  // 	•	$options: "i" → insensible a mayúsculas (case-insensitive).
  //   const filter = {};

  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: "i" } }, // Busca en el título, options "i" para insensibilidad a mayúsculas
      { author: { $regex: q, $options: "i" } }, // Busca en el autor, options "i" para insensibilidad a mayúsculas
    ];
  }
  if (status) {
    filter.status = status;
  }
  if (tag) {
    filter.tags = tag;
  }

  // ) Calculamos cuántos documentos saltarnos para la paginación:
  //    Si estamos en la página 1, skip = 0 (no saltamos ninguno).
  //    Si estamos en la página 2, skip = (2 - 1) * limit = limit.
  //    Si estamos en la página 3, skip = (3 - 1) * limit = 2*limit. etc.
  const skip = (safePage - 1) * safeLimit; // esto lo que hace es
  // calcular cuántos documentos saltar para llegar a la página correcta.

  // 6) Obtenemos los items de esta "página":
  //    - find(filter): aplica el filtro
  //    - sort({ createdAt: -1 }): ordena del más nuevo al más viejo
  //    - skip(skip): salta 'skip' documentos para empezar en la página correcta
  //    - limit(safeLimit): limita el número de documentos devueltos
  const items = await Book.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(safeLimit);

  // Contamos cuántos documentos TOTales hay que cumplan el filtro.
  //    Esto sirve para que el cliente (Postman/Front) sepa cuántas páginas hay.
  const total = await Book.countDocuments(filter);

  // ) Respondemos con un objeto que incluye:
  //    - total general
  //    - página actual
  //    - tamaño de página (limit)
  //    - items: los documentos de ESTA página
  res.json({
    total,
    page: safePage,
    limit: safeLimit,
    items,
  });
}

/**
 * Obtiene un libro por su ID.
 * Método/URL: GET /api/books/:id
 */
export async function getBook(req, res) {
  // 1) Extraemos el id de la URL: /api/books/:id
  // jnrkjnkjnvfrjknfrjknrfkjnlwefjkn
  const { id } = req.params;

  // 2) Buscamos en la base por ID
  const book = await Book.findById(id);

  // 3) Si no lo encontramos, devolvemos 404
  if (!book) {
    return res.status(404).json({ error: "Libro no encontrado" });
  }

  // 4) Si existe, lo devolvemos
  res.json(book);
}

/**
 * Actualiza parcialmente un libro por ID.
 * Método/URL: PATCH /api/books/:id
 * Body JSON: puedes mandar uno o varios campos a actualizar.
 */
export async function updateBook(req, res) {
  // 1) Obtenemos el ID desde params
  const { id } = req.params;

  // 2) Obtenemos el cuerpo de la petición (los cambios)
  const updates = req.body;

  // 3) findByIdAndUpdate:
  //    - new: true    → devuelve el documento YA actualizado
  //    - runValidators: true → valida con el esquema (ej. rating <= 5)
  const book = await Book.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  // 4) Si no existe, 404
  if (!book) {
    return res.status(404).json({ error: "Libro no encontrado" });
  }

  // 5) Devolvemos el libro actualizado
  res.json(book);
}

/**
 * Borra un libro por ID.
 * Método/URL: DELETE /api/books/:id
 */
export async function removeBook(req, res) {
  // 1) Obtenemos el ID
  const { id } = req.params;

  // 2) Intentamos borrar
  const deleted = await Book.findByIdAndDelete(id);

  // 3) Si no existía, 404
  if (!deleted) {
    return res.status(404).json({ error: "Libro no encontrado" });
  }

  // 4) Confirmamos el borrado
  res.json({ ok: true });
}
