package com.diana.coffee.dto.request;

import com.diana.coffee.model.enums.ReservationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationStatusRequest {

    @NotNull
    private ReservationStatus status;
}
