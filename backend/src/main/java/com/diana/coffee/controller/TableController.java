package com.diana.coffee.controller;

import com.diana.coffee.dto.request.TableRequest;
import com.diana.coffee.dto.response.TableResponse;
import com.diana.coffee.service.TableService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
@RequiredArgsConstructor
public class TableController {

    private final TableService tableService;

    @GetMapping("/branch/{branchId}")
    public ResponseEntity<List<TableResponse>> getTablesByBranch(@PathVariable Long branchId) {
        return ResponseEntity.ok(tableService.getTablesByBranch(branchId));
    }

    @GetMapping("/branch/{branchId}/available")
    public ResponseEntity<List<TableResponse>> getAvailableTablesByBranch(@PathVariable Long branchId) {
        return ResponseEntity.ok(tableService.getAvailableTablesByBranch(branchId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<TableResponse> createTable(@Valid @RequestBody TableRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tableService.createTable(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<TableResponse> updateTable(@PathVariable Long id,
                                                     @Valid @RequestBody TableRequest request) {
        return ResponseEntity.ok(tableService.updateTable(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<Void> deleteTable(@PathVariable Long id) {
        tableService.deleteTable(id);
        return ResponseEntity.noContent().build();
    }
}
