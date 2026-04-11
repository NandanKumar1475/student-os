package com.studentos.server.controller;

import com.studentos.server.dto.TaskDTO;
import com.studentos.server.dto.TaskRequestDTO;
import com.studentos.server.security.UserPrincipal;
import com.studentos.server.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<List<TaskDTO>> getAllTasks(
            @AuthenticationPrincipal UserPrincipal user) {

        return ResponseEntity.ok(taskService.getAllTasks(user.getId()));
    }

    @GetMapping("/today")
    public ResponseEntity<List<TaskDTO>> getTodayTasks(
            @AuthenticationPrincipal UserPrincipal user) {

        return ResponseEntity.ok(taskService.getTodayTasks(user.getId()));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<TaskDTO>> getUpcomingTasks(
            @AuthenticationPrincipal UserPrincipal user) {

        return ResponseEntity.ok(taskService.getUpcomingTasks(user.getId()));
    }

    @GetMapping("/completed")
    public ResponseEntity<List<TaskDTO>> getCompletedTasks(
            @AuthenticationPrincipal UserPrincipal user) {

        return ResponseEntity.ok(taskService.getCompletedTasks(user.getId()));
    }

    @PostMapping
    public ResponseEntity<TaskDTO> createTask(
            @AuthenticationPrincipal UserPrincipal user,
            @RequestBody TaskRequestDTO request) {

        return ResponseEntity.ok(taskService.createTask(user.getId(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> updateTask(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable Long id,
            @RequestBody TaskRequestDTO request) {

        return ResponseEntity.ok(taskService.updateTask(user.getId(), id, request));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<TaskDTO> toggleComplete(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable Long id) {

        return ResponseEntity.ok(taskService.toggleComplete(user.getId(), id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable Long id) {

        taskService.deleteTask(user.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
