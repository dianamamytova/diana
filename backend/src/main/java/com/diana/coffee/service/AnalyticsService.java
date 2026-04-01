package com.diana.coffee.service;

import com.diana.coffee.dto.response.AnalyticsResponse;
import com.diana.coffee.model.Reservation;
import com.diana.coffee.model.enums.ReservationStatus;
import com.diana.coffee.repository.ReservationRepository;
import com.diana.coffee.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final ReservationRepository reservationRepository;
    private final ReviewRepository reviewRepository;

    public AnalyticsResponse getBranchAnalytics(Long branchId, LocalDate from, LocalDate to) {
        List<Reservation> reservations = reservationRepository
                .findByCoffeeTable_BranchIdAndReservationDateBetween(branchId, from, to);

        long totalReservations = reservations.size();
        long confirmedReservations = reservations.stream()
                .filter(r -> r.getStatus() == ReservationStatus.CONFIRMED)
                .count();
        long cancelledReservations = reservations.stream()
                .filter(r -> r.getStatus() == ReservationStatus.CANCELLED)
                .count();

        Double avgRating = reviewRepository.averageRatingByBranchId(branchId);
        double averageRating = avgRating != null ? avgRating : 0.0;

        long totalReviews = reviewRepository.countByBranchId(branchId);

        return AnalyticsResponse.builder()
                .totalReservations(totalReservations)
                .confirmedReservations(confirmedReservations)
                .cancelledReservations(cancelledReservations)
                .averageRating(averageRating)
                .totalReviews(totalReviews)
                .build();
    }

    public long getDailyReservationCount(Long branchId, LocalDate date) {
        return reservationRepository.countByReservationDateAndCoffeeTable_BranchId(date, branchId);
    }
}
