const citaRepository = require('../repositories/citaRepository');

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

function normalizeDateTime(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    return null;
  }

  const normalized = value.trim().replace('T', ' ');
  const dateTimePattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/;

  if (!dateTimePattern.test(normalized)) {
    return null;
  }

  const dateTime = normalized.length === 16 ? `${normalized}:00` : normalized;
  const [datePart, timePart] = dateTime.split(' ');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute, second] = timePart.split(':').map(Number);
  const date = new Date(year, month - 1, day, hour, minute, second);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day ||
    date.getHours() !== hour ||
    date.getMinutes() !== minute ||
    date.getSeconds() !== second
  ) {
    return null;
  }

  return dateTime;
}

function validateCita(body) {
  const idMascota = parseId(body.id_mascota);

  if (!idMascota) {
    return { error: 'El campo id_mascota debe ser un identificador válido.' };
  }

  const idVeterinario = parseId(body.id_veterinario);

  if (!idVeterinario) {
    return { error: 'El campo id_veterinario debe ser un identificador válido.' };
  }

  const fechaHora = normalizeDateTime(body.fecha_hora);

  if (!fechaHora) {
    return { error: 'El campo fecha_hora debe tener formato YYYY-MM-DD HH:mm:ss.' };
  }

  const motivoError = validateRequiredText(body.motivo, 'motivo');
  if (motivoError) {
    return { error: motivoError };
  }

  const estadoError = validateRequiredText(body.estado, 'estado');
  if (estadoError) {
    return { error: estadoError };
  }

  return {
    cita: {
      id_mascota: idMascota,
      id_veterinario: idVeterinario,
      fecha_hora: fechaHora,
      motivo: body.motivo.trim(),
      estado: body.estado.trim(),
      observaciones: optionalText(body.observaciones)
    }
  };
}

function handleDatabaseError(error, res) {
  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      error: 'La mascota o el veterinario indicado no existe.'
    });
  }

  console.error(error);
  return res.status(500).json({ error: 'Error interno del servidor.' });
}

async function getAllCitas(req, res) {
  try {
    const citas = await citaRepository.findAll();
    return res.json(citas);
  } catch (error) {
    return handleDatabaseError(error, res);
  }
}

async function getCitaById(req, res) {
  const id = parseId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: 'El identificador no es válido.' });
  }

  try {
    const cita = await citaRepository.findById(id);

    if (!cita) {
      return res.status(404).json({ error: 'Cita no encontrada.' });
    }

    return res.json(cita);
  } catch (error) {
    return handleDatabaseError(error, res);
  }
}

async function createCita(req, res) {
  const validation = validateCita(req.body);

  if (validation.error) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    const cita = await citaRepository.create(validation.cita);
    return res.status(201).json(cita);
  } catch (error) {
    return handleDatabaseError(error, res);
  }
}

async function updateCita(req, res) {
  const id = parseId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: 'El identificador no es válido.' });
  }

  const validation = validateCita(req.body);

  if (validation.error) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    const cita = await citaRepository.update(id, validation.cita);

    if (!cita) {
      return res.status(404).json({ error: 'Cita no encontrada.' });
    }

    return res.json(cita);
  } catch (error) {
    return handleDatabaseError(error, res);
  }
}

async function deleteCita(req, res) {
  const id = parseId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: 'El identificador no es válido.' });
  }

  try {
    const deleted = await citaRepository.remove(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Cita no encontrada.' });
    }

    return res.json({ message: 'Cita eliminada correctamente.' });
  } catch (error) {
    return handleDatabaseError(error, res);
  }
}

module.exports = {
  getAllCitas,
  getCitaById,
  createCita,
  updateCita,
  deleteCita
};
