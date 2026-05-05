// server/src/main/java/com/studentos/server/service/TaskService.java

package com.studentos.server.service;

import com.studentos.server.dto.TaskDTO;
import com.studentos.server.dto.TaskRequestDTO;
import com.studentos.server.entity.Target;
import com.studentos.server.entity.Task;
import com.studentos.server.entity.User;
import com.studentos.server.exception.ResourceNotFoundException;
import com.studentos.server.repository.TargetRepository;
import com.studentos.server.repository.TaskRepository;
import com.studentos.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TargetRepository targetRepository;

    public List<TaskDTO> getAllTasks(Long userId) {
        return taskRepository.findByUserIdOrderByDueDateAscDueTimeAsc(userId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<TaskDTO> getTodayTasks(Long userId) {
        return taskRepository.findByUserIdAndDueDateOrderByDueTimeAsc(userId, LocalDate.now())
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<TaskDTO> getUpcomingTasks(Long userId) {
        return taskRepository.findByUserIdAndDueDateAfterOrderByDueDateAsc(userId, LocalDate.now())
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<TaskDTO> getCompletedTasks(Long userId) {
        return taskRepository.findByUserIdAndCompletedOrderByDueDateAsc(userId, true)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public TaskDTO createTask(Long userId, TaskRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Target target = null;
        if (request.getTargetId() != null) {
            target = targetRepository.findById(request.getTargetId())
                    .orElse(null);
        }

        Task task = Task.builder()
                .user(user)
                .target(target)
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .dueDate(request.getDueDate())
                .dueTime(request.getDueTime())
                .completed(false)
                .build();

        return toDTO(taskRepository.save(task));
    }

    public TaskDTO updateTask(Long userId, Long taskId, TaskRequestDTO request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (!task.getUser().getId().equals(userId))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");

        Target target = null;
        if (request.getTargetId() != null) {
            target = targetRepository.findById(request.getTargetId()).orElse(null);
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());
        task.setDueTime(request.getDueTime());
        task.setTarget(target);

        return toDTO(taskRepository.save(task));
    }

    public TaskDTO toggleComplete(Long userId, Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (!task.getUser().getId().equals(userId))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");

        task.setCompleted(!task.getCompleted());
        return toDTO(taskRepository.save(task));
    }

    public void deleteTask(Long userId, Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (!task.getUser().getId().equals(userId))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");

        taskRepository.delete(task);
    }

    private TaskDTO toDTO(Task task) {
        return TaskDTO.builder()
                .id(task.getId())
                .targetId(task.getTarget() != null ? task.getTarget().getId() : null)
                .targetTitle(task.getTarget() != null ? task.getTarget().getTitle() : null)
                .title(task.getTitle())
                .description(task.getDescription())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .dueTime(task.getDueTime())
                .completed(task.getCompleted())
                .build();
    }
}