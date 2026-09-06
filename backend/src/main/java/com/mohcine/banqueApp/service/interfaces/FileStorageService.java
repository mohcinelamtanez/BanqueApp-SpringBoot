package com.mohcine.banqueApp.service.interfaces;

import org.springframework.web.multipart.MultipartFile;

/**
 * Small storage abstraction so Client/profile logic never talks to the
 * filesystem (or any future object-storage provider) directly. Swapping
 * {@code LocalFileStorageService} for a cloud-backed implementation later
 * should never require touching the callers of this interface.
 *
 * @author USER
 **/
public interface FileStorageService {

    // Stores the file under the given sub-directory using a collision-safe
    // generated name and returns the reference/URL to persist (e.g. onto
    // Client.profilePhotoUrl) — never the raw bytes.
    String store(String subDirectory, MultipartFile file);

    // Best-effort deletion of a previously stored file, addressed by the
    // same reference returned from store(). Never throws — a stale file is
    // preferable to failing an otherwise-successful request over cleanup.
    void delete(String reference);
}
