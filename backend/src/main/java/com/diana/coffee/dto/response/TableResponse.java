package com.diana.coffee.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TableResponse {

    private Long id;
    private int tableNumber;
    private int capacity;
    private Long branchId;
    private String branchName;
    private boolean isAvailable;
}
