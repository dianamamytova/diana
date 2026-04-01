package com.diana.coffee.repository;

import com.diana.coffee.model.CoffeeTable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CoffeeTableRepository extends JpaRepository<CoffeeTable, Long> {

    List<CoffeeTable> findByBranchId(Long branchId);

    List<CoffeeTable> findByBranchIdAndIsAvailableTrue(Long branchId);
}
