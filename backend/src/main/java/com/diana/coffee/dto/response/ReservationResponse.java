package com.diana.coffee.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationResponse {

    private Long id;
    private Long userId;
    private String userName;
    private Long tableId;
    private int tableNumber;
    private String branchName;
    private LocalDate reservationDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private int guestsCount;
    private String status;
    private String comment;
    private LocalDateTime createdAt;
}
