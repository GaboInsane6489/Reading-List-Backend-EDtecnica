// Punto de entrada de la app: levanta el servidor Express,
// conecta a la base de datos y monta middlewares + rutas.

import express from "express"; // Framework web
import cors from "cors"; // Permite peticiones desde otros orígenes (útil en dev)
import morgan from "morgan"; // Log de peticiones en consola
import "dotenv/config"; // Carga variables de entorno desde .env
import { connectDB } from "./db.js"; // Función que conecta a Mongo
import router from "./routes/index.js"; // Nuestras rutas definidas
import { notFound, onError } from "./middlewares/error.js"; // Middlewares de error

// Creamos la aplicación Express
const app = express();

// ----- MIDDLEWARES GLOBALES -----

// Habilitamos CORS para que Postman, front local, etc., puedan llamar a la API
app.use(cors());

// morgan("dev") escribe por consola un log breve de cada request (método, URL, tiempo)
app.use(morgan("dev"));

// Este middleware permite que Express entienda JSON en req.body
app.use(express.json());

// ----- RUTAS DE LA APLICACIÓN -----

// Montamos todas las rutas de la API
app.use(router);

// Si ninguna ruta respondió, devolvemos 404
app.use(notFound);

// Si algo lanzó un error, se manejará aquí
app.use(onError);

// ----- ARRANQUE DEL SERVIDOR -----

// Puerto desde .env o 3000 por defecto
const PORT = process.env.PORT || 3000;

// Primero conectamos a la base de datos; luego levantamos el server.
// Usamos then/catch para controlar éxito/fracaso con mensajes claros.
connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 API lista en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    // Si no podemos conectar a Mongo, salimos con error.
    console.error("❌ No se pudo conectar a Mongo:", err);
    process.exit(1);
  });
