package com.diana.coffee.repository;

import com.diana.coffee.model.Branch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BranchRepository extends JpaRepository<Branch, Long> {

    List<Branch> findByIsActiveTrue();

    List<Branch> findByCity(String city);
}
