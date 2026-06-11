# Frontend de Mascotas

## Objetivo

Esta parte del proyecto maqueta las vistas principales de Mascotas usando solo HTML y CSS.

Corresponde a la issue de frontend de Mascotas, por lo que no se conecta todavia con la API y no incluye JavaScript.

## Estructura creada

```txt
Frontend/
  css/
    styles.css
  mascotas/
    index.html
    crear.html
    detalle.html
    editar.html
```

## Vistas

### `mascotas/index.html`

Vista de listado de mascotas.

Incluye:

- cabecera de VetCare
- resumen visual
- tarjetas de mascotas
- enlaces a detalle, edicion y creacion

### `mascotas/crear.html`

Vista de creacion de una mascota.

Incluye un formulario con los campos principales de la tabla `MASCOTA`.

### `mascotas/detalle.html`

Vista de detalle de una mascota.

Muestra datos principales y observaciones de ejemplo.

### `mascotas/editar.html`

Vista de edicion de una mascota.

Usa el mismo estilo que la creacion, pero con datos ya rellenos para representar una edicion real.

## CSS

El archivo `Frontend/css/styles.css` contiene todos los estilos compartidos.

Se ha usado una unica hoja de estilos para mantener el frontend simple y facil de seguir.

## Decisiones tomadas

- No se usa JavaScript porque esta issue solo pide maquetacion.
- No se consume la API porque la conexion con backend corresponde a una issue posterior.
- No se usa React, Vue, Angular ni frameworks CSS.
- Los datos visibles son de ejemplo para poder ver como quedara la interfaz.
- El diseno es responsive y se adapta a movil y escritorio.

## Responsive

El CSS incluye media queries para pantallas pequenas.

En movil:

- las tarjetas pasan a una sola columna
- los formularios se muestran en una columna
- los botones ocupan todo el ancho disponible
- la cabecera se adapta en vertical

## Como abrirlo

Se puede abrir directamente en el navegador:

```txt
Frontend/mascotas/index.html
```

Desde ahi se puede navegar a las otras vistas mediante los enlaces de la maqueta.

## Resumen

La entrega deja preparadas las cuatro vistas principales de Mascotas:

- listado
- creacion
- detalle
- edicion

Quedan listas para conectarse con la API en una tarea posterior.
