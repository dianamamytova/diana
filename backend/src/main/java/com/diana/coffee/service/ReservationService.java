package com.diana.coffee.service;

import com.diana.coffee.dto.request.ReservationRequest;
import com.diana.coffee.dto.request.ReservationStatusRequest;
import com.diana.coffee.dto.response.ReservationResponse;
import com.diana.coffee.exception.BadRequestException;
import com.diana.coffee.exception.ReservationConflictException;
import com.diana.coffee.exception.ResourceNotFoundException;
import com.diana.coffee.model.CoffeeTable;
import com.diana.coffee.model.Reservation;
import com.diana.coffee.model.User;
import com.diana.coffee.model.enums.ReservationStatus;
import com.diana.coffee.model.enums.Role;
import com.diana.coffee.repository.CoffeeTableRepository;
import com.diana.coffee.repository.ReservationRepository;
import com.diana.coffee.repository.UserRepository;
import com.diana.coffee.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final CoffeeTableRepository coffeeTableRepository;

    public ReservationResponse createReservation(ReservationRequest request, CustomUserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CoffeeTable coffeeTable = coffeeTableRepository.findById(request.getCoffeeTableId())
                .orElseThrow(() -> new ResourceNotFoundException("Table not found"));

        if (!request.getStartTime().isBefore(request.getEndTime())) {
            throw new BadRequestException("Start time must be before end time");
        }

        if (!request.getReservationDate().isAfter(LocalDate.now())) {
            throw new BadRequestException("Reservation date must be in the future");
        }

        if (request.getGuestsCount() > coffeeTable.getCapacity()) {
            throw new BadRequestException("Guests count exceeds table capacity of " + coffeeTable.getCapacity());
        }

        List<Reservation> overlapping = reservationRepository.findOverlapping(
                coffeeTable.getId(),
                request.getReservationDate(),
                request.getStartTime(),
                request.getEndTime(),
                ReservationStatus.CONFIRMED
        );

        if (!overlapping.isEmpty()) {
            throw new ReservationConflictException("Table is already reserved for this time slot");
        }

        Reservation reservation = Reservation.builder()
                .user(user)
                .coffeeTable(coffeeTable)
                .reservationDate(request.getReservationDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .guestsCount(request.getGuestsCount())
                .status(ReservationStatus.PENDING)
                .comment(request.getComment())
                .build();

        reservation = reservationRepository.save(reservation);
        return mapToResponse(reservation);
    }

    public List<ReservationResponse> getUserReservations(CustomUserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return reservationRepository.findByUserId(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ReservationResponse> getReservationsByBranch(Long branchId, LocalDate date) {
        if (date == null) {
            date = LocalDate.now();
        }
        return reservationRepository.findByReservationDateAndCoffeeTable_BranchId(date, branchId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ReservationResponse> getAllReservations() {
        return reservationRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ReservationResponse updateReservationStatus(Long id, ReservationStatusRequest request) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));

        reservation.setStatus(request.getStatus());
        reservation = reservationRepository.save(reservation);
        return mapToResponse(reservation);
    }

    public ReservationResponse cancelReservation(Long id, CustomUserDetails userDetails) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean isOwner = reservation.getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN || user.getRole() == Role.SUPER_ADMIN;

        if (!isOwner && !isAdmin) {
            throw new BadRequestException("You can only cancel your own reservations");
        }

        reservation.setStatus(ReservationStatus.CANCELLED);
        reservation = reservationRepository.save(reservation);
        return mapToResponse(reservation);
    }

    public void deleteReservation(Long id) {
        reservationRepository.deleteById(id);
    }

    private ReservationResponse mapToResponse(Reservation reservation) {
        return ReservationResponse.builder()
                .id(reservation.getId())
                .userId(reservation.getUser().getId())
                .userName(reservation.getUser().getName())
                .tableId(reservation.getCoffeeTable().getId())
                .tableNumber(reservation.getCoffeeTable().getTableNumber())
                .branchName(reservation.getCoffeeTable().getBranch().getName())
                .reservationDate(reservation.getReservationDate())
                .startTime(reservation.getStartTime())
                .endTime(reservation.getEndTime())
                .guestsCount(reservation.getGuestsCount())
                .status(reservation.getStatus().name())
                .comment(reservation.getComment())
                .createdAt(reservation.getCreatedAt())
                .build();
    }
}
