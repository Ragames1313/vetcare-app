# Frontend conectado con la API

## Objetivo

Esta fase convierte el frontend de VetCare en un cliente real de la API REST del backend.

La prioridad se ha mantenido simple: reutilizar la maquetacion ya creada, conectar las pantallas con la API y reflejar en la interfaz las validaciones y reglas de negocio que ya existen en el servidor.

## Estructura

```txt
Frontend/
  css/
    styles.css
  js/
    app.js
  mascotas/
    index.html
    crear.html
    detalle.html
    editar.html
  citas/
    index.html
    crear.html
    detalle.html
    editar.html
```

## Pantallas

Las pantallas siguen siendo las mismas que ya estaban previstas en el frontend:

- listado de mascotas
- creacion de mascota
- detalle de mascota
- edicion de mascota
- listado de citas
- creacion de cita
- detalle de cita
- edicion de cita

## Como se conecta con la API

Toda la logica de consumo se ha centralizado en `Frontend/js/app.js`.

Cada pagina indica su contexto con `data-entity` y `data-view` en el `body`, y el script decide que hacer:

- cargar listados desde la API
- pedir un registro por id para detalle y edicion
- enviar formularios con `POST` y `PUT`
- borrar registros con `DELETE`
- mostrar mensajes de exito o error

## Endpoints consumidos

### Mascotas

- `GET /api/mascotas`
- `GET /api/mascotas/:id`
- `POST /api/mascotas`
- `PUT /api/mascotas/:id`
- `DELETE /api/mascotas/:id`

### Citas

- `GET /api/citas`
- `GET /api/citas/:id`
- `POST /api/citas`
- `PUT /api/citas/:id`
- `DELETE /api/citas/:id`

## Validaciones y errores

El frontend hace validaciones basicas antes de enviar los formularios:

- campos obligatorios
- ids numericos validos
- peso mayor o igual que 0
- formato de fecha y hora correcto
- comprobacion visual de citas en fecha pasada
- comprobacion visual de citas duplicadas para el mismo veterinario y la misma fecha y hora

Cuando el backend rechaza una operacion, el mensaje JSON de error se muestra en pantalla con un bloque claro y simple.

## Estados visuales

La interfaz muestra estados sencillos para que la experiencia sea clara:

- carga de datos
- lista vacia
- mensaje de exito
- mensaje de error

Esto ayuda a explicar en la autoria que el frontend no solo pinta datos, sino que tambien comunica lo que esta pasando en cada accion.

## Decisiones tecnicas

Se ha seguido una solucion minimalista:

- no se ha usado ningun framework de frontend
- no se han añadido librerias nuevas
- se ha reutilizado el CSS existente
- se ha usado un unico script compartido para las ocho pantallas
- se ha habilitado CORS sencillo en el backend para permitir la comunicacion desde archivos HTML sueltos

## Resumen

El resultado es un frontend simple, limpio y defendible:

- mantiene el estilo visual ya creado
- consume la API real
- completa el CRUD
- muestra mensajes claros
- refleja las reglas de negocio del backend sin complicar el proyecto
