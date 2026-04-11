package com.java.homemanagementapi.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class InspectionRequest {
    private String assessorId;
    private List<String> inspectionTypes;
    private String date;
    private String time;
    private String notes;
}
