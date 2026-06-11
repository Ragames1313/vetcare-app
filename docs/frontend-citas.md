# Frontend de Citas

## Objetivo

Esta parte del proyecto conecta las vistas principales de Citas con la API REST del backend.

La maquetacion previa se ha mantenido, pero ahora la agenda se carga desde la API y los formularios ejecutan el CRUD real.

## Estructura actual

```txt
Frontend/
  js/
    app.js
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
- resumen visual calculado desde la API
- tarjetas de citas cargadas desde el backend
- enlaces a detalle, edicion y borrado

### `citas/crear.html`

Vista de creacion de una cita.

Incluye un formulario con los campos principales de la tabla `CITA`, usando `datetime-local` para ajustar la fecha y la hora al formato real del backend.

### `citas/detalle.html`

Vista de detalle de una cita.

Muestra los datos reales de la cita seleccionada y permite editar o borrar el registro.

### `citas/editar.html`

Vista de edicion de una cita.

Usa el mismo estilo que la creacion, pero con datos cargados desde la API para editar el registro real.

## Decisiones tomadas

- No se usa React, Vue, Angular ni frameworks CSS.
- Se reutiliza el estilo de Mascotas para mantener coherencia visual.
- Se usa un unico script compartido para no duplicar logica.
- Las validaciones de negocio se muestran de forma clara sin sobrecargar la interfaz.
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

Desde ahi se puede navegar a las otras vistas y realizar operaciones CRUD reales.

## Resumen

Las vistas de Citas quedan conectadas a la API y preparadas para trabajar con datos reales:

- listado
- creacion
- detalle
- edicion
