package com.ems.service;

import com.ems.dto.request.EmployeeRequest;
import com.ems.dto.response.EmployeeResponse;
import com.ems.entity.Employee;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    /**
     * Create new employee (original method signature)
     */
    @Transactional
    public EmployeeResponse create(EmployeeRequest req) {
        if (employeeRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Employee with email '" + req.getEmail() + "' already exists");
        }
        Employee emp = mapToEntity(new Employee(), req);
        emp.setEmpCode(generateEmpCode());
        return EmployeeResponse.fromEntity(employeeRepository.save(emp));
    }

    /**
     * Get employee by ID (original method signature with soft delete check)
     */
    @Transactional(readOnly = true)
    public EmployeeResponse getById(String id) {
        return EmployeeResponse.fromEntity(findById(id));
    }

    /**
     * Search employees with filters (original method signature with soft delete)
     */
    @Transactional(readOnly = true)
    public Page<EmployeeResponse> search(String search, String status, String department,
                                          int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Employee.EmployeeStatus statusEnum = null;
        if (status != null && !status.isBlank()) {
            statusEnum = Employee.EmployeeStatus.valueOf(status.toUpperCase());
        }

        return employeeRepository
                .searchEmployees(search, statusEnum, department, pageable)
                .map(EmployeeResponse::fromEntity);
    }

    /**
     * Update existing employee (original method signature)
     */
    @Transactional
    public EmployeeResponse update(String id, EmployeeRequest req) {
        Employee emp = findById(id);

        // Allow email update only if not taken by another employee
        if (!emp.getEmail().equals(req.getEmail()) && employeeRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email '" + req.getEmail() + "' is already in use");
        }

        return EmployeeResponse.fromEntity(employeeRepository.save(mapToEntity(emp, req)));
    }

    /**
     * Delete employee (original method signature - now with soft delete)
     */
    @Transactional
    public void delete(String id) {
        Employee emp = findById(id);
        // Soft delete instead of hard delete (V2 enhancement)
        emp.setDeletedAt(LocalDateTime.now());
        employeeRepository.save(emp);
    }

    // ============ V2 METHODS (for v2 compatibility) ============

    /**
     * Get all active employees with pagination, search, and filters (V2 method)
     */
    public Page<EmployeeResponse> getAllEmployees(
            String search,
            String status,
            String department,
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {
        return this.search(search, status, department, page, size, sortBy, sortDir);
    }

    /**
     * Create new employee (V2 method signature)
     */
    public EmployeeResponse createEmployee(EmployeeRequest request) {
        return this.create(request);
    }

    /**
     * Update existing employee (V2 method signature)
     */
    public EmployeeResponse updateEmployee(String id, EmployeeRequest request) {
        return this.update(id, request);
    }

    /**
     * Soft delete employee (V2 method signature)
     */
    public void deleteEmployee(String id) {
        this.delete(id);
    }

    /**
     * Get employee by ID (V2 method signature)
     */
    public EmployeeResponse getEmployeeById(String id) {
        return this.getById(id);
    }

    // ============ PRIVATE HELPER METHODS ============

    /**
     * Find employee by ID with soft delete check
     */
    private Employee findById(String id) {
        return employeeRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    }

    /**
     * Map request DTO to entity
     */
    private Employee mapToEntity(Employee emp, EmployeeRequest req) {
        emp.setName(req.getName());
        emp.setFatherName(req.getFatherName());
        emp.setDateOfBirth(req.getDateOfBirth());
        emp.setEmail(req.getEmail());
        emp.setPhone(req.getPhone());
        emp.setAddress(req.getAddress());
        emp.setDesignation(req.getDesignation());
        emp.setDepartment(req.getDepartment());
        emp.setSalary(req.getSalary());
        emp.setEducation(req.getEducation());
        emp.setAadharNumber(req.getAadharNumber());
        emp.setStatus(req.getStatus() != null ? req.getStatus() : Employee.EmployeeStatus.ACTIVE);
        emp.setJoiningDate(req.getJoiningDate() != null ? req.getJoiningDate() : LocalDate.now());
        return emp;
    }

    /**
     * Generate unique employee code (format: EMP-YY-XXXX)
     */
    private String generateEmpCode() {
        String prefix = "EMP-" + DateTimeFormatter.ofPattern("yy").format(LocalDate.now()) + "-";
        long count = employeeRepository.countByDeletedAtIsNull() + 1;
        return prefix + String.format("%04d", count);
    }
}
