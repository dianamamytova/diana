package com.diana.coffee.repository;

import com.diana.coffee.model.Reservation;
import com.diana.coffee.model.enums.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByUserId(Long userId);

    List<Reservation> findByCoffeeTableIdAndReservationDateAndStatus(Long tableId, LocalDate date, ReservationStatus status);

    List<Reservation> findByReservationDateAndCoffeeTable_BranchId(LocalDate date, Long branchId);

    @Query("SELECT r FROM Reservation r WHERE r.coffeeTable.id = :tableId " +
            "AND r.reservationDate = :date " +
            "AND r.status = :status " +
            "AND r.startTime < :endTime " +
            "AND r.endTime > :startTime")
    List<Reservation> findOverlapping(@Param("tableId") Long tableId,
                                      @Param("date") LocalDate date,
                                      @Param("startTime") LocalTime startTime,
                                      @Param("endTime") LocalTime endTime,
                                      @Param("status") ReservationStatus status);

    long countByReservationDateAndCoffeeTable_BranchId(LocalDate date, Long branchId);

    long countByStatus(ReservationStatus status);

    List<Reservation> findByCoffeeTable_BranchIdAndReservationDateBetween(Long branchId, LocalDate from, LocalDate to);
}
