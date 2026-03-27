package com.java.homemanagementapi.service;

import io.nayuki.qrcodegen.QrCode;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class BarcodeService {

    public byte[] generateQrCode(String text) throws IOException {
        QrCode qr = QrCode.encodeText(text, QrCode.Ecc.MEDIUM);
        BufferedImage image = toImage(qr, 10, 4);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(image, "png", baos);
        return baos.toByteArray();
    }

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
