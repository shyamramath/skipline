package com.java.homemanagementapi.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class MailingAddress {

    @JsonProperty("id")
    private String id;

    @JsonProperty("formattedAddress")
    private String formattedAddress;

    @JsonProperty("addressLine1")
    private String addressLine1;

    @JsonProperty("addressLine2")
    private String addressLine2;

    @JsonProperty("city")
    private String city;

    @JsonProperty("state")
    private String state;

    @JsonProperty("stateFips")
    private String stateFips;

    @JsonProperty("zipCode")
    private String zipCode;
}
