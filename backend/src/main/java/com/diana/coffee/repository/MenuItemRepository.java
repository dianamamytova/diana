package com.diana.coffee.repository;

import com.diana.coffee.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

    List<MenuItem> findByCategoryId(Long categoryId);

    List<MenuItem> findByCategoryBranchId(Long branchId);

    List<MenuItem> findByIsAvailableTrue();
}
