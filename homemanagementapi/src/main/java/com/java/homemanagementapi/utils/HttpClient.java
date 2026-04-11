package com.java.homemanagementapi.utils;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class HttpClient {


    String apiEndpoint = "https://api.rentcast.io/v1/properties?address=";
    /**
     *
     * @throws Exception
     */
    public Response fetchPropertyData(String address) throws Exception {
        String url = apiEndpoint + address.replace(" ", "%20");
        if(true) {
            OkHttpClient client = new OkHttpClient();
            Request request = new Request.Builder()
//                    .url("https://api.rentcast.io/v1/properties?address=5500%20Grand%20Lake%20Dr%2C%20San%20Antonio%2C%20TX%2C%2078244")
                    .url(url)
                    .get()
                    .addHeader("accept", "application/json")
//                    .addHeader("X-Api-Key", "49859dead9ca46d2843337b252ed1d9a")
                    .addHeader("X-Api-Key", "6a87f3c98f754f63bf0fea873249ab58")
                    .build();
            Response response = client.newCall(request).execute();
            return response;
        }
        return null;
    }
}
