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
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    @Transactional
    public EmployeeResponse create(EmployeeRequest req) {
        if (employeeRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Employee with email '" + req.getEmail() + "' already exists");
        }
        Employee emp = mapToEntity(new Employee(), req);
        emp.setEmpCode(generateEmpCode());
        return EmployeeResponse.fromEntity(employeeRepository.save(emp));
    }

    @Transactional(readOnly = true)
    public EmployeeResponse getById(String id) {
        return EmployeeResponse.fromEntity(findById(id));
    }

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

    @Transactional
    public EmployeeResponse update(String id, EmployeeRequest req) {
        Employee emp = findById(id);

        // Allow email update only if not taken by another employee
        if (!emp.getEmail().equals(req.getEmail()) && employeeRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email '" + req.getEmail() + "' is already in use");
        }

        return EmployeeResponse.fromEntity(employeeRepository.save(mapToEntity(emp, req)));
    }

    @Transactional
    public void delete(String id) {
        Employee emp = findById(id);
        employeeRepository.delete(emp);
    }

    private Employee findById(String id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    }

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

    private String generateEmpCode() {
        String prefix = "EMP-" + DateTimeFormatter.ofPattern("yy").format(LocalDate.now()) + "-";
        long count = employeeRepository.count() + 1;
        return prefix + String.format("%04d", count);
    }
}
