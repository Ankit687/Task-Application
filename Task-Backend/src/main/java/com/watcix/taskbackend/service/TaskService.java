package com.watcix.taskbackend.service;

import com.watcix.taskbackend.dto.TaskDto;
import com.watcix.taskbackend.model.Task;
import com.watcix.taskbackend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public String validateTaskRequest(TaskDto taskDto) {
        StringBuilder message = new StringBuilder();
        if (ObjectUtils.isEmpty(taskDto)) {
            return "Invalid request";
        }
        if (!StringUtils.hasText(taskDto.getTaskTitle())) {
            message.append("title ");
        }
        if (!StringUtils.hasText(taskDto.getTaskDescription())) {
            if (StringUtils.hasText(message))
                message.append("and ");
            message.append("description ");
        }
        if (StringUtils.hasText(message)) {
            message.append("can not be empty");
            return message.toString();
        }
        return null;
    }

    public Task createTask(TaskDto taskDto) {
        Task task = null;
        if (taskDto.getId() != null) {
            Optional<Task> taskOp = taskRepository.findById(taskDto.getId());
            if (taskOp.isPresent()) {
                task = taskOp.get();
                task.setTitle(taskDto.getTaskTitle());
                task.setDescription(taskDto.getTaskDescription());
            }
        }
        else
            task = new Task(taskDto.getTaskTitle(), taskDto.getTaskDescription(), new Date());
        if (ObjectUtils.isEmpty(task))
            return null;
        else
            return taskRepository.save(task);
    }

    public Task getTaskByTitle(String title) {
        return taskRepository.findByTitle(title);
    }

    public List<Task> getTaskList() {
        return taskRepository.findAll();
    }

    public String deleteTaskById(int id) {
        taskRepository.deleteById(id);
        return "Deleted Successfully";
    }

    public Task completedTask(int id) {
        Optional<Task> taskOptional = taskRepository.findById(id);
        if (taskOptional.isPresent()) {
            Task task = taskOptional.get();
            if (task.getStatus()) {
                task.setEndDate(new Date());
                task.setStatus(false);
            } else {
                task.setEndDate(null);
                task.setStatus(true);
            }
            return taskRepository.save(task);
        }
        return null;
    }
}
