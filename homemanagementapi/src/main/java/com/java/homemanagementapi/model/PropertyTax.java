package com.java.homemanagementapi.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PropertyTax {

    @JsonProperty("year")
    private Integer year;

    @JsonProperty("total")
    private Long total;
}
