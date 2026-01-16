package com.java.homemanagementapi.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class Owner {

    @JsonProperty("names")
    private List<String> names;

    @JsonProperty("mailingAddress")
    private MailingAddress mailingAddress;
}
