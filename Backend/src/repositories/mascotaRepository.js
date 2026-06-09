const database = require('../config/database');

const SELECT_MASCOTA = `
  SELECT
    id_mascota,
    id_dueno,
    nombre,
    especie,
    raza,
    fecha_nacimiento,
    sexo,
    peso,
    observaciones
  FROM MASCOTA
`;

async function findAll() {
  return database.query(`${SELECT_MASCOTA} ORDER BY id_mascota`);
}

async function findById(id) {
  const mascotas = await database.query(
    `${SELECT_MASCOTA} WHERE id_mascota = ?`,
    [id]
  );

  return mascotas[0] || null;
}

async function create(mascota) {
  const result = await database.query(
    `INSERT INTO MASCOTA
      (id_dueno, nombre, especie, raza, fecha_nacimiento, sexo, peso, observaciones)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      mascota.id_dueno,
      mascota.nombre,
      mascota.especie,
      mascota.raza,
      mascota.fecha_nacimiento,
      mascota.sexo,
      mascota.peso,
      mascota.observaciones
    ]
  );

  return findById(Number(result.insertId));
}

async function update(id, mascota) {
  const result = await database.query(
    `UPDATE MASCOTA
     SET id_dueno = ?,
         nombre = ?,
         especie = ?,
         raza = ?,
         fecha_nacimiento = ?,
         sexo = ?,
         peso = ?,
         observaciones = ?
     WHERE id_mascota = ?`,
    [
      mascota.id_dueno,
      mascota.nombre,
      mascota.especie,
      mascota.raza,
      mascota.fecha_nacimiento,
      mascota.sexo,
      mascota.peso,
      mascota.observaciones,
      id
    ]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return findById(id);
}

async function remove(id) {
  const result = await database.query(
    'DELETE FROM MASCOTA WHERE id_mascota = ?',
    [id]
  );

  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};
