package com.diana.coffee.repository;

import com.diana.coffee.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByBranchId(Long branchId);

    List<Review> findByBranchIdAndIsApprovedTrue(Long branchId);

    List<Review> findByUserId(Long userId);

    List<Review> findByIsApprovedFalse();

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.branch.id = :branchId")
    Double averageRatingByBranchId(@Param("branchId") Long branchId);

    long countByBranchId(Long branchId);
}
