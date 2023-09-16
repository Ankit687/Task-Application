package com.watcix.taskbackend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.watcix.taskbackend.model.Task;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class TaskResponseDto {
    private String status;
    private Task task;

    public TaskResponseDto() {
    }

    public TaskResponseDto(String status) {
        this.status = status;
    }

    public TaskResponseDto(String status, Task task) {
        this.status = status;
        this.task = task;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    @Override
    public String toString() {
        return "TaskResponseDto{" +
                "status='" + status + '\'' +
                ", task=" + task +
                '}';
    }
}
