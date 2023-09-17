package com.watcix.taskbackend.repository;

import com.watcix.taskbackend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
    Task findByTitle(String title);

    Task findByTitleAndStatus(String taskTitle, boolean status);
}
