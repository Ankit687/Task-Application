package com.watcix.taskbackend.controller;

import com.watcix.taskbackend.dto.TaskDto;
import com.watcix.taskbackend.dto.TaskResponseDto;
import com.watcix.taskbackend.model.Task;
import com.watcix.taskbackend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TaskController {

    @Autowired
    private TaskService taskService;

    @CrossOrigin(origins = "http://127.0.0.1:5500")
    @PostMapping("createTask")
    public ResponseEntity<TaskResponseDto> createTask (@RequestBody TaskDto taskDto) {
        String message = taskService.validateTaskRequest(taskDto);
        if (!StringUtils.hasText(message)) {
            Task task = taskService.createTask(taskDto);
            if (!ObjectUtils.isEmpty(task)) {
                return new ResponseEntity<>(new TaskResponseDto("Task Created Successfully", task), HttpStatus.OK);
            }
            return new ResponseEntity<>(new TaskResponseDto("Unable to create task"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        else {
            return new ResponseEntity<>(new TaskResponseDto(message), HttpStatus.OK);
        }
    }

    @CrossOrigin(origins = "http://127.0.0.1:5500")
    @GetMapping("getTask/{title}")
    public ResponseEntity<?> getTaskByTitle(@PathVariable String title) {
        Task task = taskService.getTaskByTitle(title);
        if (ObjectUtils.isEmpty(task))
            return new ResponseEntity<>(new TaskResponseDto("task is not present"), HttpStatus.INTERNAL_SERVER_ERROR);
        else
            return new ResponseEntity<>(task, HttpStatus.OK);
    }

    @CrossOrigin(origins = "http://127.0.0.1:5500")
    @GetMapping("getTaskList")
    public ResponseEntity<List<Task>> getTaskByTitle() {
        List<Task> taskList = taskService.getTaskList();
        return new ResponseEntity<>(taskList, HttpStatus.OK);
    }

    @CrossOrigin(origins = "http://127.0.0.1:5500")
    @PostMapping("deleteTask/{id}")
    public ResponseEntity<?> deleteTaskById(@PathVariable int id) {
        return new ResponseEntity<>(new TaskResponseDto(taskService.deleteTaskById(id)), HttpStatus.OK);
    }

    @CrossOrigin(origins = "http://127.0.0.1:5500")
    @PostMapping("completedTask/{id}")
    public ResponseEntity<TaskResponseDto> completedTaskById(@PathVariable int id) {
        Task task = taskService.completedTask(id);
        if (ObjectUtils.isEmpty(task))
            return new ResponseEntity<>(new TaskResponseDto("Id not found"), HttpStatus.OK);
        return new ResponseEntity<>(new TaskResponseDto("Updated Task Successfully", task), HttpStatus.OK);
    }
}
