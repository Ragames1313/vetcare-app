# Integracion Continua

## Objetivo

El proyecto incluye un workflow sencillo de GitHub Actions para demostrar Integracion Continua durante la recuperacion.

La configuracion se mantiene basica y facil de explicar. No usa Docker ni anade herramientas complejas.

## Archivo creado

```txt
.github/workflows/ci.yml
```

## Cuando se ejecuta

El workflow se ejecuta en:

```txt
push
pull_request
```

Esto permite comprobar automaticamente el proyecto cuando se suben cambios o se abre una Pull Request.

## Que comprueba

El workflow realiza estos pasos:

1. Descarga el repositorio.
2. Prepara Node.js.
3. Instala las dependencias del backend con `npm ci`.
4. Instala y arranca MariaDB en el runner.
5. Crea un usuario de base de datos para CI.
6. Carga el esquema con `Backend/DB/reset.sql`.
7. Ejecuta los tests unitarios con `npm test`.
8. Ejecuta los tests de integracion con `npm run test:integration`.
9. Comprueba la sintaxis de archivos JavaScript principales con `node --check`.

## Base de datos en CI

Los tests de integracion necesitan una base de datos MariaDB real.

Para resolverlo de forma sencilla, el workflow instala MariaDB en el runner de GitHub Actions y crea un usuario especifico:

```txt
DB_USER=vetcare_ci
DB_PASSWORD=vetcare_ci
DB_NAME=vetcare
```

Despues carga el script:

```txt
Backend/DB/reset.sql
```

Asi los tests de integracion pueden usar una base limpia en cada ejecucion.

En local tambien se pueden ejecutar:

```bash
cd Backend
npm run test:integration
```

## Resumen

Este CI comprueba lo imprescindible:

- las dependencias se instalan correctamente
- los tests unitarios pasan
- los tests de integracion pasan con MariaDB
- los archivos JavaScript principales no tienen errores de sintaxis

Es una configuracion suficiente para demostrar Integracion Continua sin complicar el proyecto.
