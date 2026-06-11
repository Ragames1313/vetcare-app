const database = require('../config/database');

const SELECT_CITA = `
  SELECT
    id_cita,
    id_mascota,
    id_veterinario,
    fecha_hora,
    motivo,
    estado,
    observaciones
  FROM CITA
`;

async function findAll() {
  return database.query(`${SELECT_CITA} ORDER BY fecha_hora, id_cita`);
}

async function findById(id) {
  const citas = await database.query(
    `${SELECT_CITA} WHERE id_cita = ?`,
    [id]
  );

  return citas[0] || null;
}

async function findByVeterinarioAndFechaHora(idVeterinario, fechaHora, excludedId = null) {
  const params = [idVeterinario, fechaHora];
  let sql = `${SELECT_CITA} WHERE id_veterinario = ? AND fecha_hora = ?`;

  if (excludedId) {
    sql += ' AND id_cita <> ?';
    params.push(excludedId);
  }

  const citas = await database.query(`${sql} LIMIT 1`, params);

  return citas[0] || null;
}

async function create(cita) {
  const result = await database.query(
    `INSERT INTO CITA
      (id_mascota, id_veterinario, fecha_hora, motivo, estado, observaciones)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      cita.id_mascota,
      cita.id_veterinario,
      cita.fecha_hora,
      cita.motivo,
      cita.estado,
      cita.observaciones
    ]
  );

  return findById(Number(result.insertId));
}

async function update(id, cita) {
  const result = await database.query(
    `UPDATE CITA
     SET id_mascota = ?,
         id_veterinario = ?,
         fecha_hora = ?,
         motivo = ?,
         estado = ?,
         observaciones = ?
     WHERE id_cita = ?`,
    [
      cita.id_mascota,
      cita.id_veterinario,
      cita.fecha_hora,
      cita.motivo,
      cita.estado,
      cita.observaciones,
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
    'DELETE FROM CITA WHERE id_cita = ?',
    [id]
  );

  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  findByVeterinarioAndFechaHora,
  create,
  update,
  remove
};
