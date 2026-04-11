package com.java.homemanagementapi.controllers;

import com.java.homemanagementapi.Home;
import com.java.homemanagementapi.model.Inspection;
import com.java.homemanagementapi.model.InspectionRequest;
import com.java.homemanagementapi.model.User;
import com.java.homemanagementapi.repository.HomeRepository;
import com.java.homemanagementapi.repository.InspectionRepository;
import com.java.homemanagementapi.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/inspection")
public class InspectionController {

    private final InspectionRepository inspectionRepository;
    private final HomeRepository homeRepository;
    private final UserRepository userRepository;

    public InspectionController(InspectionRepository inspectionRepository,
                                HomeRepository homeRepository,
                                UserRepository userRepository) {
        this.inspectionRepository = inspectionRepository;
        this.homeRepository = homeRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/schedule")
    public ResponseEntity<?> scheduleInspection(
            @AuthenticationPrincipal OAuth2User principal,
            @RequestBody InspectionRequest request) {

        String userEmail = principal.getAttribute("email");

        Optional<Home> homeOpt = homeRepository.findByAssessorID(request.getAssessorId());
        if (homeOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Property not found for assessor ID: " + request.getAssessorId());
        }

        Optional<User> userOpt = userRepository.findByEmail(userEmail);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        Inspection inspection = new Inspection();
        Home home = homeOpt.get();
        inspection.setHome(home);
        inspection.setUser(userOpt.get());
        inspection.setAssessorId(home.getAssessorID());
        inspection.setPropertyAddress(home.getFormattedAddress() != null
                ? home.getFormattedAddress()
                : home.getAddressLine1() + ", " + home.getCity() + ", " + home.getState() + " " + home.getZipCode());
        inspection.setInspectionTypes(
            request.getInspectionTypes() != null
                ? String.join(",", request.getInspectionTypes())
                : ""
        );
        inspection.setScheduledDate(request.getDate());
        inspection.setTimeSlot(request.getTime());
        inspection.setNotes(request.getNotes());
        inspection.setStatus("SCHEDULED");

        inspectionRepository.save(inspection);

        return ResponseEntity.ok("Inspection scheduled successfully.");
    }

    @GetMapping("/my")
    public ResponseEntity<List<Inspection>> getMyInspections(
            @AuthenticationPrincipal OAuth2User principal) {

        String userEmail = principal.getAttribute("email");
        List<Inspection> inspections = inspectionRepository.findByUserEmailOrderByCreatedAtDesc(userEmail);
        return ResponseEntity.ok(inspections);
    }
}
