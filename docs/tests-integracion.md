# Tests de integracion del backend

## Objetivo

Los tests de integracion comprueban que la API de VetCare funciona de extremo a extremo usando la base de datos MariaDB.

A diferencia de los tests unitarios, aqui no se mockea el repositorio. Las peticiones pasan por Express, llegan a los controladores, ejecutan consultas reales y devuelven respuestas HTTP completas.

## Herramientas usadas

Se usa `Supertest` para lanzar peticiones HTTP contra la aplicacion Express sin arrancar manualmente el servidor.

El test usa tambien la conexion real definida en:

```txt
Backend/src/config/database.js
```

## Comando

Debe ejecutarse desde la carpeta `Backend`:

```bash
npm run test:integration
```

## Requisito previo

Estos tests necesitan que MariaDB este arrancado y que el archivo `.env` tenga credenciales validas.

Ejemplo:

```txt
DB_HOST=localhost
DB_PORT=3306
DB_USER=usuario_valido
DB_PASSWORD=password_valido
DB_NAME=vetcare
```

Tambien es necesario que la base de datos `vetcare` y sus tablas existan.

## Archivo de test

```txt
Backend/tests/api.integration.js
```

## Que se prueba

La suite cubre flujos principales sin complicar el proyecto:

- crear, consultar, editar y eliminar una mascota
- crear y listar una cita asociada a mascota y veterinario
- comprobar que no se permite duplicar una cita de un veterinario a la misma hora

## Datos de prueba

Antes de ejecutar los casos, el test crea datos minimos:

- un dueno
- un veterinario

Despues usa esos registros para crear mascotas y citas.

Al finalizar, limpia las tablas usadas:

```txt
CITA
MASCOTA
VETERINARIO
DUENO
```

## Resumen

Estos tests verifican la integracion real entre:

```txt
API REST
Controladores
Repositorios
MariaDB
```

Son pruebas sencillas, centradas en los endpoints principales y preparadas para ampliarse en futuras issues.
