package com.diana.coffee.service;

import com.diana.coffee.dto.request.BranchRequest;
import com.diana.coffee.dto.response.BranchResponse;
import com.diana.coffee.exception.ResourceNotFoundException;
import com.diana.coffee.model.Branch;
import com.diana.coffee.repository.BranchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BranchService {

    private final BranchRepository branchRepository;

    public List<BranchResponse> getAllBranches() {
        return branchRepository.findByIsActiveTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BranchResponse getBranchById(Long id) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + id));
        return mapToResponse(branch);
    }

    public BranchResponse createBranch(BranchRequest request) {
        Branch branch = Branch.builder()
                .name(request.getName())
                .address(request.getAddress())
                .city(request.getCity())
                .phone(request.getPhone())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .build();

        branch = branchRepository.save(branch);
        return mapToResponse(branch);
    }

    public BranchResponse updateBranch(Long id, BranchRequest request) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + id));

        branch.setName(request.getName());
        branch.setAddress(request.getAddress());
        branch.setCity(request.getCity());
        branch.setPhone(request.getPhone());
        branch.setDescription(request.getDescription());
        branch.setImageUrl(request.getImageUrl());

        branch = branchRepository.save(branch);
        return mapToResponse(branch);
    }

    public void deleteBranch(Long id) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + id));

        branch.setActive(false);
        branchRepository.save(branch);
    }

    private BranchResponse mapToResponse(Branch branch) {
        return BranchResponse.builder()
                .id(branch.getId())
                .name(branch.getName())
                .address(branch.getAddress())
                .city(branch.getCity())
                .phone(branch.getPhone())
                .description(branch.getDescription())
                .imageUrl(branch.getImageUrl())
                .isActive(branch.isActive())
                .build();
    }
}
