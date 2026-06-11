# Tests unitarios del backend

## Objetivo

Los tests unitarios comprueban la logica interna del backend sin depender de MariaDB.

En esta fase se han creado pruebas sencillas para validar la logica principal de Citas y Mascotas, especialmente las reglas de negocio y validaciones basicas.

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

## Archivos de tests

```txt
Backend/tests/citaController.test.js
Backend/tests/mascotaController.test.js
```

## Que se prueba

Los tests de Citas cubren casos importantes del controlador:

- rechazar una cita en fecha pasada
- rechazar una cita si el veterinario ya tiene otra cita a esa hora
- crear una cita cuando los datos son validos y no hay conflicto
- devolver `404` al intentar editar una cita que no existe

Los tests de Mascotas cubren casos importantes del controlador:

- rechazar una mascota con fecha de nacimiento futura
- rechazar una mascota con peso negativo
- crear una mascota cuando los datos son validos
- devolver `404` al intentar editar una mascota que no existe

## Uso de mocks

Los repositorios se mockean para no acceder a MariaDB durante los tests unitarios.

Esto permite probar solo la logica del controlador:

```txt
citaController.js
mascotaController.js
```

sin depender de:

```txt
citaRepository.js
mascotaRepository.js
MariaDB
```

## Resumen

La suite es pequena y centrada en lo importante:

- valida reglas de negocio
- prueba casos correctos y casos de error
- evita depender de la base de datos
- queda preparada para ampliarse en futuras issues
