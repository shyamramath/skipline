package com.java.homemanagementapi;

public class Home {

    String address;
    String city;
    String state;
    String zipCode;
    int sizeInSqFt;

    /**
     *
     * @param address
     * @param city
     * @param state
     * @param zipCode
     * @param sizeInSqFt
     */
    public Home(String address, String city, String state, String zipCode, int sizeInSqFt) {
        this.address = address;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        this.sizeInSqFt = sizeInSqFt;
    }

}
