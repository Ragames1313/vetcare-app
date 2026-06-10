jest.mock('../src/repositories/citaRepository', () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  findByVeterinarioAndFechaHora: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn()
}));

const citaRepository = require('../src/repositories/citaRepository');
const citaController = require('../src/controllers/citaController');

function createResponse() {
  const res = {};

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  return res;
}

function validCitaBody(overrides = {}) {
  return {
    id_mascota: 1,
    id_veterinario: 2,
    fecha_hora: '2999-06-15 10:30:00',
    motivo: 'Revision general',
    estado: 'Pendiente',
    observaciones: 'Primera visita',
    ...overrides
  };
}

describe('citaController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('rechaza crear una cita en una fecha pasada', async () => {
    const req = {
      body: validCitaBody({ fecha_hora: '2000-01-01 10:30:00' })
    };
    const res = createResponse();

    await citaController.createCita(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      error: 'No se puede crear o modificar una cita en una fecha pasada.'
    });
    expect(citaRepository.create).not.toHaveBeenCalled();
  });

  test('rechaza crear una cita si el veterinario ya tiene cita a esa hora', async () => {
    citaRepository.findByVeterinarioAndFechaHora.mockResolvedValue({
      id_cita: 7
    });

    const req = { body: validCitaBody() };
    const res = createResponse();

    await citaController.createCita(req, res);

    expect(citaRepository.findByVeterinarioAndFechaHora).toHaveBeenCalledWith(
      2,
      '2999-06-15 10:30:00',
      null
    );
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      error: 'El veterinario ya tiene una cita asignada en esa fecha y hora.'
    });
    expect(citaRepository.create).not.toHaveBeenCalled();
  });

  test('crea una cita cuando los datos son validos y no hay conflicto', async () => {
    const createdCita = {
      id_cita: 1,
      ...validCitaBody()
    };

    citaRepository.findByVeterinarioAndFechaHora.mockResolvedValue(null);
    citaRepository.create.mockResolvedValue(createdCita);

    const req = { body: validCitaBody() };
    const res = createResponse();

    await citaController.createCita(req, res);

    expect(citaRepository.create).toHaveBeenCalledWith({
      id_mascota: 1,
      id_veterinario: 2,
      fecha_hora: '2999-06-15 10:30:00',
      motivo: 'Revision general',
      estado: 'Pendiente',
      observaciones: 'Primera visita'
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(createdCita);
  });

  test('devuelve 404 al editar una cita que no existe', async () => {
    citaRepository.findById.mockResolvedValue(null);

    const req = {
      params: { id: '99' },
      body: validCitaBody()
    };
    const res = createResponse();

    await citaController.updateCita(req, res);

    expect(citaRepository.findById).toHaveBeenCalledWith(99);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Cita no encontrada.'
    });
    expect(citaRepository.update).not.toHaveBeenCalled();
  });
});
