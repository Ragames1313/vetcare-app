# CRUD de Citas

## Objetivo

El CRUD de Citas permite gestionar la tabla `CITA` desde el backend.

Esta parte corresponde a la issue del backend centrada en Citas. La solucion sigue el mismo patron que Mascotas: rutas, controlador y repositorio.

## Tabla relacionada

El CRUD trabaja con la tabla `CITA`.

Campos principales:

```txt
id_cita
id_mascota
id_veterinario
fecha_hora
motivo
estado
observaciones
```

La columna `id_mascota` relaciona la cita con una mascota existente.

La columna `id_veterinario` relaciona la cita con un veterinario existente.

## Archivos implicados

### `src/routes/citaRoutes.js`

Define las rutas disponibles para Citas.

### `src/controllers/citaController.js`

Recibe las peticiones, valida los datos basicos y devuelve las respuestas HTTP.

### `src/repositories/citaRepository.js`

Ejecuta las consultas SQL necesarias contra MariaDB.

## Endpoints

### Listar citas

```txt
GET /api/citas
```

Devuelve todas las citas registradas.

### Obtener una cita por id

```txt
GET /api/citas/:id
```

Devuelve una cita concreta.

Si no existe, responde con `404`.

### Crear una cita

```txt
POST /api/citas
```

Crea una nueva cita.

Ejemplo de cuerpo:

```json
{
  "id_mascota": 1,
  "id_veterinario": 1,
  "fecha_hora": "2026-06-15 10:30:00",
  "motivo": "Revision general",
  "estado": "Pendiente",
  "observaciones": "Primera visita"
}
```

Si se crea correctamente, responde con `201`.

### Editar una cita

```txt
PUT /api/citas/:id
```

Actualiza los datos de una cita existente.

Si la cita no existe, responde con `404`.

### Eliminar una cita

```txt
DELETE /api/citas/:id
```

Elimina una cita existente.

Si la cita no existe, responde con `404`.

## Validaciones basicas

Se validan solo los datos minimos para mantener el proyecto sencillo:

- `id_mascota` debe ser un identificador valido
- `id_veterinario` debe ser un identificador valido
- `fecha_hora` es obligatoria y debe tener formato `YYYY-MM-DD HH:mm:ss`
- `motivo` es obligatorio
- `estado` es obligatorio

No se han anadido reglas avanzadas porque esa parte corresponde a futuras issues de logica de negocio.

## Reglas de negocio aplicadas

Ademas de las validaciones basicas, el backend aplica dos reglas de negocio antes de crear o editar una cita:

- no se puede crear o modificar una cita en una fecha pasada
- un veterinario no puede tener dos citas en la misma fecha y hora

Estas reglas estan documentadas con mas detalle en `docs/reglas-negocio.md`.

## Respuestas de error

La API devuelve respuestas claras en JSON.

Ejemplos:

```json
{ "error": "Cita no encontrada." }
```

```json
{ "error": "El campo motivo es obligatorio." }
```

```json
{ "error": "La mascota o el veterinario indicado no existe." }
```

```json
{ "error": "El veterinario ya tiene una cita asignada en esa fecha y hora." }
```

## Resumen

El CRUD de Citas permite:

- listar citas
- consultar una cita por id
- crear citas
- editar citas
- eliminar citas

La implementacion queda preparada para que el frontend pueda consumir estos endpoints mas adelante.
