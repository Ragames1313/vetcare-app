DROP DATABASE IF EXISTS vetcare;

CREATE DATABASE vetcare;

USE vetcare;

CREATE TABLE DUENO (
  id_dueno INT AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  apellidos VARCHAR(150) NOT NULL,
  telefono VARCHAR(20),
  email VARCHAR(150),
  direccion VARCHAR(255),
  PRIMARY KEY (id_dueno)
) ENGINE=InnoDB;

CREATE TABLE VETERINARIO (
  id_veterinario INT AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  apellidos VARCHAR(150) NOT NULL,
  especialidad VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  email VARCHAR(150),
  PRIMARY KEY (id_veterinario)
) ENGINE=InnoDB;

CREATE TABLE MASCOTA (
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

CREATE TABLE CITA (
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
