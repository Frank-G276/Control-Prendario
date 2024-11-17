-- Tabla de Clientes
CREATE TABLE clientes (
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    tipo_documento ENUM('DNI', 'PASAPORTE', 'CEDULA'),
    numero_documento VARCHAR(20) UNIQUE,
    nombres VARCHAR(100),
    apellidos VARCHAR(100),
    fecha_nacimiento DATE,
    direccion VARCHAR(200),
    ciudad VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(100),
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_documento UNIQUE (tipo_documento, numero_documento)
);

-- Tabla de Vehículos
CREATE TABLE vehiculos (
    id_vehiculo INT PRIMARY KEY AUTO_INCREMENT,
    tipo_vehiculo ENUM('AUTOMOVIL', 'CAMIONETA', 'MOTOCICLETA', 'CAMION'),
    marca VARCHAR(50),
    linea VARCHAR(50),
    modelo DATE,
    placa VARCHAR(20) UNIQUE,
    cilindraje INT,
    color VARCHAR(30),
    numero_motor VARCHAR(50),
    numero_chasis VARCHAR(50),
    sitio_matricula VARCHAR(50),
    fecha_matricula DATE,
    propietario VARCHAR(50),
    numero_documento_propietario VARCHAR(50),
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Préstamos/Empeños
CREATE TABLE prestamos (
    id_prestamo INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT,
    id_vehiculo INT,
    fecha_prestamo DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_vencimiento DATE,
    monto_prestamo DECIMAL(12,2),
    tasa_interes DECIMAL(5,2),
    estado_prestamo ENUM('ACTIVO', 'VENCIDO', 'PAGADO', 'REFINANCIADO'),
    observaciones TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_vehiculo) REFERENCES vehiculos(id_vehiculo)
);

-- Tabla de Pagos
CREATE TABLE pagos (
    id_pago INT PRIMARY KEY AUTO_INCREMENT,
    id_prestamo INT,
    fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
    monto_pagado DECIMAL(12,2),
    tipo_pago ENUM('CAPITAL', 'INTERES', 'MORA'),
    metodo_pago ENUM('EFECTIVO', 'TRANSFERENCIA', 'TARJETA'),
    observaciones TEXT,
    FOREIGN KEY (id_prestamo) REFERENCES prestamos(id_prestamo)
);

CREATE TABLE movimientos (
    id_movimiento INT PRIMARY KEY AUTO_INCREMENT,
    fecha_movimiento DATETIME DEFAULT CURRENT_TIMESTAMP,
    tipo_movimiento ENUM('ENTRADA', 'SALIDA') NOT NULL,
    monto DECIMAL(12,2) NOT NULL
);

-- Tabla de Documentos Adjuntos
-- Tabla modificada para guardar PDFs en MySQL
CREATE TABLE documentos_prestamos (
    id_documento INT PRIMARY KEY AUTO_INCREMENT,
    id_prestamo INT,
    nombre_archivo VARCHAR(255),
    contenido_pdf MEDIUMBLOB, -- Para archivos hasta 16MB
    mime_type VARCHAR(100),
    tamano_archivo INT,
    fecha_subida DATETIME DEFAULT CURRENT_TIMESTAMP,
    usuario_subida VARCHAR(100),
    hash_archivo VARCHAR(255), -- Para verificar integridad
    FOREIGN KEY (id_prestamo) REFERENCES prestamos(id_prestamo)
);
CREATE TABLE documentos_pagos (
    id_documento INT PRIMARY KEY AUTO_INCREMENT,
    id_pago INT,
    nombre_archivo VARCHAR(255),
    contenido_pdf MEDIUMBLOB, -- Para archivos hasta 16MB
    mime_type VARCHAR(100),
    tamano_archivo INT,
    fecha_subida DATETIME DEFAULT CURRENT_TIMESTAMP,
    usuario_subida VARCHAR(100),
    hash_archivo VARCHAR(255), -- Para verificar integridad
    FOREIGN KEY (id_pago) REFERENCES prestamos(id_pago)
);

-- Índices para optimizar búsquedas
CREATE INDEX idx_documento_prestamo ON documentos(id_prestamo);
CREATE INDEX idx_documento_tipo ON documentos(tipo_documento);

-- Índices para optimizar búsquedas comunes
CREATE INDEX idx_cliente_documento ON clientes(tipo_documento, numero_documento);
CREATE INDEX idx_vehiculo_placa ON vehiculos(placa);
CREATE INDEX idx_prestamo_fechas ON prestamos(fecha_prestamo, fecha_vencimiento);
CREATE INDEX idx_prestamo_estado ON prestamos(estado_prestamo);
CREATE INDEX idx_pagos_fecha ON pagos(fecha_pago);

/*
table clientes{
  id_cliente integer [primary key, increment]
  tipo_documento enum 
  numero_documento varchar [unique]
  nombres varchar 
  apellidos varchar 
  fecha_nacimiento date
  direccion varchar
  ciudad varchar
  telefono varchar
  email varchar
  fecha_registro datetime 
}

Table vehículos{
  id_vehículo integer [primary key, increment]
  tipo_vehículo enum 
  marca varchar
  linea varchar
  modelo date
  placa varchar [unique]
  cilindraje integer
  color varchar
  numero_motor varchar
  numero_chasis varchar
  sitio_matricula varchar
  fecha_matricula date
  propietario varchar
  numero_documento_propietario varchar
  fecha_registro datetime
}

Table prestamos{
  id_prestamo integer [primary key, increment]
  id_cliente integer [ref: > clientes.id_cliente]
  id_vehículo integer [ref: > vehículos.id_vehículo]
  fecha_prestamos datetime
  fecha_vencimiento date
  monto_prestamo decimal
  tasa_interes decimal
  estado_prestamo enum
  observaciones text
  created_at datetime
  update_at datetime

}

Table pagos{
  id_pago integer [pk]
  id_prestamo integer [ref: > prestamos.id_prestamo]
  fecha_pago datetime
  monto_pagado decimal
  tipo_pago enum
  metodo_pago enum
  observaciones text
}
Table documentos_prestamos {
  id_documento integer [pk, increment]
  id_prestamos integer [ref: - prestamos.id_prestamo]
  nombre_archivo varchar
  contenido_pdf mediumblob
  mime_type varchar
  tamaño_archivo integer
  fecha_subida datetime
  usuarios_subida varchar
  hash_archivo varchar
}
Table documentos_pagos {
  id_documento integer [pk, increment]
  id_pago integer [ref: - pagos.id_pago]
  nombre_archivo varchar
  contenido_pdf mediumblob
  mime_type varchar
  tamaño_archivo integer
  fecha_subida datetime
  usuarios_subida varchar
  hash_archivo varchar
}
*/