CREATE DATABASE IF NOT EXISTS vetcare;

USE vetcare;

CREATE TABLE IF NOT EXISTS DUENO (
  id_dueno INT AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  apellidos VARCHAR(150) NOT NULL,
  telefono VARCHAR(20),
  email VARCHAR(150),
  direccion VARCHAR(255),
  PRIMARY KEY (id_dueno)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS VETERINARIO (
  id_veterinario INT AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  apellidos VARCHAR(150) NOT NULL,
  especialidad VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  email VARCHAR(150),
  PRIMARY KEY (id_veterinario)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS MASCOTA (
  id_mascota INT AUTO_INCREMENT,
  id_dueno INT NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  especie VARCHAR(80) NOT NULL,
  raza VARCHAR(80),
  fecha_nacimiento DATE,
  sexo VARCHAR(20),
  peso DECIMAL(6,2),
  observaciones TEXT,
  PRIMARY KEY (id_mascota),
  CONSTRAINT fk_mascota_dueno
    FOREIGN KEY (id_dueno)
    REFERENCES DUENO (id_dueno)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS CITA (
  id_cita INT AUTO_INCREMENT,
  id_mascota INT NOT NULL,
  id_veterinario INT NOT NULL,
  fecha_hora DATETIME NOT NULL,
  motivo VARCHAR(255) NOT NULL,
  estado VARCHAR(50) NOT NULL,
  observaciones TEXT,
  PRIMARY KEY (id_cita),
  CONSTRAINT fk_cita_mascota
    FOREIGN KEY (id_mascota)
    REFERENCES MASCOTA (id_mascota)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_cita_veterinario
    FOREIGN KEY (id_veterinario)
    REFERENCES VETERINARIO (id_veterinario)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

INSERT INTO DUENO (nombre, apellidos, telefono, email, direccion) VALUES
('Laura', 'García López', '600123123', 'laura.garcia@mail.com', 'Calle Mayor 12'),
('Carlos', 'Pérez Martín', '611234234', 'carlos.perez@mail.com', 'Avenida Aragón 45'),
('Marta', 'Sánchez Ruiz', '622345345', 'marta.sanchez@mail.com', 'Calle del Sol 8');

INSERT INTO VETERINARIO (nombre, apellidos, especialidad, telefono, email) VALUES
('Ana', 'Martínez Gómez', 'Medicina General', '655111111', 'ana.martinez@vetcare.com'),
('David', 'Fernández Ruiz', 'Cirugía', '655222222', 'david.fernandez@vetcare.com'),
('Lucía', 'Moreno Sánchez', 'Dermatología', '655333333', 'lucia.moreno@vetcare.com');