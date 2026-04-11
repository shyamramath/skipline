package com.java.homemanagementapi.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.java.homemanagementapi.Home;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "inspections")
@Data
@NoArgsConstructor
public class Inspection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "home_db_id")
    private Home home;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_email", referencedColumnName = "email")
    private User user;

    // Denormalized for easy JSON responses
    @Column(name = "assessor_id")
    private String assessorId;

    @Column(name = "property_address", length = 500)
    private String propertyAddress;

    @Column(name = "inspection_types", length = 500)
    private String inspectionTypes;

    @Column(name = "scheduled_date")
    private String scheduledDate;

    @Column(name = "time_slot")
    private String timeSlot;

    @Column(name = "notes", length = 1000)
    private String notes;

    @Column(name = "status")
    private String status = "SCHEDULED";

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
