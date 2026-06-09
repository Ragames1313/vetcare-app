const mascotaRepository = require('../repositories/mascotaRepository');

function parseId(value) {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

function optionalText(value) {
  if (value === undefined || value === null) {
    return null;
  }

  const text = String(value).trim();

  return text === '' ? null : text;
}

function validateRequiredText(value, fieldName) {
  if (typeof value !== 'string' || value.trim() === '') {
    return `El campo ${fieldName} es obligatorio.`;
  }

  return null;
}

function validateDate(value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return 'La fecha de nacimiento debe tener formato YYYY-MM-DD.';
  }

  return null;
}

function validateWeight(value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const peso = Number(value);

  if (Number.isNaN(peso) || peso < 0) {
    return 'El peso debe ser un número mayor o igual que 0.';
  }

  return null;
}

function validateMascota(body) {
  const idDueno = parseId(body.id_dueno);

  if (!idDueno) {
    return { error: 'El campo id_dueno debe ser un identificador válido.' };
  }

  const requiredNameError = validateRequiredText(body.nombre, 'nombre');
  if (requiredNameError) {
    return { error: requiredNameError };
  }

  const requiredSpeciesError = validateRequiredText(body.especie, 'especie');
  if (requiredSpeciesError) {
    return { error: requiredSpeciesError };
  }

  const dateError = validateDate(body.fecha_nacimiento);
  if (dateError) {
    return { error: dateError };
  }

  const weightError = validateWeight(body.peso);
  if (weightError) {
    return { error: weightError };
  }

  return {
    mascota: {
      id_dueno: idDueno,
      nombre: body.nombre.trim(),
      especie: body.especie.trim(),
      raza: optionalText(body.raza),
      fecha_nacimiento: body.fecha_nacimiento || null,
      sexo: optionalText(body.sexo),
      peso: body.peso === undefined || body.peso === null || body.peso === ''
        ? null
        : Number(body.peso),
      observaciones: optionalText(body.observaciones)
    }
  };
}

function handleDatabaseError(error, res) {
  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({ error: 'El dueño indicado no existe.' });
  }

  if (error.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(409).json({
      error: 'No se puede eliminar la mascota porque tiene citas asociadas.'
    });
  }

  console.error(error);
  return res.status(500).json({ error: 'Error interno del servidor.' });
}

async function getAllMascotas(req, res) {
  try {
    const mascotas = await mascotaRepository.findAll();
    res.json(mascotas);
  } catch (error) {
    handleDatabaseError(error, res);
  }
}

async function getMascotaById(req, res) {
  const id = parseId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: 'El identificador no es válido.' });
  }

  try {
    const mascota = await mascotaRepository.findById(id);

    if (!mascota) {
      return res.status(404).json({ error: 'Mascota no encontrada.' });
    }

    return res.json(mascota);
  } catch (error) {
    return handleDatabaseError(error, res);
  }
}

async function createMascota(req, res) {
  const validation = validateMascota(req.body);

  if (validation.error) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    const mascota = await mascotaRepository.create(validation.mascota);
    return res.status(201).json(mascota);
  } catch (error) {
    return handleDatabaseError(error, res);
  }
}

async function updateMascota(req, res) {
  const id = parseId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: 'El identificador no es válido.' });
  }

  const validation = validateMascota(req.body);

  if (validation.error) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    const mascota = await mascotaRepository.update(id, validation.mascota);

    if (!mascota) {
      return res.status(404).json({ error: 'Mascota no encontrada.' });
    }

    return res.json(mascota);
  } catch (error) {
    return handleDatabaseError(error, res);
  }
}

async function deleteMascota(req, res) {
  const id = parseId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: 'El identificador no es válido.' });
  }

  try {
    const deleted = await mascotaRepository.remove(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Mascota no encontrada.' });
    }

    return res.json({ message: 'Mascota eliminada correctamente.' });
  } catch (error) {
    return handleDatabaseError(error, res);
  }
}

module.exports = {
  getAllMascotas,
  getMascotaById,
  createMascota,
  updateMascota,
  deleteMascota
};
