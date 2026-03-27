package com.java.homemanagementapi.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TaxAssessment {

    @JsonProperty("year")
    private Integer year;

    @JsonProperty("value")
    private Long value;

    @JsonProperty("land")
    private Long land;

    @JsonProperty("improvements")
    private Long improvements;
}
