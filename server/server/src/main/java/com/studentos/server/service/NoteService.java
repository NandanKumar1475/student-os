package com.studentos.server.service;

// server/src/main/java/com/studentos/server/service/NoteService.java


import com.studentos.server.dto.NoteDTO;
import com.studentos.server.dto.NoteRequestDTO;
import com.studentos.server.entity.Note;
import com.studentos.server.entity.User;
import com.studentos.server.exception.ResourceNotFoundException;
import com.studentos.server.repository.NoteRepository;
import com.studentos.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    public List<NoteDTO> getAllNotes(Long userId) {
        return noteRepository.findByUserIdOrderByPinnedDescUpdatedAtDesc(userId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public NoteDTO getNoteById(Long userId, Long noteId) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));
        if (!note.getUser().getId().equals(userId))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        return toDTO(note);
    }

    public List<NoteDTO> searchNotes(Long userId, String query) {
        return noteRepository.searchNotes(userId, query)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<NoteDTO> getNotesByTag(Long userId, String tag) {
        return noteRepository.findByUserIdAndTag(userId, tag)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<String> getAllTags(Long userId) {
        return noteRepository.findAllTagsByUserId(userId);
    }

    public NoteDTO createNote(Long userId, NoteRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Note note = Note.builder()
                .user(user)
                .title(request.getTitle())
                .content(request.getContent())
                .tags(request.getTags() != null ? request.getTags() : new ArrayList<>())
                .pinned(false)
                .build();

        return toDTO(noteRepository.save(note));
    }

    public NoteDTO updateNote(Long userId, Long noteId, NoteRequestDTO request) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));

        if (!note.getUser().getId().equals(userId))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");

        note.setTitle(request.getTitle());
        note.setContent(request.getContent());
        note.setTags(request.getTags() != null ? request.getTags() : new ArrayList<>());

        return toDTO(noteRepository.save(note));
    }

    public NoteDTO togglePin(Long userId, Long noteId) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));

        if (!note.getUser().getId().equals(userId))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");

        note.setPinned(!note.getPinned());
        return toDTO(noteRepository.save(note));
    }

    public void deleteNote(Long userId, Long noteId) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));

        if (!note.getUser().getId().equals(userId))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");

        noteRepository.delete(note);
    }

    private NoteDTO toDTO(Note note) {
        return NoteDTO.builder()
                .id(note.getId())
                .title(note.getTitle())
                .content(note.getContent())
                .preview(note.getPreview())
                .tags(note.getTags())
                .pinned(note.getPinned())
                .createdAt(note.getCreatedAt())
                .updatedAt(note.getUpdatedAt())
                .build();
    }
}
