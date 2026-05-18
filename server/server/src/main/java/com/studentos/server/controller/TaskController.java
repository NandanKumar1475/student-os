package com.studentos.server.controller;

import com.studentos.server.dto.TaskDTO;
import com.studentos.server.dto.TaskRequestDTO;
import com.studentos.server.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<List<TaskDTO>> getAllTasks(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(taskService.getAllTasks(userDetails.getUsername()));
    }

    @GetMapping("/today")
    public ResponseEntity<List<TaskDTO>> getTodayTasks(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(taskService.getTodayTasks(userDetails.getUsername()));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<TaskDTO>> getUpcomingTasks(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(taskService.getUpcomingTasks(userDetails.getUsername()));
    }

    @GetMapping("/completed")
    public ResponseEntity<List<TaskDTO>> getCompletedTasks(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(taskService.getCompletedTasks(userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<TaskDTO> createTask(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody TaskRequestDTO request) {

        return ResponseEntity.ok(taskService.createTask(userDetails.getUsername(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> updateTask(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody TaskRequestDTO request) {

        return ResponseEntity.ok(taskService.updateTask(userDetails.getUsername(), id, request));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<TaskDTO> toggleComplete(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {

        return ResponseEntity.ok(taskService.toggleComplete(userDetails.getUsername(), id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {

        taskService.deleteTask(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
