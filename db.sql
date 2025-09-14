-- Team Tayta Database Schema and Initial Data
-- Database: db_team_tayta

-- =============================================
-- CREAR BASE DE DATOS
-- =============================================
CREATE DATABASE IF NOT EXISTS db_team_tayta;
USE db_team_tayta;

-- =============================================
-- TABLA ROLES
-- =============================================
CREATE TABLE IF NOT EXISTS roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- TABLA USUARIOS
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    roleId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (roleId) REFERENCES roles(id)
);

-- =============================================
-- DATOS INICIALES - ROLES
-- =============================================
INSERT INTO roles (name, description) VALUES
('admin', 'Administrador del sistema con acceso completo'),
('user', 'Usuario del equipo con acceso limitado');

-- =============================================
-- DATOS INICIALES - USUARIO ADMINISTRADOR
-- =============================================
-- Password: admin123 (hasheada con bcrypt)
INSERT INTO users (firstName, lastName, email, password, roleId, isActive) VALUES
('Administrador', 'Team Tayta', 'admin@teamtayta.com', '$2a$10$CwTycUXWue0Thq9StjUM0.qBn7OqzQNqf1OqzOKjOLgw4OqzONqf1O', 1, TRUE);

-- =============================================
-- CONSULTAS ÚTILES
-- =============================================

-- Ver todos los roles
SELECT * FROM roles;

-- Ver todos los usuarios con sus roles
SELECT
    u.id,
    u.firstName,
    u.lastName,
    u.email,
    r.name as role,
    u.isActive,
    u.createdAt
FROM users u
JOIN roles r ON u.roleId = r.id;

-- Ver solo administradores
SELECT
    u.firstName,
    u.lastName,
    u.email,
    u.createdAt
FROM users u
JOIN roles r ON u.roleId = r.id
WHERE r.name = 'admin';

-- Ver solo usuarios normales
SELECT
    u.firstName,
    u.lastName,
    u.email,
    u.createdAt
FROM users u
JOIN roles r ON u.roleId = r.id
WHERE r.name = 'user';

-- =============================================
-- CREDENCIALES DE ACCESO
-- =============================================
/*
ADMINISTRADOR POR DEFECTO:
📧 Email: admin@teamtayta.com
🔐 Password: admin123
👑 Rol: Administrador

PARA CREAR MÁS USUARIOS:
- Usar el formulario de registro en /register
- O insertar directamente en la base de datos (recuerda hashear la password)
*/