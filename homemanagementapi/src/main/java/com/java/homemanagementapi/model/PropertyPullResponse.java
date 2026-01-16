package com.java.homemanagementapi.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
public class PropertyPullResponse {

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

    @JsonProperty("county")
    private String county;

    @JsonProperty("countyFips")
    private String countyFips;

    @JsonProperty("latitude")
    private Double latitude;

    @JsonProperty("longitude")
    private Double longitude;

    @JsonProperty("propertyType")
    private String propertyType;

    @JsonProperty("bedrooms")
    private Integer bedrooms;

    @JsonProperty("bathrooms")
    private Double bathrooms;

    @JsonProperty("squareFootage")
    private Integer squareFootage;

    @JsonProperty("lotSize")
    private Integer lotSize;

    @JsonProperty("yearBuilt")
    private Integer yearBuilt;

    @JsonProperty("assessorID")
    private String assessorID;

    @JsonProperty("legalDescription")
    private String legalDescription;

    @JsonProperty("subdivision")
    private String subdivision;

    @JsonProperty("lastSaleDate")
    private String lastSaleDate;

    @JsonProperty("features")
    private Features features;

    @JsonProperty("taxAssessments")
    private Map<String, TaxAssessment> taxAssessments;

    @JsonProperty("propertyTaxes")
    private Map<String, PropertyTax> propertyTaxes;

    @JsonProperty("owner")
    private Owner owner;

    @JsonProperty("ownerOccupied")
    private Boolean ownerOccupied;
}
