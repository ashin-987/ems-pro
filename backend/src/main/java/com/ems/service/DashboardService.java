package com.ems.service;

import com.ems.dto.response.DashboardResponse;
import com.ems.entity.Employee;
import com.ems.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Month;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final EmployeeRepository employeeRepository;

    @Transactional(readOnly = true)
    public DashboardResponse getStats() {
        // Count by status (with soft delete filtering)
        long total    = employeeRepository.countByDeletedAtIsNull();
        long active   = employeeRepository.countByStatus(Employee.EmployeeStatus.ACTIVE);
        long inactive = employeeRepository.countByStatus(Employee.EmployeeStatus.INACTIVE);
        long onLeave  = employeeRepository.countByStatus(Employee.EmployeeStatus.ON_LEAVE);

        // Department breakdown
        Map<String, Long> byDept = new LinkedHashMap<>();
        employeeRepository.countByDepartment().forEach(row ->
                byDept.put(row[0] == null ? "Unassigned" : (String) row[0], (Long) row[1]));

        // Monthly joins for the current year
        int year = LocalDate.now().getYear();
        Map<Integer, Long> monthMap = new HashMap<>();
        employeeRepository.monthlyStat(year).forEach(row ->
                monthMap.put(((Number) row[0]).intValue(), (Long) row[1]));

        List<DashboardResponse.MonthlyJoinStat> monthly = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            monthly.add(DashboardResponse.MonthlyJoinStat.builder()
                    .month(Month.of(m).name().substring(0, 3))
                    .count(monthMap.getOrDefault(m, 0L))
                    .build());
        }

        return DashboardResponse.builder()
                .totalEmployees(total)
                .activeEmployees(active)
                .inactiveEmployees(inactive)
                .onLeaveEmployees(onLeave)
                .totalMonthlySalary(employeeRepository.sumActiveSalaries())
                .employeesByDepartment(byDept)
                .monthlyJoinStats(monthly)
                .build()
;
    }
}
