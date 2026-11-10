create database sistema_obras CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci;

use sistema_obras;

create table numeros_patronales( 
   Id int primary key not null auto_increment, 
   numero_patronal varchar(100) not null
   )CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci;

create table obras(
   Id int primary key not null auto_increment,
   nombre_obra varchar(100) not null,
   fecha_inicio date not null,
   fecha_cierre date,
   num_trabajadores int not null,
   monto decimal(10,2) not null,
   patronal_id int not null,
   foreign key(patronal_id) references numeros_patronales(Id)
   )CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci;

create table proveedores(
   Id int primary key not null auto_increment,
   Nombre_P varchar(100) not null,
   rfc varchar(13) not null unique
   )CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci;


create table usuarios( 
   Id int primary key not null auto_increment,
   email varchar(100) not null,
   passwordHash varchar(255) not null,
   nombre varchar(100) not null, 
   apellido varchar(100) not null,
   rol varchar(100) not null
   ) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci;

create table tipos_iva(
   Id int primary key not null auto_increment,
   porcentaje decimal(5,2) not null
   ) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci;

create table tipos_pago(
   Id int primary key not null auto_increment,
   metodoPago varchar(100) not null
) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci;

create table facturas(
   Id int primary key not null auto_increment,
   fechaEmision date not null,
   folioFiscal varchar(100) not null unique,
   descripcion text not null,
   importe decimal(10,2) not null,
   montoIva decimal(10,2) not null,
   total decimal(10,2) not null,
   tipoIvaId int not null,
   activo TINYINT(1) NOT NULL DEFAULT 1,
   ProveedorId int not null,
   ObraId int not null,
   tipoPagoId int not null,

   foreign key (ObraId) references obras(id),
   foreign key (ProveedorId) references proveedores(Id),
   foreign key (tipoPagoId) references tipos_pago(Id),
   foreign key (tipoIvaId) references tipos_iva(Id)
)CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci;

CREATE TABLE cotizaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion TEXT NOT NULL,
    importe DECIMAL(10,2) NOT NULL,
    obraId INT NOT NULL,
    proveedorId INT NOT NULL,
    facturaId INT NULL, -- NULL mientras no tenga factura
    FOREIGN KEY (obraId) REFERENCES obras(id),
    FOREIGN KEY (proveedorId) REFERENCES proveedores(id),
    FOREIGN KEY (facturaId) REFERENCES facturas(id)
)CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci;

create table archivos_facturas(
   Id int primary key not null auto_increment,
   nombreArchivo varchar(255) not null,
   rutaArchivo varchar(500) not null,
   tipoArchivo varchar(10) not null,
   facturaId int not null,

   foreign key (facturaId) references facturas(Id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci;


