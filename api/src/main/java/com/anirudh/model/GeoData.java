package com.anirudh.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class GeoData {
    private String ip;
    private String city;
    private String region;

    @JsonProperty("country_name")
    private String countryName;
}
