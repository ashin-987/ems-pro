package com.ems.dto.request;

import com.ems.entity.Employee;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class EmployeeRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be 2–100 characters")
    private String name;

    @Size(max = 100)
    private String fatherName;

    private LocalDate dateOfBirth;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be exactly 10 digits")
    private String phone;

    @Size(max = 255)
    private String address;

    @NotBlank(message = "Designation is required")
    @Size(max = 100)
    private String designation;

    @Size(max = 100)
    private String department;

    @DecimalMin(value = "0.0", inclusive = false, message = "Salary must be positive")
    private BigDecimal salary;

    @Size(max = 50)
    private String education;

    @Pattern(regexp = "^[0-9]{12}$", message = "Aadhar must be exactly 12 digits")
    private String aadharNumber;

    private Employee.EmployeeStatus status;

    private LocalDate joiningDate;

    // V2 compatibility: position is an alias for designation
    public String getPosition() {
        return this.designation;
    }

    public void setPosition(String position) {
        this.designation = position;
    }
}
