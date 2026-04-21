-- ============================================
-- EMS Pro v2 - Database Migration Script
-- ============================================
-- This script adds v2 enhancement columns to existing tables
-- Run this BEFORE starting the backend with the fixed code

-- ============================================
-- 1. EMPLOYEES TABLE UPDATES
-- ============================================

-- Add soft delete column
ALTER TABLE employees 
ADD COLUMN deleted_at TIMESTAMP NULL COMMENT 'Soft delete timestamp';

-- Add audit trail columns
ALTER TABLE employees 
ADD COLUMN created_by VARCHAR(100) NULL COMMENT 'Username who created this record',
ADD COLUMN updated_by VARCHAR(100) NULL COMMENT 'Username who last updated this record';

-- Add indexes for performance
ALTER TABLE employees 
ADD INDEX idx_deleted_at (deleted_at),
ADD INDEX idx_created_by (created_by),
ADD INDEX idx_updated_by (updated_by);

-- ============================================
-- 2. USERS TABLE UPDATES
-- ============================================

-- Add refresh token support
ALTER TABLE users 
ADD COLUMN refresh_token VARCHAR(500) NULL COMMENT 'JWT refresh token',
ADD COLUMN refresh_token_expiry TIMESTAMP NULL COMMENT 'Refresh token expiration time';

-- Add timestamp columns if not exists
ALTER TABLE users 
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation time',
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update time';

-- Add index for refresh token lookups
ALTER TABLE users 
ADD INDEX idx_refresh_token (refresh_token);

-- ============================================
-- 3. VERIFY EXISTING COLUMNS
-- ============================================
-- Make sure these columns exist in your tables
-- If any are missing, you may need to add them

-- For employees table, verify these exist:
-- - id (VARCHAR(36) or UUID)
-- - emp_code (VARCHAR(20), UNIQUE)
-- - name (VARCHAR(100))
-- - father_name (VARCHAR(100))
-- - date_of_birth (DATE)
-- - email (VARCHAR(150), UNIQUE)
-- - phone (VARCHAR(15))
-- - address (VARCHAR(255))
-- - designation (VARCHAR(100))
-- - department (VARCHAR(100))
-- - salary (DECIMAL(12,2))
-- - education (VARCHAR(50))
-- - aadhar_number (VARCHAR(16))
-- - status (VARCHAR(20))
-- - joining_date (DATE)
-- - created_at (TIMESTAMP)
-- - updated_at (TIMESTAMP)

-- For users table, verify these exist:
-- - id (VARCHAR(36) or UUID)
-- - username (VARCHAR(100), UNIQUE)
-- - password (VARCHAR(255))
-- - full_name (VARCHAR(100))
-- - role (VARCHAR(20))
-- - enabled (BOOLEAN or TINYINT)

-- ============================================
-- 4. DATA CLEANUP (Optional but Recommended)
-- ============================================

-- Set all existing employees as not deleted
UPDATE employees 
SET deleted_at = NULL 
WHERE deleted_at IS NOT NULL;

-- Set default audit values for existing records
UPDATE employees 
SET created_by = 'SYSTEM', 
    updated_by = 'SYSTEM' 
WHERE created_by IS NULL;

-- ============================================
-- 5. VERIFICATION QUERIES
-- ============================================

-- Check employees table structure
DESCRIBE employees;

-- Check users table structure
DESCRIBE users;

-- Verify no employees are soft-deleted
SELECT COUNT(*) as active_count 
FROM employees 
WHERE deleted_at IS NULL;

-- Verify users with refresh token capability
SELECT id, username, refresh_token IS NOT NULL as has_refresh_token 
FROM users;

-- ============================================
-- ROLLBACK SCRIPT (if needed)
-- ============================================
-- Uncomment and run if you need to revert changes

/*
-- Remove v2 columns from employees
ALTER TABLE employees 
DROP COLUMN deleted_at,
DROP COLUMN created_by,
DROP COLUMN updated_by;

-- Remove v2 columns from users
ALTER TABLE users 
DROP COLUMN refresh_token,
DROP COLUMN refresh_token_expiry;

-- Drop indexes
ALTER TABLE employees 
DROP INDEX idx_deleted_at,
DROP INDEX idx_created_by,
DROP INDEX idx_updated_by;

ALTER TABLE users 
DROP INDEX idx_refresh_token;
*/
