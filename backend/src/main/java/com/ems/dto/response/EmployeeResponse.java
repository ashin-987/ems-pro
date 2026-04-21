package com.ems.dto.response;

import com.ems.entity.Employee;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeResponse {
    private String id;
    private String empCode;
    private String name;
    private String fatherName;
    private LocalDate dateOfBirth;
    private String email;
    private String phone;
    private String address;
    private String designation;
    private String department;
    private BigDecimal salary;
    private String education;
    private String aadharNumber;
    private Employee.EmployeeStatus status;
    private LocalDate joiningDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // V2 audit fields
    private String createdBy;
    private String updatedBy;

    public static EmployeeResponse fromEntity(Employee e) {
        return EmployeeResponse.builder()
                .id(e.getId())
                .empCode(e.getEmpCode())
                .name(e.getName())
                .fatherName(e.getFatherName())
                .dateOfBirth(e.getDateOfBirth())
                .email(e.getEmail())
                .phone(e.getPhone())
                .address(e.getAddress())
                .designation(e.getDesignation())
                .department(e.getDepartment())
                .salary(e.getSalary())
                .education(e.getEducation())
                .aadharNumber(e.getAadharNumber())
                .status(e.getStatus())
                .joiningDate(e.getJoiningDate())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .createdBy(e.getCreatedBy())
                .updatedBy(e.getUpdatedBy())
                .build();
    }

    // Compatibility getters/setters for v2 code
    public String getEmployeeCode() {
        return this.empCode;
    }

    public void setEmployeeCode(String employeeCode) {
        this.empCode = employeeCode;
    }

    public String getPosition() {
        return this.designation;
    }

    public void setPosition(String position) {
        this.designation = position;
    }
}
