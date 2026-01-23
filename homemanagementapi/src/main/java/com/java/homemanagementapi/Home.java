package com.java.homemanagementapi;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.java.homemanagementapi.model.Features;
import com.java.homemanagementapi.model.Owner;
import com.java.homemanagementapi.model.PropertyTax;
import com.java.homemanagementapi.model.TaxAssessment;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Entity
@Table(name = "homes")
@Data
@NoArgsConstructor
public class Home {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dbId;

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

    @Column(length = 1000)
    @JsonProperty("legalDescription")
    private String legalDescription;

    @JsonProperty("subdivision")
    private String subdivision;

    @JsonProperty("lastSaleDate")
    private String lastSaleDate;

    @Embedded
    @JsonProperty("features")
    private Features features;

    @Transient
    @JsonProperty("taxAssessments")
    private Map<String, TaxAssessment> taxAssessments;

    @Transient
    @JsonProperty("propertyTaxes")
    private Map<String, PropertyTax> propertyTaxes;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "id", column = @Column(name = "owner_mailing_id")),
            @AttributeOverride(name = "formattedAddress", column = @Column(name = "owner_mailing_formatted_address")),
            @AttributeOverride(name = "addressLine1", column = @Column(name = "owner_mailing_address_line1")),
            @AttributeOverride(name = "addressLine2", column = @Column(name = "owner_mailing_address_line2")),
            @AttributeOverride(name = "city", column = @Column(name = "owner_mailing_city")),
            @AttributeOverride(name = "state", column = @Column(name = "owner_mailing_state")),
            @AttributeOverride(name = "stateFips", column = @Column(name = "owner_mailing_state_fips")),
            @AttributeOverride(name = "zipCode", column = @Column(name = "owner_mailing_zip_code"))
    })
    @JsonProperty("owner")
    private Owner owner;

    @JsonProperty("ownerOccupied")
    private Boolean ownerOccupied;

    @Column(name = "barcode")
    @org.hibernate.annotations.JdbcTypeCode(java.sql.Types.VARBINARY)
    private byte[] barcode;
}
