package com.ems.repository;

import com.ems.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, String> {

    Optional<Employee> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByEmpCode(String empCode);

    // Full-text search across multiple fields — uses JPQL, NOT string concatenation
    @Query("""
            SELECT e FROM Employee e
            WHERE (:search IS NULL OR :search = ''
               OR LOWER(e.name)        LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(e.email)       LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(e.designation) LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(e.department)  LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(e.empCode)     LIKE LOWER(CONCAT('%', :search, '%')))
              AND (:status IS NULL OR e.status = :status)
              AND (:department IS NULL OR :department = '' OR LOWER(e.department) = LOWER(:department))
            """)
    Page<Employee> searchEmployees(
            @Param("search") String search,
            @Param("status") Employee.EmployeeStatus status,
            @Param("department") String department,
            Pageable pageable
    );

    // Dashboard stats
    long countByStatus(Employee.EmployeeStatus status);

    @Query("SELECT COALESCE(SUM(e.salary), 0) FROM Employee e WHERE e.status = 'ACTIVE'")
    java.math.BigDecimal sumActiveSalaries();

    @Query("SELECT e.department, COUNT(e) FROM Employee e GROUP BY e.department ORDER BY COUNT(e) DESC")
    java.util.List<Object[]> countByDepartment();

    @Query("SELECT MONTH(e.joiningDate), COUNT(e) FROM Employee e WHERE YEAR(e.joiningDate) = :year GROUP BY MONTH(e.joiningDate)")
    java.util.List<Object[]> monthlyStat(@Param("year") int year);
}
