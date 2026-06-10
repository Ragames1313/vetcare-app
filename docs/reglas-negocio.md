# Reglas de negocio del backend

## Objetivo

Esta parte del backend anade dos reglas de negocio sencillas para que la API no solo guarde datos, sino que tambien controle situaciones basicas de una clinica veterinaria.

Las reglas se aplican sobre las Citas porque es la entidad que relaciona mascotas, veterinarios y fecha de atencion.

## Regla 1: No permitir citas en fechas pasadas

### Que controla

No se puede crear ni modificar una cita si `fecha_hora` corresponde a una fecha y hora anterior al momento actual.

### Donde se aplica

Se aplica en:

```txt
POST /api/citas
PUT /api/citas/:id
```

### Respuesta de error

```json
{
  "error": "No se puede crear o modificar una cita en una fecha pasada."
}
```

### Por que tiene sentido

En una clinica veterinaria no tiene sentido registrar nuevas citas para un momento que ya ha pasado.

## Regla 2: No duplicar citas de un veterinario a la misma hora

### Que controla

Un veterinario no puede tener dos citas asignadas exactamente en la misma `fecha_hora`.

### Donde se aplica

Se aplica en:

```txt
POST /api/citas
PUT /api/citas/:id
```

Antes de guardar la cita, el backend busca si ya existe otra cita con el mismo `id_veterinario` y la misma `fecha_hora`.

### Respuesta de error

```json
{
  "error": "El veterinario ya tiene una cita asignada en esa fecha y hora."
}
```

### Por que tiene sentido

Un veterinario no puede atender dos citas a la vez.

## Archivos modificados

```txt
Backend/src/controllers/citaController.js
Backend/src/repositories/citaRepository.js
```

## Resumen

Las reglas implementadas son:

- evitar citas en fechas pasadas
- evitar solapamientos exactos de citas para el mismo veterinario

Son reglas simples, faciles de explicar y suficientes para cumplir la parte de logica de negocio del proyecto de recuperacion.
