package com.ems.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "employees")
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

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

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
}
