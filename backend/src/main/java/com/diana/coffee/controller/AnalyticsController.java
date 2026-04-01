package com.diana.coffee.controller;

import com.diana.coffee.dto.response.AnalyticsResponse;
import com.diana.coffee.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/analytics")
@PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/branch/{branchId}")
    public ResponseEntity<AnalyticsResponse> getBranchAnalytics(
            @PathVariable Long branchId,
            @RequestParam LocalDate from,
            @RequestParam LocalDate to) {
        return ResponseEntity.ok(analyticsService.getBranchAnalytics(branchId, from, to));
    }

    @GetMapping("/branch/{branchId}/daily")
    public ResponseEntity<Long> getDailyReservationCount(
            @PathVariable Long branchId,
            @RequestParam LocalDate date) {
        return ResponseEntity.ok(analyticsService.getDailyReservationCount(branchId, date));
    }
}
