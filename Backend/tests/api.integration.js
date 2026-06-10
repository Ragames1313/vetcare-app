const assert = require('assert');
const request = require('supertest');
const app = require('../src/app');
const database = require('../src/config/database');

let duenoId;
let veterinarioId;

async function createBaseData() {
  const dueno = await database.query(
    `INSERT INTO DUENO (nombre, apellidos, telefono, email, direccion)
     VALUES (?, ?, ?, ?, ?)`,
    ['Ana', 'Lopez', '600111222', 'ana@example.com', 'Calle Mayor 1']
  );

  const veterinario = await database.query(
    `INSERT INTO VETERINARIO (nombre, apellidos, especialidad, telefono, email)
     VALUES (?, ?, ?, ?, ?)`,
    ['Carlos', 'Garcia', 'Medicina general', '600333444', 'carlos@example.com']
  );

  duenoId = Number(dueno.insertId);
  veterinarioId = Number(veterinario.insertId);
}

async function cleanDatabase() {
  await database.query('DELETE FROM CITA');
  await database.query('DELETE FROM MASCOTA');
  await database.query('DELETE FROM VETERINARIO');
  await database.query('DELETE FROM DUENO');
}

async function testMascotaCrud() {
  const createResponse = await request(app)
    .post('/api/mascotas')
    .send({
      id_dueno: duenoId,
      nombre: 'Luna',
      especie: 'Perro',
      raza: 'Labrador',
      fecha_nacimiento: '2021-04-10',
      sexo: 'Hembra',
      peso: 24.5,
      observaciones: 'Sin observaciones'
    });

  assert.strictEqual(createResponse.status, 201);
  assert.ok(createResponse.body.id_mascota);
  assert.strictEqual(createResponse.body.nombre, 'Luna');

  const mascotaId = createResponse.body.id_mascota;
  const detailResponse = await request(app).get(`/api/mascotas/${mascotaId}`);

  assert.strictEqual(detailResponse.status, 200);
  assert.strictEqual(detailResponse.body.id_mascota, mascotaId);

  const updateResponse = await request(app)
    .put(`/api/mascotas/${mascotaId}`)
    .send({
      id_dueno: duenoId,
      nombre: 'Luna',
      especie: 'Perro',
      raza: 'Labrador',
      fecha_nacimiento: '2021-04-10',
      sexo: 'Hembra',
      peso: 25,
      observaciones: 'Peso actualizado'
    });

  assert.strictEqual(updateResponse.status, 200);
  assert.strictEqual(Number(updateResponse.body.peso), 25);
  assert.strictEqual(updateResponse.body.observaciones, 'Peso actualizado');

  const deleteResponse = await request(app).delete(`/api/mascotas/${mascotaId}`);

  assert.strictEqual(deleteResponse.status, 200);
  assert.strictEqual(deleteResponse.body.message, 'Mascota eliminada correctamente.');
}

async function testCitaCrud() {
  const mascotaResponse = await request(app)
    .post('/api/mascotas')
    .send({
      id_dueno: duenoId,
      nombre: 'Milo',
      especie: 'Gato',
      raza: 'Comun',
      fecha_nacimiento: '2022-02-02',
      sexo: 'Macho',
      peso: 5,
      observaciones: null
    });

  assert.strictEqual(mascotaResponse.status, 201);

  const citaResponse = await request(app)
    .post('/api/citas')
    .send({
      id_mascota: mascotaResponse.body.id_mascota,
      id_veterinario: veterinarioId,
      fecha_hora: '2999-06-15 10:30:00',
      motivo: 'Revision general',
      estado: 'Pendiente',
      observaciones: 'Primera visita'
    });

  assert.strictEqual(citaResponse.status, 201);
  assert.ok(citaResponse.body.id_cita);
  assert.strictEqual(citaResponse.body.id_mascota, mascotaResponse.body.id_mascota);
  assert.strictEqual(citaResponse.body.id_veterinario, veterinarioId);

  const listResponse = await request(app).get('/api/citas');

  assert.strictEqual(listResponse.status, 200);
  assert.ok(Array.isArray(listResponse.body));
  assert.ok(listResponse.body.length >= 1);
}

async function testVeterinarioDuplicado() {
  const mascotaResponse = await request(app)
    .post('/api/mascotas')
    .send({
      id_dueno: duenoId,
      nombre: 'Nala',
      especie: 'Gato',
      raza: 'Comun',
      fecha_nacimiento: '2023-01-01',
      sexo: 'Hembra',
      peso: 4,
      observaciones: null
    });

  assert.strictEqual(mascotaResponse.status, 201);

  const cita = {
    id_mascota: mascotaResponse.body.id_mascota,
    id_veterinario: veterinarioId,
    fecha_hora: '2999-06-16 11:00:00',
    motivo: 'Vacunacion',
    estado: 'Pendiente',
    observaciones: null
  };

  const firstResponse = await request(app).post('/api/citas').send(cita);
  assert.strictEqual(firstResponse.status, 201);

  const secondResponse = await request(app).post('/api/citas').send(cita);

  assert.strictEqual(secondResponse.status, 409);
  assert.strictEqual(
    secondResponse.body.error,
    'El veterinario ya tiene una cita asignada en esa fecha y hora.'
  );
}

async function run() {
  try {
    await cleanDatabase();
    await createBaseData();
    await testMascotaCrud();
    await testCitaCrud();
    await testVeterinarioDuplicado();
    console.log('Tests de integracion completados correctamente.');
  } finally {
    await cleanDatabase();
    await database.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
