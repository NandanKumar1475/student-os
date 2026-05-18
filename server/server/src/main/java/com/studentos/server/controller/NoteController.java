package com.studentos.server.controller;
import com.studentos.server.dto.NoteDTO;
import com.studentos.server.dto.NoteRequestDTO;
import com.studentos.server.service.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(noteService.getAllNotes(userDetails.getUsername()));
    }

    // ✅ Get single note
    @GetMapping("/{id}")
    public ResponseEntity<NoteDTO> getNote(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {

        return ResponseEntity.ok(noteService.getNoteById(userDetails.getUsername(), id));
    }

    // ✅ Search notes
    @GetMapping("/search")
    public ResponseEntity<List<NoteDTO>> searchNotes(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String query) {

        return ResponseEntity.ok(noteService.searchNotes(userDetails.getUsername(), query));
    }

    // ✅ Notes by tag
    @GetMapping("/tag/{tag}")
    public ResponseEntity<List<NoteDTO>> getNotesByTag(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String tag) {

        return ResponseEntity.ok(noteService.getNotesByTag(userDetails.getUsername(), tag));
    }

    // ✅ Get all tags
    @GetMapping("/tags")
    public ResponseEntity<List<String>> getAllTags(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(noteService.getAllTags(userDetails.getUsername()));
    }

    // ✅ Create note
    @PostMapping
    public ResponseEntity<NoteDTO> createNote(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody NoteRequestDTO request) {

        return ResponseEntity.ok(noteService.createNote(userDetails.getUsername(), request));
    }

    // ✅ Update note
    @PutMapping("/{id}")
    public ResponseEntity<NoteDTO> updateNote(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody NoteRequestDTO request) {

        return ResponseEntity.ok(noteService.updateNote(userDetails.getUsername(), id, request));
    }

    // ✅ Toggle pin
    @PatchMapping("/{id}/pin")
    public ResponseEntity<NoteDTO> togglePin(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {

        return ResponseEntity.ok(noteService.togglePin(userDetails.getUsername(), id));
    }

    // ✅ Delete note
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {

        noteService.deleteNote(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
