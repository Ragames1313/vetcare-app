# Frontend de Mascotas

## Objetivo

Esta parte del proyecto conecta las vistas principales de Mascotas con la API REST del backend.

La base visual sigue siendo la misma que ya estaba maquetada, pero ahora la informacion se carga desde la API y los formularios realizan operaciones reales sobre la base de datos.

## Estructura actual

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
```

## Vistas

### `mascotas/index.html`

Vista de listado de mascotas.

Incluye:

- cabecera de VetCare
- resumen visual calculado desde la API
- tarjetas de mascotas cargadas desde el backend
- enlaces a detalle, edicion y borrado

### `mascotas/crear.html`

Vista de creacion de una mascota.

Incluye un formulario con los campos principales de la tabla `MASCOTA` y validacion basica antes de enviar.

### `mascotas/detalle.html`

Vista de detalle de una mascota.

Muestra los datos reales de la mascota seleccionada y permite editar o borrar el registro.

### `mascotas/editar.html`

Vista de edicion de una mascota.

Usa el mismo estilo que la creacion, pero con datos cargados desde la API para editar el registro real.

## CSS

El archivo `Frontend/css/styles.css` contiene todos los estilos compartidos.

Se ha usado una unica hoja de estilos para mantener el frontend simple y facil de seguir.

## Decisiones tomadas

- No se usa React, Vue, Angular ni frameworks CSS.
- Se mantiene la estetica simple y ordenada que ya estaba planteada.
- Se usa un unico script compartido para no duplicar logica.
- Los datos se cargan desde la API, pero la presentacion sigue siendo sencilla y facil de defender.

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

Desde ahi se puede navegar a las otras vistas y realizar operaciones CRUD reales.

## Resumen

Las vistas de Mascotas quedan conectadas a la API y preparadas para trabajar con datos reales:

- listado
- creacion
- detalle
- edicion
