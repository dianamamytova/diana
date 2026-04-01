package com.diana.coffee.repository;

import com.diana.coffee.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByBranchId(Long branchId);
}
