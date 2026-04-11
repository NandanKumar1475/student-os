package com.studentos.server.controller;
import com.studentos.server.dto.NoteDTO;
import com.studentos.server.dto.NoteRequestDTO;
import com.studentos.server.security.UserPrincipal;
import com.studentos.server.service.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    // ✅ Get all notes
    @GetMapping
    public ResponseEntity<List<NoteDTO>> getAllNotes(
            @AuthenticationPrincipal UserPrincipal user) {

        Long userId = user.getId(); // cleaner
        return ResponseEntity.ok(noteService.getAllNotes(userId));
    }

    // ✅ Get single note
    @GetMapping("/{id}")
    public ResponseEntity<NoteDTO> getNote(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable Long id) {

        Long userId = user.getId();
        return ResponseEntity.ok(noteService.getNoteById(userId, id));
    }

    // ✅ Search notes
    @GetMapping("/search")
    public ResponseEntity<List<NoteDTO>> searchNotes(
            @AuthenticationPrincipal UserPrincipal user,
            @RequestParam String query) {

        Long userId = user.getId();
        return ResponseEntity.ok(noteService.searchNotes(userId, query));
    }

    // ✅ Notes by tag
    @GetMapping("/tag/{tag}")
    public ResponseEntity<List<NoteDTO>> getNotesByTag(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String tag) {

        Long userId = user.getId();
        return ResponseEntity.ok(noteService.getNotesByTag(userId, tag));
    }

    // ✅ Get all tags
    @GetMapping("/tags")
    public ResponseEntity<List<String>> getAllTags(
            @AuthenticationPrincipal UserPrincipal user) {

        Long userId = user.getId();
        return ResponseEntity.ok(noteService.getAllTags(userId));
    }

    // ✅ Create note
    @PostMapping
    public ResponseEntity<NoteDTO> createNote(
            @AuthenticationPrincipal UserPrincipal user,
            @RequestBody NoteRequestDTO request) {

        Long userId = user.getId();
        return ResponseEntity.ok(noteService.createNote(userId, request));
    }

    // ✅ Update note
    @PutMapping("/{id}")
    public ResponseEntity<NoteDTO> updateNote(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable Long id,
            @RequestBody NoteRequestDTO request) {

        Long userId = user.getId();
        return ResponseEntity.ok(noteService.updateNote(userId, id, request));
    }

    // ✅ Toggle pin
    @PatchMapping("/{id}/pin")
    public ResponseEntity<NoteDTO> togglePin(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable Long id) {

        Long userId = user.getId();
        return ResponseEntity.ok(noteService.togglePin(userId, id));
    }

    // ✅ Delete note
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable Long id) {

        Long userId = user.getId();
        noteService.deleteNote(userId, id);
        return ResponseEntity.noContent().build();
    }
}
