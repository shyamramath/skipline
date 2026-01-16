package com.java.homemanagementapi.utils;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class HttpClient {

    /**
     *
     * @throws Exception
     */
    public Response fetchPropertyData() throws Exception {

        if(false) {
            OkHttpClient client = new OkHttpClient();
            Request request = new Request.Builder()
                    .url("https://api.rentcast.io/v1/properties?address=5500%20Grand%20Lake%20Dr%2C%20San%20Antonio%2C%20TX%2C%2078244")
                    .get()
                    .addHeader("accept", "application/json")
                    .addHeader("X-Api-Key", "49859dead9ca46d2843337b252ed1d9a")
                    .build();
            Response response = client.newCall(request).execute();
            return response;
        }
        return null;
    }
}
