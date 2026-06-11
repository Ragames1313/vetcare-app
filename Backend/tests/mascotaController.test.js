jest.mock('../src/repositories/mascotaRepository', () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn()
}));

const mascotaRepository = require('../src/repositories/mascotaRepository');
const mascotaController = require('../src/controllers/mascotaController');

function createResponse() {
  const res = {};

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  return res;
}

function validMascotaBody(overrides = {}) {
  return {
    id_dueno: 1,
    nombre: 'Luna',
    especie: 'Perro',
    raza: 'Labrador',
    fecha_nacimiento: '2020-04-10',
    sexo: 'Hembra',
    peso: 18.5,
    observaciones: 'Paciente tranquila',
    ...overrides
  };
}

function tomorrow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);

  return date.toISOString().slice(0, 10);
}

describe('mascotaController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('rechaza crear una mascota con fecha de nacimiento futura', async () => {
    const req = {
      body: validMascotaBody({ fecha_nacimiento: tomorrow() })
    };
    const res = createResponse();

    await mascotaController.createMascota(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'La fecha de nacimiento no puede ser posterior a la fecha actual.'
    });
    expect(mascotaRepository.create).not.toHaveBeenCalled();
  });

  test('rechaza crear una mascota con peso negativo', async () => {
    const req = {
      body: validMascotaBody({ peso: -3 })
    };
    const res = createResponse();

    await mascotaController.createMascota(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'El peso debe ser un número mayor o igual que 0.'
    });
    expect(mascotaRepository.create).not.toHaveBeenCalled();
  });

  test('crea una mascota cuando los datos son validos', async () => {
    const createdMascota = {
      id_mascota: 1,
      ...validMascotaBody()
    };

    mascotaRepository.create.mockResolvedValue(createdMascota);

    const req = { body: validMascotaBody() };
    const res = createResponse();

    await mascotaController.createMascota(req, res);

    expect(mascotaRepository.create).toHaveBeenCalledWith({
      id_dueno: 1,
      nombre: 'Luna',
      especie: 'Perro',
      raza: 'Labrador',
      fecha_nacimiento: '2020-04-10',
      sexo: 'Hembra',
      peso: 18.5,
      observaciones: 'Paciente tranquila'
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(createdMascota);
  });

  test('devuelve 404 al editar una mascota que no existe', async () => {
    mascotaRepository.update.mockResolvedValue(null);

    const req = {
      params: { id: '99' },
      body: validMascotaBody()
    };
    const res = createResponse();

    await mascotaController.updateMascota(req, res);

    expect(mascotaRepository.update).toHaveBeenCalledWith(99, {
      id_dueno: 1,
      nombre: 'Luna',
      especie: 'Perro',
      raza: 'Labrador',
      fecha_nacimiento: '2020-04-10',
      sexo: 'Hembra',
      peso: 18.5,
      observaciones: 'Paciente tranquila'
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Mascota no encontrada.'
    });
  });
});
