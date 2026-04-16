package com.ems.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class DashboardResponse {
    private long totalEmployees;
    private long activeEmployees;
    private long inactiveEmployees;
    private long onLeaveEmployees;
    private BigDecimal totalMonthlySalary;
    private Map<String, Long> employeesByDepartment;
    private List<MonthlyJoinStat> monthlyJoinStats;

    @Data
    @Builder
    public static class MonthlyJoinStat {
        private String month;
        private long count;
    }
}
