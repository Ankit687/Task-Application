package com.watcix.taskbackend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.util.Date;

@Entity
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String title;
    private String description;
    private Date createdDate;
    private Date endDate;
    private Boolean status = true;

    public Task() {
    }

    public Task(String title, String description, Date createdDate) {
        this.title = title;
        this.description = description;
        this.createdDate = createdDate;
    }

    public Task(Integer id, String title, String description, Date createdDate, Date endDate, boolean status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.createdDate = createdDate;
        this.endDate = endDate;
        this.status = status;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer taskId) {
        this.id = taskId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String taskTitle) {
        this.title = taskTitle;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String taskDescription) {
        this.description = taskDescription;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean taskStatus) {
        this.status = taskStatus;
    }

    @Override
    public String toString() {
        return "Task{" +
                "taskId=" + id +
                ", taskTitle='" + title + '\'' +
                ", taskDescription='" + description + '\'' +
                ", createdDate=" + createdDate +
                ", endDate=" + endDate +
                ", taskStatus=" + status +
                '}';
    }
}
