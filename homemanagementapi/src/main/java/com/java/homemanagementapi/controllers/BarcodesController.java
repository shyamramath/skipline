package com.java.homemanagementapi.controllers;

import io.nayuki.qrcodegen.QrCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.awt.image.BufferedImage;

@RestController
@RequestMapping("/barcodes")
public class BarcodesController {

    /**
     *
     * @param text
     * @return
     */
    @GetMapping(value = "/home/{barcode}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<BufferedImage> generateQrCode(@PathVariable("barcode") String text) {
        QrCode qr = QrCode.encodeText(text, QrCode.Ecc.MEDIUM);
        BufferedImage image = toImage(qr, 10, 4);
        return ResponseEntity.ok(image);
    }

    /**
     *
     * @param qr
     * @param scale
     * @param border
     * @return
     */
    private BufferedImage toImage(QrCode qr, int scale, int border) {
        int size = qr.size + border * 2;
        BufferedImage image = new BufferedImage(size * scale, size * scale, BufferedImage.TYPE_INT_RGB);

        for (int y = 0; y < size * scale; y++) {
            for (int x = 0; x < size * scale; x++) {
                int moduleX = x / scale - border;
                int moduleY = y / scale - border;
                boolean isBlack = moduleX >= 0 && moduleX < qr.size &&
                                  moduleY >= 0 && moduleY < qr.size &&
                                  qr.getModule(moduleX, moduleY);
                image.setRGB(x, y, isBlack ? 0x000000 : 0xFFFFFF);
            }
        }
        return image;
    }
}
