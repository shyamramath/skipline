package com.java.homemanagementapi.repository;

import com.java.homemanagementapi.Home;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HomeRepository extends JpaRepository<Home, Long> {

    List<Home> findByCity(String city);

    List<Home> findByState(String state);

    List<Home> findByZipCode(String zipCode);

    Optional<Home> findByAssessorID(String assessorID);

    List<Home> findByUserEmail(String email);
}
