package com.ems.repository;

import com.ems.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, String> {

    // ============ ORIGINAL METHODS ============
    
    Optional<Employee> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByEmpCode(String empCode);

    /**
     * Full-text search across multiple fields (original method)
     */
    @Query("""
            SELECT e FROM Employee e
            WHERE e.deletedAt IS NULL
              AND (:search IS NULL OR :search = ''
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

    /**
     * Count employees by status (original method with soft delete)
     */
    @Query("SELECT COUNT(e) FROM Employee e WHERE e.status = :status AND e.deletedAt IS NULL")
    long countByStatus(@Param("status") Employee.EmployeeStatus status);

    /**
     * Sum active salaries (original method with soft delete)
     */
    @Query("SELECT COALESCE(SUM(e.salary), 0) FROM Employee e WHERE e.status = 'ACTIVE' AND e.deletedAt IS NULL")
    BigDecimal sumActiveSalaries();

    /**
     * Count by department (original method with soft delete)
     */
    @Query("SELECT e.department, COUNT(e) FROM Employee e WHERE e.deletedAt IS NULL GROUP BY e.department ORDER BY COUNT(e) DESC")
    List<Object[]> countByDepartment();

    /**
     * Monthly statistics for a given year (original method with soft delete)
     */
    @Query("SELECT MONTH(e.joiningDate), COUNT(e) FROM Employee e WHERE e.deletedAt IS NULL AND YEAR(e.joiningDate) = :year GROUP BY MONTH(e.joiningDate)")
    List<Object[]> monthlyStat(@Param("year") int year);

    // ============ V2 METHODS (soft delete support) ============

    /**
     * Find active employee by ID (not soft deleted)
     */
    Optional<Employee> findByIdAndDeletedAtIsNull(String id);

    /**
     * Count all active employees
     */
    long countByDeletedAtIsNull();

    /**
     * Find all active employees
     */
    List<Employee> findByDeletedAtIsNull();

    /**
     * Count employees by status (active only)
     */
    long countByStatusAndDeletedAtIsNull(Employee.EmployeeStatus status);

    /**
     * Get monthly joinings for the current year
     */
    @Query("SELECT FUNCTION('MONTH', e.joiningDate) as month, COUNT(e) as count " +
           "FROM Employee e WHERE e.deletedAt IS NULL " +
           "AND FUNCTION('YEAR', e.joiningDate) = FUNCTION('YEAR', CURRENT_DATE) " +
           "GROUP BY FUNCTION('MONTH', e.joiningDate) " +
           "ORDER BY month")
    List<Object[]> getMonthlyJoinings();
}
