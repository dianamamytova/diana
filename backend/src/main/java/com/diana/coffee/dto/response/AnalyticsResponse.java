package com.diana.coffee.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {

    private long totalReservations;
    private long confirmedReservations;
    private long cancelledReservations;
    private double averageRating;
    private long totalReviews;
}
