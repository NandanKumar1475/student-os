package com.studentos.server.service;

// server/src/main/java/com/studentos/server/service/NoteService.java


import com.studentos.server.dto.NoteDTO;
import com.studentos.server.dto.NoteRequestDTO;
import com.studentos.server.entity.Note;
import com.studentos.server.entity.User;
import com.studentos.server.exception.BadRequestException;
import com.studentos.server.exception.ResourceNotFoundException;
import com.studentos.server.repository.NoteRepository;
import com.studentos.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<NoteDTO> getAllNotes(String email) {
        Long userId = getUserByEmail(email).getId();
        return noteRepository.findByUserIdOrderByPinnedDescUpdatedAtDesc(userId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public NoteDTO getNoteById(String email, Long noteId) {
        Long userId = getUserByEmail(email).getId();
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));
        if (!note.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Note not found");
        }
        return toDTO(note);
    }

    @Transactional(readOnly = true)
    public List<NoteDTO> searchNotes(String email, String query) {
        Long userId = getUserByEmail(email).getId();
        return noteRepository.searchNotes(userId, query)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<NoteDTO> getNotesByTag(String email, String tag) {
        Long userId = getUserByEmail(email).getId();
        return noteRepository.findByUserIdAndTag(userId, tag)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<String> getAllTags(String email) {
        Long userId = getUserByEmail(email).getId();
        return noteRepository.findAllTagsByUserId(userId);
    }

    @Transactional
    public NoteDTO createNote(String email, NoteRequestDTO request) {
        User user = getUserByEmail(email);
        validateTitle(request.getTitle());

        Note note = Note.builder()
                .user(user)
                .title(request.getTitle().trim())
                .content(request.getContent() != null ? request.getContent() : "")
                .tags(request.getTags() != null ? request.getTags() : new ArrayList<>())
                .pinned(false)
                .build();

        return toDTO(noteRepository.save(note));
    }

    @Transactional
    public NoteDTO updateNote(String email, Long noteId, NoteRequestDTO request) {
        Long userId = getUserByEmail(email).getId();
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));

        if (!note.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Note not found");
        }

        if (request.getTitle() != null) {
            validateTitle(request.getTitle());
            note.setTitle(request.getTitle().trim());
        }
        note.setContent(request.getContent() != null ? request.getContent() : "");
        note.setTags(request.getTags() != null ? request.getTags() : new ArrayList<>());

        return toDTO(noteRepository.save(note));
    }

    @Transactional
    public NoteDTO togglePin(String email, Long noteId) {
        Long userId = getUserByEmail(email).getId();
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));

        if (!note.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Note not found");
        }

        note.setPinned(!Boolean.TRUE.equals(note.getPinned()));
        return toDTO(noteRepository.save(note));
    }

    @Transactional
    public void deleteNote(String email, Long noteId) {
        Long userId = getUserByEmail(email).getId();
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));

        if (!note.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Note not found");
        }

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

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private void validateTitle(String title) {
        if (title == null || title.trim().isBlank()) {
            throw new BadRequestException("Note title is required");
        }
    }
}
