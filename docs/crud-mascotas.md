# CRUD de Mascotas

## Objetivo

El CRUD de Mascotas permite gestionar la tabla `MASCOTA` desde el backend.

Esta parte corresponde a la issue del backend centrada en Mascotas. La solucion se ha mantenido simple, usando endpoints REST y consultas directas a MariaDB.

## Tabla relacionada

El CRUD trabaja con la tabla `MASCOTA`.

Campos principales:

```txt
id_mascota
id_dueno
nombre
especie
raza
fecha_nacimiento
sexo
peso
observaciones
```

La columna `id_dueno` relaciona cada mascota con un dueno existente.

## Archivos implicados

### `src/routes/mascotaRoutes.js`

Define las rutas disponibles para Mascotas.

### `src/controllers/mascotaController.js`

Recibe las peticiones, valida los datos basicos y devuelve las respuestas HTTP.

### `src/repositories/mascotaRepository.js`

Ejecuta las consultas SQL necesarias contra MariaDB.

## Endpoints

### Listar mascotas

```txt
GET /api/mascotas
```

Devuelve todas las mascotas registradas.

### Obtener una mascota por id

```txt
GET /api/mascotas/:id
```

Devuelve una mascota concreta.

Si no existe, responde con `404`.

### Crear una mascota

```txt
POST /api/mascotas
```

Crea una nueva mascota.

Ejemplo de cuerpo:

```json
{
  "id_dueno": 1,
  "nombre": "Luna",
  "especie": "Perro",
  "raza": "Labrador",
  "fecha_nacimiento": "2021-04-10",
  "sexo": "Hembra",
  "peso": 24.5,
  "observaciones": "Sin observaciones"
}
```

Si se crea correctamente, responde con `201`.

### Editar una mascota

```txt
PUT /api/mascotas/:id
```

Actualiza los datos de una mascota existente.

Si la mascota no existe, responde con `404`.

### Eliminar una mascota

```txt
DELETE /api/mascotas/:id
```

Elimina una mascota existente.

Si la mascota no existe, responde con `404`.

Si la mascota tiene citas asociadas, MariaDB no permite el borrado por la clave foranea y la API responde con `409`.

## Validaciones basicas

Se validan solo los datos minimos para mantener el proyecto sencillo:

- `id_dueno` debe ser un identificador valido
- `nombre` es obligatorio
- `especie` es obligatoria
- `fecha_nacimiento`, si se envia, debe tener formato `YYYY-MM-DD`
- `peso`, si se envia, debe ser un numero mayor o igual que 0

No se han anadido reglas avanzadas porque esa parte corresponde a futuras issues de logica de negocio.

## Respuestas de error

La API devuelve respuestas claras en JSON.

Ejemplos:

```json
{ "error": "Mascota no encontrada." }
```

```json
{ "error": "El campo nombre es obligatorio." }
```

```json
{ "error": "El dueno indicado no existe." }
```

## Resumen

El CRUD de Mascotas permite:

- listar mascotas
- consultar una mascota por id
- crear mascotas
- editar mascotas
- eliminar mascotas

La implementacion queda preparada para que el frontend pueda consumir estos endpoints mas adelante.
