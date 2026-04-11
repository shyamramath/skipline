package com.java.homemanagementapi.repository;

import com.java.homemanagementapi.model.Inspection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InspectionRepository extends JpaRepository<Inspection, Long> {

    List<Inspection> findByUserEmailOrderByCreatedAtDesc(String email);

    List<Inspection> findByHomeAssessorIDOrderByCreatedAtDesc(String assessorId);
}
