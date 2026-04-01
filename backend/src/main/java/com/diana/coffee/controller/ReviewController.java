package com.diana.coffee.controller;

import com.diana.coffee.dto.request.ReviewModerationRequest;
import com.diana.coffee.dto.request.ReviewRequest;
import com.diana.coffee.dto.response.ReviewResponse;
import com.diana.coffee.security.CustomUserDetails;
import com.diana.coffee.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reviewService.createReview(request, userDetails));
    }

    @GetMapping("/branch/{branchId}")
    public ResponseEntity<List<ReviewResponse>> getApprovedReviewsByBranch(@PathVariable Long branchId) {
        return ResponseEntity.ok(reviewService.getApprovedReviewsByBranch(branchId));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<List<ReviewResponse>> getPendingReviews() {
        return ResponseEntity.ok(reviewService.getPendingReviews());
    }

    @PutMapping("/{id}/moderate")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<ReviewResponse> moderateReview(
            @PathVariable Long id,
            @Valid @RequestBody ReviewModerationRequest request) {
        return ResponseEntity.ok(reviewService.moderateReview(id, request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ReviewResponse>> getUserReviews(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(reviewService.getUserReviews(userDetails));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
}
