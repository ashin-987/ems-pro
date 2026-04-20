-- ============================================================
--  Employee Management System — Database Schema
--  Run this script ONCE to create the database.
--  Hibernate will auto-create/update the tables on startup.
-- ============================================================

CREATE DATABASE IF NOT EXISTS ems_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ems_db;

-- ── Users (managed by Spring Security + BCrypt) ─────────────
CREATE TABLE IF NOT EXISTS users (
  id          VARCHAR(36)  NOT NULL,
  username    VARCHAR(100) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,          -- BCrypt hash, NEVER plain text
  full_name   VARCHAR(100) NOT NULL,
  role        ENUM('ADMIN','HR','MANAGER','VIEWER') NOT NULL DEFAULT 'VIEWER',
  enabled     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Employees ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS employees (
  id             VARCHAR(36)    NOT NULL,
  emp_code       VARCHAR(20)    NOT NULL UNIQUE,
  name           VARCHAR(100)   NOT NULL,
  father_name    VARCHAR(100),
  date_of_birth  DATE,
  email          VARCHAR(150)   NOT NULL UNIQUE,
  phone          VARCHAR(15),
  address        VARCHAR(255),
  designation    VARCHAR(100)   NOT NULL,
  department     VARCHAR(100),
  salary         DECIMAL(12,2),
  education      VARCHAR(50),
  aadhar_number  VARCHAR(16),
  status         ENUM('ACTIVE','INACTIVE','ON_LEAVE') NOT NULL DEFAULT 'ACTIVE',
  joining_date   DATE,
  created_at     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_emp_status     (status),
  INDEX idx_emp_department (department),
  INDEX idx_emp_email      (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Sample departments reference (optional) ─────────────────
-- The DataInitializer bean creates the default admin user automatically.
-- Default credentials: admin / Admin@123  ← CHANGE ON FIRST LOGIN
