# 📚 Reading List Backend — EDTECNICA

Backend modular, accesible y escalable para la gestión de libros. Diseñado con enfoque premium para integrarse fluidamente con el frontend compartido del equipo.

---

## 🚀 Tecnologías utilizadas

- Node.js + Express
- MongoDB + Mongoose
- Estructura modular por controladores, modelos y rutas
- Validaciones manuales y respuestas accesibles
- Estándar visual y semántico en JSON

---

## 📁 Estructura del proyecto

src/
├── controllers/ # Lógica de negocio (libros, usuarios, etc.)
├── models/ # Esquemas de Mongoose
├── routes/ # Rutas agrupadas por entidad
├── middlewares/ # Validaciones, manejo de errores
├── utils/ # Funciones reutilizables
├── config/ # Conexión a DB y variables de entorno index.js # Punto de entrada del servidor

Código

---

## 🔗 Endpoints principales

### Libros

| Método | Ruta             | Descripción                |
| ------ | ---------------- | -------------------------- |
| POST   | `/api/books`     | Crear nuevo libro          |
| GET    | `/api/books`     | Obtener todos los libros   |
| GET    | `/api/books/:id` | Obtener libro por ID       |
| PUT    | `/api/books/:id` | Actualizar libro existente |
| DELETE | `/api/books/:id` | Eliminar libro por ID      |

> Todas las respuestas siguen el formato:

```json
{
  "success": true,
  "data": { /* contenido */ },
  "message": "Descripción clara del resultado"
}
🧪 Cómo correr el proyecto localmente
Clona el repositorio:

bash
git clone https://github.com/TU_USUARIO/reading-list-backend-edtecnica.git
cd reading-list-backend-edtecnica
Instala dependencias:

bash
npm install
Crea un archivo .env con tu URI de MongoDB:

Código
MONGODB_URI=mongodb://localhost:27017/readinglist
Inicia el servidor:

bash
npm run dev
🧠 Convenciones y estilo
Validaciones centralizadas y reutilizables

Comentarios clave para escalabilidad y colaboración

Respuestas JSON accesibles y consistentes

Modularidad por entidad y responsabilidad

🤝 Integración con frontend
Este backend está diseñado para integrarse con el frontend compartido del equipo. Se recomienda consumir los endpoints usando fetch o axios, respetando el formato de respuesta para una experiencia fluida.

📌 Autor
Gabriel González
```
