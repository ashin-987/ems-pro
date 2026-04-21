package com.ems.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "employees", indexes = {
        @Index(name = "idx_employee_code", columnList = "emp_code"),
        @Index(name = "idx_department", columnList = "department"),
        @Index(name = "idx_status", columnList = "status"),
        @Index(name = "idx_deleted_at", columnList = "deleted_at")
})
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

    @Id
    @Column(name = "id", updatable = false, nullable = false, length = 36)
    private String id;

    @Column(name = "emp_code", unique = true, nullable = false, length = 20)
    private String empCode;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "father_name", length = 100)
    private String fatherName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(length = 15)
    private String phone;

    @Column(length = 255)
    private String address;

    @Column(nullable = false, length = 100)
    private String designation;

    @Column(length = 100)
    private String department;

    @Column(precision = 12, scale = 2)
    private BigDecimal salary;

    @Column(length = 50)
    private String education;

    @Column(name = "aadhar_number", length = 16)
    private String aadharNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EmployeeStatus status;

    @Column(name = "joining_date")
    private LocalDate joiningDate;

    // Soft Delete Field (V2 addition)
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    // Audit Fields (V2 addition)
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @CreatedBy
    @Column(name = "created_by", length = 100)
    private String createdBy;

    @LastModifiedBy
    @Column(name = "updated_by", length = 100)
    private String updatedBy;

    @PrePersist
    public void prePersist() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
        if (this.status == null) {
            this.status = EmployeeStatus.ACTIVE;
        }
    }

    public enum EmployeeStatus {
        ACTIVE, INACTIVE, ON_LEAVE
    }

    // Compatibility method for v2 code that uses getEmployeeCode()
    public String getEmployeeCode() {
        return this.empCode;
    }

    public void setEmployeeCode(String employeeCode) {
        this.empCode = employeeCode;
    }

    // Compatibility method for v2 code that uses getPosition()
    public String getPosition() {
        return this.designation;
    }

    public void setPosition(String position) {
        this.designation = position;
    }
}
