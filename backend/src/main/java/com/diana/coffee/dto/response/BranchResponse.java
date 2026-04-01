package com.diana.coffee.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BranchResponse {

    private Long id;
    private String name;
    private String address;
    private String city;
    private String phone;
    private String description;
    private String imageUrl;
    private boolean isActive;
}
