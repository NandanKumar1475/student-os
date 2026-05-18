// server/src/main/java/com/studentos/server/service/TaskService.java

package com.studentos.server.service;

import com.studentos.server.dto.TaskDTO;
import com.studentos.server.dto.TaskRequestDTO;
import com.studentos.server.entity.Target;
import com.studentos.server.entity.Task;
import com.studentos.server.entity.User;
import com.studentos.server.enums.Priority;
import com.studentos.server.exception.BadRequestException;
import com.studentos.server.exception.ResourceNotFoundException;
import com.studentos.server.repository.TargetRepository;
import com.studentos.server.repository.TaskRepository;
import com.studentos.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TargetRepository targetRepository;

    @Transactional(readOnly = true)
    public List<TaskDTO> getAllTasks(String email) {
        Long userId = getUserByEmail(email).getId();
        return taskRepository.findByUserIdOrderByDueDateAscDueTimeAsc(userId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskDTO> getTodayTasks(String email) {
        Long userId = getUserByEmail(email).getId();
        return taskRepository.findByUserIdAndDueDateOrderByDueTimeAsc(userId, LocalDate.now())
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskDTO> getUpcomingTasks(String email) {
        Long userId = getUserByEmail(email).getId();
        return taskRepository.findByUserIdAndDueDateAfterOrderByDueDateAsc(userId, LocalDate.now())
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskDTO> getCompletedTasks(String email) {
        Long userId = getUserByEmail(email).getId();
        return taskRepository.findByUserIdAndCompletedOrderByDueDateAsc(userId, true)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public TaskDTO createTask(String email, TaskRequestDTO request) {
        User user = getUserByEmail(email);
        validateTitle(request.getTitle());

        Target target = null;
        if (request.getTargetId() != null) {
            target = targetRepository.findByIdAndUserId(request.getTargetId(), user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Target not found"));
        }

        Task task = Task.builder()
                .user(user)
                .target(target)
                .title(request.getTitle().trim())
                .description(request.getDescription())
                .priority(request.getPriority() != null ? request.getPriority() : Priority.MEDIUM)
                .dueDate(request.getDueDate())
                .dueTime(request.getDueTime())
                .completed(false)
                .build();

        return toDTO(taskRepository.save(task));
    }

    @Transactional
    public TaskDTO updateTask(String email, Long taskId, TaskRequestDTO request) {
        User user = getUserByEmail(email);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Task not found");
        }

        Target target = null;
        if (request.getTargetId() != null) {
            target = targetRepository.findByIdAndUserId(request.getTargetId(), user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Target not found"));
        }

        if (request.getTitle() != null) {
            validateTitle(request.getTitle());
            task.setTitle(request.getTitle().trim());
        }
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority() != null ? request.getPriority() : task.getPriority());
        task.setDueDate(request.getDueDate());
        task.setDueTime(request.getDueTime());
        task.setTarget(target);

        return toDTO(taskRepository.save(task));
    }

    @Transactional
    public TaskDTO toggleComplete(String email, Long taskId) {
        User user = getUserByEmail(email);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Task not found");
        }

        task.setCompleted(!Boolean.TRUE.equals(task.getCompleted()));
        return toDTO(taskRepository.save(task));
    }

    @Transactional
    public void deleteTask(String email, Long taskId) {
        User user = getUserByEmail(email);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Task not found");
        }

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

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private void validateTitle(String title) {
        if (title == null || title.trim().isBlank()) {
            throw new BadRequestException("Task title is required");
        }
    }
}
