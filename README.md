# To-Do List API

API REST para gestión de tareas construida con **FastAPI** y **SQLAlchemy**, con un frontend simple en HTML/CSS/JS puro para consumirla.

Proyecto hecho como práctica de backend en Python, aplicando una arquitectura en capas (routers, schemas, models, database) y persistencia real en base de datos.

## Stack

- **Backend:** FastAPI
- **ORM:** SQLAlchemy
- **Base de datos:** SQLite
- **Validación de datos:** Pydantic
- **Frontend:** HTML, CSS y JavaScript vanilla (sin frameworks ni build tools)

## Estructura del proyecto

```
├── main.py          # Endpoints de la API
├── database.py       # Configuración de la conexión a la base de datos
├── models.py         # Modelos de SQLAlchemy (tablas)
├── schemas.py         # Modelos de Pydantic (validación de entrada/salida)
├── index.html         # Frontend
├── style.css          # Estilos del frontend
└── script.js           # Lógica del frontend (fetch a la API)
```

## Cómo correrlo

**1. Cloná el repositorio**

```bash
git clone https://github.com/RodriGerometta/To-Do-List
cd To-Do-List
```

**2. Creá y activá un entorno virtual**

```bash
python -m venv venv
venv\Scripts\Activate.ps1     # Windows
source venv/bin/activate      # Mac/Linux
```

**3. Instalá las dependencias**

```bash
pip install fastapi uvicorn sqlalchemy
```

**4. Levantá el servidor**

```bash
uvicorn main:app --reload
```

La API queda disponible en `http://127.0.0.1:8000`, y la documentación interactiva (Swagger UI) en `http://127.0.0.1:8000/docs`.

**5. Abrí el frontend**

Como el frontend usa archivos separados (`style.css`, `script.js`), no lo abras con doble clic. Levantá un servidor local simple:

```bash
python -m http.server 5500
```

Y entrá a `http://localhost:5500` en el navegador.

## Endpoints

| Método | Ruta | Descripción | Código de éxito |
|---|---|---|---|
| GET | `/tareas` | Lista todas las tareas | 200 |
| GET | `/tareas/{id}` | Obtiene una tarea puntual | 200 |
| POST | `/tareas` | Crea una tarea nueva | 201 |
| PUT | `/tareas/{id}` | Actualiza una tarea existente | 200 |
| DELETE | `/tareas/{id}` | Elimina una tarea | 200 |

### Ejemplo de body (POST / PUT)

```json
{
  "titulo": "Aprender FastAPI",
  "descripcion": "Terminar el CRUD con SQLAlchemy",
  "completada": false
}
```

## Notas

- El frontend fue generado con asistencia de IA; el backend (API, modelos, lógica de base de datos) fue desarrollado a mano como práctica.
- Falta agregar autenticación y tests, pendiente como próximos pasos de mejora.

## Autor

**Rodrigo Gerometta**
[GitHub](https://github.com/RodriGerometta) · [LinkedIn](https://linkedin.com/in/rodrigo-gerometta)
