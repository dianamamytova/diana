package com.diana.coffee.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TableRequest {

    @NotNull
    private Integer tableNumber;

    @NotNull
    @Min(1)
    private Integer capacity;

    @NotNull
    private Long branchId;
}
