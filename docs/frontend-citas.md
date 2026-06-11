# Frontend de Citas

## Objetivo

Esta parte del proyecto maqueta las vistas principales de Citas usando solo HTML y CSS.

Corresponde a la issue de frontend de Citas, por lo que no se conecta todavia con la API y no incluye JavaScript.

## Estructura creada

```txt
Frontend/
  citas/
    index.html
    crear.html
    detalle.html
    editar.html
```

Se reutiliza la hoja de estilos comun:

```txt
Frontend/css/styles.css
```

## Vistas

### `citas/index.html`

Vista de listado de citas.

Incluye:

- cabecera de VetCare
- resumen visual de agenda
- tarjetas de citas
- enlaces a detalle, edicion y creacion

### `citas/crear.html`

Vista de creacion de una cita.

Incluye un formulario con los campos principales de la tabla `CITA`.

### `citas/detalle.html`

Vista de detalle de una cita.

Muestra los datos principales, la relacion con mascota y veterinario, y observaciones.

### `citas/editar.html`

Vista de edicion de una cita.

Usa el mismo estilo que la creacion, pero con datos ya rellenos para representar una edicion real.

## Decisiones tomadas

- No se usa JavaScript porque esta issue solo pide maquetacion.
- No se consume la API porque la conexion con backend corresponde a una issue posterior.
- No se usa React, Vue, Angular ni frameworks CSS.
- Los datos visibles son de ejemplo para poder ver como quedara la interfaz.
- Se reutiliza el estilo de Mascotas para mantener coherencia visual.
- Las tarjetas de citas usan una caja de fecha/hora para destacar la agenda.

## Responsive

En movil:

- las tarjetas de citas pasan a una columna
- la fecha y hora ocupan todo el ancho de la tarjeta
- el texto queda centrado
- los formularios se muestran en una columna
- los botones ocupan todo el ancho disponible

## Como abrirlo

Se puede abrir directamente en el navegador:

```txt
Frontend/citas/index.html
```

Desde ahi se puede navegar a las otras vistas mediante los enlaces de la maqueta.

## Resumen

La entrega deja preparadas las cuatro vistas principales de Citas:

- listado
- creacion
- detalle
- edicion

Quedan listas para conectarse con la API en una tarea posterior.
