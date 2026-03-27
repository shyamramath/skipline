package com.java.homemanagementapi.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
public class Features {

    @JsonProperty("architectureType")
    private String architectureType;

    @JsonProperty("cooling")
    private Boolean cooling;

    @JsonProperty("coolingType")
    private String coolingType;

    @JsonProperty("floorCount")
    private Integer floorCount;

    @JsonProperty("foundationType")
    private String foundationType;

    @JsonProperty("garage")
    private Boolean garage;

    @JsonProperty("garageType")
    private String garageType;

    @JsonProperty("heating")
    private Boolean heating;

    @JsonProperty("heatingType")
    private String heatingType;
}
