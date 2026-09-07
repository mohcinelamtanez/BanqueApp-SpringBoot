package com.mohcine.banqueApp.service.impl;

import com.mohcine.banqueApp.exception.StorageException;
import com.mohcine.banqueApp.service.interfaces.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

/**
 * Server-side filesystem storage for uploaded files (currently just Client
 * profile photos). Every reference this hands out is a String path under
 * {@link #PUBLIC_PREFIX}, served back out by the matching static resource
 * handler in {@code WebConfig} — never a local client filesystem path, and
 * never the raw bytes stored on the Client entity itself.
 * <p>
 * This is a small, self-contained abstraction specifically so a future
 * cloud/object-storage-backed implementation of {@link FileStorageService}
 * can replace this one without any change to the Client service that calls
 * it.
 *
 * @author USER
 **/
@Service
public class LocalFileStorageService implements FileStorageService {

    // Matches the "/api/uploads/**" resource handler mapping in WebConfig —
    // this is what the frontend actually requests (through the same /api
    // proxy/prefix every other endpoint already goes through), not a raw
    // filesystem path.
    private static final String PUBLIC_PREFIX = "/uploads/";

    private final Path rootDirectory;

    public LocalFileStorageService(@Value("${app.upload.dir:uploads}") String uploadDir) {
        this.rootDirectory = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(rootDirectory);
        } catch (IOException e) {
            throw new StorageException("Could not initialize upload storage directory", e);
        }
    }

    @Override
    public String store(String subDirectory, MultipartFile file) {
        Path targetDirectory = resolveWithinRoot(subDirectory);
        String filename = UUID.randomUUID() + extensionOf(file.getOriginalFilename());
        try {
            Files.createDirectories(targetDirectory);
            file.transferTo(targetDirectory.resolve(filename));
        } catch (IOException e) {
            throw new StorageException("Failed to store uploaded file", e);
        }
        return PUBLIC_PREFIX + subDirectory.replace('\\', '/') + "/" + filename;
    }

    @Override
    public void delete(String reference) {
        if (reference == null || !reference.startsWith(PUBLIC_PREFIX)) {
            return;
        }
        Path target = rootDirectory.resolve(reference.substring(PUBLIC_PREFIX.length())).normalize();
        if (!target.startsWith(rootDirectory)) {
            return;
        }
        try {
            Files.deleteIfExists(target);
        } catch (IOException ignored) {
            // Best-effort cleanup only — an orphaned file is harmless and
            // must never fail an otherwise-successful profile update.
        }
    }

    // Guards against a sub-directory value ever escaping the upload root
    // (e.g. via "..") — defense in depth, even though callers only ever
    // pass a clientReference-derived path today.
    private Path resolveWithinRoot(String subDirectory) {
        Path resolved = rootDirectory.resolve(subDirectory).normalize();
        if (!resolved.startsWith(rootDirectory)) {
            throw new StorageException("Invalid storage path", null);
        }
        return resolved;
    }

    private String extensionOf(String originalFilename) {
        if (originalFilename == null) return "";
        int dot = originalFilename.lastIndexOf('.');
        return dot >= 0 ? originalFilename.substring(dot).toLowerCase() : "";
    }
}
