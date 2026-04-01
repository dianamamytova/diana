package com.diana.coffee.controller;

import com.diana.coffee.service.QrCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/qr")
@RequiredArgsConstructor
public class QrCodeController {

    private final QrCodeService qrCodeService;

    @GetMapping(value = "/table/{tableId}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> generateTableQrCode(@PathVariable Long tableId) {
        byte[] image = qrCodeService.generateTableQrCode(tableId);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(image);
    }

    @GetMapping(value = "/branch/{branchId}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> generateBranchQrCode(@PathVariable Long branchId) {
        byte[] image = qrCodeService.generateBranchQrCode(branchId);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(image);
    }

    @GetMapping(value = "/review/{branchId}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> generateReviewQrCode(@PathVariable Long branchId) {
        byte[] image = qrCodeService.generateReviewQrCode(branchId);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(image);
    }
}
