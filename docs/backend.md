# Backend de VetCare

## Objetivo

El backend de VetCare es una API REST sencilla para conectar la aplicacion con la base de datos MariaDB.

En esta fase del proyecto se ha preparado la estructura minima necesaria para poder implementar el CRUD de Mascotas, sin anadir funcionalidades extra.

## Estructura

```txt
Backend/
  DB/
    schema.sql
    reset.sql
  src/
    app.js
    server.js
    config/
      database.js
    routes/
      mascotaRoutes.js
    controllers/
      mascotaController.js
    repositories/
      mascotaRepository.js
```

## Archivos principales

### `src/server.js`

Es el punto de entrada del backend.

Su funcion es arrancar el servidor y escuchar peticiones en el puerto configurado.

### `src/app.js`

Configura la aplicacion Express.

Aqui se indican:

- el uso de JSON en las peticiones
- las rutas principales de la API
- la respuesta para rutas no encontradas
- el manejo basico de JSON mal formado

### `src/config/database.js`

Centraliza la conexion con MariaDB.

Lee los datos de conexion desde variables de entorno y permite ejecutar consultas SQL usando el pool de conexiones.

### `src/routes/`

Contiene las rutas de la API.

Cada archivo de rutas indica que endpoint llama a cada funcion del controlador.

### `src/controllers/`

Contiene la logica de entrada y salida HTTP.

Los controladores leen datos de la peticion, validan lo basico, llaman al repositorio y devuelven una respuesta.

### `src/repositories/`

Contiene las consultas a la base de datos.

Los repositorios son los archivos que ejecutan `SELECT`, `INSERT`, `UPDATE` y `DELETE`.

## Flujo de una peticion

El flujo seguido es:

```txt
Peticion HTTP
  -> routes
  -> controller
  -> repository
  -> MariaDB
```

Ejemplo:

```txt
GET /api/mascotas
  -> mascotaRoutes.js
  -> mascotaController.js
  -> mascotaRepository.js
  -> tabla MASCOTA
```

## Variables de entorno

El archivo `.env.example` indica las variables necesarias:

```txt
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=vetcare
```

Para ejecutar el backend en local se debe crear un archivo `.env` con los datos reales de MariaDB.

## Endpoints actuales

Actualmente el backend tiene implementado:

```txt
/api/mascotas
```

Este endpoint permite gestionar el CRUD completo de Mascotas.

## Pendiente: CRUD de Citas

Este apartado queda reservado para la siguiente fase del backend.

Cuando se implemente el CRUD de Citas se podra documentar aqui:

- rutas de citas
- controlador de citas
- repositorio de citas
- operaciones disponibles
- relacion con Mascota y Veterinario

No se ha implementado todavia porque corresponde a otra issue del proyecto.
