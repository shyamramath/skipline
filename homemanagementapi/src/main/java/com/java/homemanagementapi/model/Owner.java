package com.java.homemanagementapi.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Transient;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Embeddable
@Data
@NoArgsConstructor
public class Owner {

    @Transient
    @JsonProperty("names")
    private List<String> names;

    @Transient
    @JsonProperty("mailingAddress")
    private MailingAddress mailingAddress;
}
