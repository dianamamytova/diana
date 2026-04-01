package com.diana.coffee.service;

import com.diana.coffee.dto.request.TableRequest;
import com.diana.coffee.dto.response.TableResponse;
import com.diana.coffee.exception.ResourceNotFoundException;
import com.diana.coffee.model.Branch;
import com.diana.coffee.model.CoffeeTable;
import com.diana.coffee.repository.BranchRepository;
import com.diana.coffee.repository.CoffeeTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TableService {

    private final CoffeeTableRepository coffeeTableRepository;
    private final BranchRepository branchRepository;

    public List<TableResponse> getTablesByBranch(Long branchId) {
        return coffeeTableRepository.findByBranchId(branchId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<TableResponse> getAvailableTablesByBranch(Long branchId) {
        return coffeeTableRepository.findByBranchIdAndIsAvailableTrue(branchId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TableResponse createTable(TableRequest request) {
        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + request.getBranchId()));

        CoffeeTable table = CoffeeTable.builder()
                .tableNumber(request.getTableNumber())
                .capacity(request.getCapacity())
                .branch(branch)
                .build();

        table = coffeeTableRepository.save(table);
        return mapToResponse(table);
    }

    public TableResponse updateTable(Long id, TableRequest request) {
        CoffeeTable table = coffeeTableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + id));

        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + request.getBranchId()));

        table.setTableNumber(request.getTableNumber());
        table.setCapacity(request.getCapacity());
        table.setBranch(branch);

        table = coffeeTableRepository.save(table);
        return mapToResponse(table);
    }

    public void deleteTable(Long id) {
        if (!coffeeTableRepository.existsById(id)) {
            throw new ResourceNotFoundException("Table not found with id: " + id);
        }
        coffeeTableRepository.deleteById(id);
    }

    private TableResponse mapToResponse(CoffeeTable table) {
        return TableResponse.builder()
                .id(table.getId())
                .tableNumber(table.getTableNumber())
                .capacity(table.getCapacity())
                .branchId(table.getBranch().getId())
                .branchName(table.getBranch().getName())
                .isAvailable(table.isAvailable())
                .build();
    }
}
