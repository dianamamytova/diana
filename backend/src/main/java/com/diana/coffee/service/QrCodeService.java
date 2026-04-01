package com.diana.coffee.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class QrCodeService {

    public byte[] generateQrCode(String content, int width, int height) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(content, BarcodeFormat.QR_CODE, width, height);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            return outputStream.toByteArray();
        } catch (WriterException | IOException e) {
            throw new RuntimeException("Failed to generate QR code", e);
        }
    }

    public byte[] generateTableQrCode(Long tableId) {
        String url = "http://localhost:3000/menu?table=" + tableId;
        return generateQrCode(url, 300, 300);
    }

    public byte[] generateBranchQrCode(Long branchId) {
        String url = "http://localhost:3000/branch/" + branchId;
        return generateQrCode(url, 300, 300);
    }

    public byte[] generateReviewQrCode(Long branchId) {
        String url = "http://localhost:3000/review?branch=" + branchId;
        return generateQrCode(url, 300, 300);
    }
}
