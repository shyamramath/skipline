package com.java.homemanagementapi.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.Map;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.mail.from-name:Home Management}")
    private String fromName;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Send a simple text email
     */
    public void sendSimpleEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    /**
     * Send a simple text email to multiple recipients
     */
    public void sendSimpleEmail(String[] to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    /**
     * Send an HTML email
     */
    public void sendHtmlEmail(String to, String subject, String htmlBody) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody, true);

        mailSender.send(message);
    }

    /**
     * Send an HTML email to multiple recipients
     */
    public void sendHtmlEmail(String[] to, String subject, String htmlBody) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody, true);

        mailSender.send(message);
    }

    /**
     * Send an HTML email with CC and BCC
     */
    public void sendHtmlEmail(String to, String[] cc, String[] bcc, String subject, String htmlBody)
            throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        if (cc != null && cc.length > 0) {
            helper.setCc(cc);
        }
        if (bcc != null && bcc.length > 0) {
            helper.setBcc(bcc);
        }
        helper.setSubject(subject);
        helper.setText(htmlBody, true);

        mailSender.send(message);
    }

    /**
     * Send an email with file attachment
     */
    public void sendEmailWithAttachment(String to, String subject, String body, File attachment)
            throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body, false);

        FileSystemResource file = new FileSystemResource(attachment);
        helper.addAttachment(attachment.getName(), file);

        mailSender.send(message);
    }

    /**
     * Send an HTML email with file attachment
     */
    public void sendHtmlEmailWithAttachment(String to, String subject, String htmlBody, File attachment)
            throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody, true);

        FileSystemResource file = new FileSystemResource(attachment);
        helper.addAttachment(attachment.getName(), file);

        mailSender.send(message);
    }

    /**
     * Send an email with byte array attachment (useful for generated PDFs, etc.)
     */
    public void sendEmailWithAttachment(String to, String subject, String body,
                                        byte[] attachmentData, String attachmentName)
            throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body, false);

        helper.addAttachment(attachmentName, new ByteArrayResource(attachmentData));

        mailSender.send(message);
    }

    /**
     * Send an HTML email with multiple attachments
     */
    public void sendHtmlEmailWithAttachments(String to, String subject, String htmlBody,
                                             Map<String, byte[]> attachments)
            throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody, true);

        for (Map.Entry<String, byte[]> entry : attachments.entrySet()) {
            helper.addAttachment(entry.getKey(), new ByteArrayResource(entry.getValue()));
        }

        mailSender.send(message);
    }

    /**
     * Send an HTML email with inline images
     */
    public void sendHtmlEmailWithInlineImage(String to, String subject, String htmlBody,
                                             String imageId, byte[] imageData, String contentType)
            throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody, true);

        helper.addInline(imageId, new ByteArrayResource(imageData), contentType);

        mailSender.send(message);
    }

    /**
     * Send email asynchronously (non-blocking)
     */
    @Async
    public void sendSimpleEmailAsync(String to, String subject, String body) {
        sendSimpleEmail(to, subject, body);
    }

    /**
     * Send HTML email asynchronously (non-blocking)
     */
    @Async
    public void sendHtmlEmailAsync(String to, String subject, String htmlBody) throws MessagingException {
        sendHtmlEmail(to, subject, htmlBody);
    }
}
