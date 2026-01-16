package com.java.homemanagementapi;

public class Home {

    private String address;
    private String city;
    private String state;
    private String zipCode;
    private int sizeInSqFt;

    public Home(String address, String city, String state, String zipCode, int sizeInSqFt) {
        this.address = address;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        this.sizeInSqFt = sizeInSqFt;
    }

    public String getAddress() {
        return address;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public String getZipCode() {
        return zipCode;
    }

    public int getSizeInSqFt() {
        return sizeInSqFt;
    }
}
