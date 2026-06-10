# Tests unitarios del backend

## Objetivo

Los tests unitarios comprueban la logica interna del backend sin depender de MariaDB.

En esta fase se han creado pruebas sencillas para validar la logica principal de Citas, especialmente las reglas de negocio.

## Herramienta usada

Se usa `Jest` como herramienta de testing.

El comando para ejecutar la suite es:

```bash
npm test
```

Debe ejecutarse desde la carpeta `Backend`.

```bash
cd Backend
npm test
```

## Archivo de tests

```txt
Backend/tests/citaController.test.js
```

## Que se prueba

Los tests cubren casos importantes del controlador de Citas:

- rechazar una cita en fecha pasada
- rechazar una cita si el veterinario ya tiene otra cita a esa hora
- crear una cita cuando los datos son validos y no hay conflicto
- devolver `404` al intentar editar una cita que no existe

## Uso de mocks

El repositorio de Citas se mockea para no acceder a MariaDB durante los tests unitarios.

Esto permite probar solo la logica del controlador:

```txt
citaController.js
```

sin depender de:

```txt
citaRepository.js
MariaDB
```

## Resumen

La suite es pequena y centrada en lo importante:

- valida reglas de negocio
- prueba casos correctos y casos de error
- evita depender de la base de datos
- queda preparada para ampliarse en futuras issues
