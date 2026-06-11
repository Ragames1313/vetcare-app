# VetCare

VetCare es una aplicacion web sencilla para la gestion de una clinica veterinaria.

El proyecto esta planteado como una recuperacion de 1º DAW, por lo que prioriza una solucion clara, ordenada y facil de explicar antes que una arquitectura compleja. La aplicacion permite trabajar con las entidades principales del modelo:

- Dueños
- Mascotas
- Citas
- Veterinarios

La parte desarrollada se centra en dejar una base funcional con MariaDB, un backend REST con Node.js y Express, y un frontend en HTML, CSS y JavaScript conectado a la API.

## Objetivo del Proyecto

El objetivo de VetCare es gestionar de forma basica una clinica veterinaria:

- Un dueño puede tener varias mascotas.
- Una mascota pertenece a un unico dueño.
- Una mascota puede tener varias citas.
- Un veterinario puede atender varias citas.
- Cada cita esta asociada a una mascota y a un veterinario.

El proyecto esta pensado por fases:

1. Base de datos.
2. Backend.
3. Frontend.
4. Conexion frontend-backend.
5. Tests y CI.

## Tecnologias

- MariaDB
- Node.js
- Express
- HTML
- CSS
- JavaScript
- Jest
- Supertest
- GitHub Actions

No se usa ningun framework de frontend para mantener el proyecto sencillo y facil de defender.

## Estructura del Proyecto

```txt
vetcare-app/
├── Backend/
│   ├── DB/
│   │   ├── schema.sql
│   │   └── reset.sql
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   ├── package.json
│   └── package-lock.json
├── Frontend/
│   ├── citas/
│   ├── mascotas/
│   ├── css/
│   └── js/
├── docs/
├── .github/
│   └── workflows/
│       └── ci.yml
└── README.md
```

## Base de Datos

La base de datos usa MariaDB y se llama `vetcare`.

Tablas principales:

- `DUENO`
- `MASCOTA`
- `CITA`
- `VETERINARIO`

Archivos SQL:

- `Backend/DB/schema.sql`: crea la base de datos, las tablas y datos basicos.
- `Backend/DB/reset.sql`: elimina y reconstruye la base de datos desde cero.

Para reconstruir la base de datos:

```bash
mariadb -u root -p < Backend/DB/reset.sql
```

## Backend

El backend esta hecho con Node.js y Express.

Endpoints principales:

```txt
GET    /api/mascotas
GET    /api/mascotas/:id
POST   /api/mascotas
PUT    /api/mascotas/:id
DELETE /api/mascotas/:id

GET    /api/citas
GET    /api/citas/:id
POST   /api/citas
PUT    /api/citas/:id
DELETE /api/citas/:id
```

La estructura se divide de forma sencilla:

- `routes`: define las rutas.
- `controllers`: recibe la peticion y prepara la respuesta.
- `repositories`: consulta MariaDB.
- `config/database.js`: gestiona la conexion con la base de datos.

### Configuracion del Backend

Dentro de `Backend` se usa un archivo `.env` con los datos de conexion:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=vetcare
```

Instalar dependencias:

```bash
cd Backend
npm install
```

Arrancar backend:

```bash
npm start
```

Modo desarrollo:

```bash
npm run dev
```

La API queda disponible en:

```txt
http://localhost:3000/api
```

## Frontend

El frontend esta hecho con HTML, CSS y JavaScript.

No usa React, Vue, Angular ni ningun framework. La idea es que sea facil de abrir, entender y explicar.

Vistas de Mascotas:

- Listado
- Crear
- Detalle
- Editar

Vistas de Citas:

- Listado
- Crear
- Detalle
- Editar

Archivos principales:

```txt
Frontend/mascotas/
Frontend/citas/
Frontend/css/styles.css
Frontend/js/app.js
```

El archivo `Frontend/js/app.js` conecta las pantallas con la API usando `fetch`.

Para probar el frontend, abre directamente en el navegador:

```txt
Frontend/mascotas/index.html
```

Tambien puedes usar una extension tipo Live Server si quieres navegar de forma mas comoda.

## Reglas de Negocio

El backend incluye validaciones basicas y faciles de defender:

- No se permite crear o editar una cita en una fecha pasada.
- No se permite que un veterinario tenga dos citas a la misma fecha y hora.
- No se permite crear una mascota con una fecha de nacimiento futura.
- No se permite crear una mascota con peso negativo.

Estas reglas se aplican en el backend antes de guardar los datos.

## Tests

El proyecto incluye tests unitarios e integracion.

Tests unitarios:

```txt
Backend/tests/citaController.test.js
Backend/tests/mascotaController.test.js
```

Tests de integracion:

```txt
Backend/tests/api.integration.js
```

Ejecutar tests unitarios:

```bash
cd Backend
npm test
```

Ejecutar tests de integracion:

```bash
cd Backend
npm run test:integration
```

Los tests de integracion necesitan MariaDB disponible y la base de datos preparada.

## Integracion Continua

El proyecto tiene un workflow basico de GitHub Actions en:

```txt
.github/workflows/ci.yml
```

El workflow se ejecuta en:

- `push`
- `pull_request`

Comprueba:

- Instalacion de dependencias del backend.
- Preparacion de MariaDB.
- Tests unitarios.
- Tests de integracion.
- Sintaxis de archivos JavaScript principales.

## Documentacion

La carpeta `docs` contiene explicaciones mas concretas de cada parte:

```txt
docs/backend.md
docs/crud-mascotas.md
docs/crud-citas.md
docs/reglas-negocio.md
docs/tests-unitarios.md
docs/tests-integracion.md
docs/frontend-mascotas.md
docs/frontend-citas.md
docs/frontend-api.md
docs/ci.md
```

Esta documentacion esta pensada para entender el proyecto y poder defenderlo durante la autoria.

## Estado Actual

El proyecto incluye:

- Base de datos MariaDB creada.
- Tablas y relaciones principales.
- Backend REST funcional.
- CRUD de Mascotas.
- CRUD de Citas.
- Validaciones basicas de negocio.
- Frontend responsive.
- Conexion real entre frontend y backend.
- Tests unitarios.
- Tests de integracion.
- CI basico con GitHub Actions.
- Documentacion del trabajo realizado.

## Enfoque

VetCare no busca ser una aplicacion grande ni profesional de produccion.

Busca ser una solucion academica correcta:

- simple
- clara
- ordenada
- funcional
- facil de mantener
- facil de explicar

Ese es el criterio principal de todas las decisiones tomadas en el proyecto.
