package com.diana.coffee.service;

import com.diana.coffee.dto.request.ReviewModerationRequest;
import com.diana.coffee.dto.request.ReviewRequest;
import com.diana.coffee.dto.response.ReviewResponse;
import com.diana.coffee.exception.ResourceNotFoundException;
import com.diana.coffee.model.Branch;
import com.diana.coffee.model.Review;
import com.diana.coffee.model.User;
import com.diana.coffee.repository.BranchRepository;
import com.diana.coffee.repository.ReviewRepository;
import com.diana.coffee.repository.UserRepository;
import com.diana.coffee.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final BranchRepository branchRepository;

    public ReviewResponse createReview(ReviewRequest request, CustomUserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found"));

        Review review = Review.builder()
                .user(user)
                .branch(branch)
                .rating(request.getRating())
                .comment(request.getComment())
                .isApproved(false)
                .build();

        review = reviewRepository.save(review);
        return mapToResponse(review);
    }

    public List<ReviewResponse> getApprovedReviewsByBranch(Long branchId) {
        return reviewRepository.findByBranchIdAndIsApprovedTrue(branchId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ReviewResponse> getPendingReviews() {
        return reviewRepository.findByIsApprovedFalse().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ReviewResponse moderateReview(Long id, ReviewModerationRequest request) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        review.setApproved(request.getApproved());
        review = reviewRepository.save(review);
        return mapToResponse(review);
    }

    public List<ReviewResponse> getUserReviews(CustomUserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return reviewRepository.findByUserId(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }

    private ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .userId(review.getUser().getId())
                .userName(review.getUser().getName())
                .branchId(review.getBranch().getId())
                .branchName(review.getBranch().getName())
                .rating(review.getRating())
                .comment(review.getComment())
                .approved(review.isApproved())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
