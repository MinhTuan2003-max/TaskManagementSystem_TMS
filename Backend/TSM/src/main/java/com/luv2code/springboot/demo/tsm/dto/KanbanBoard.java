package com.luv2code.springboot.demo.tsm.dto;

import com.luv2code.springboot.demo.tsm.entity.Task;

import java.util.List;

public class KanbanBoard {

    private List<Task> todoTasks;
    private List<Task> inProgressTasks;
    private List<Task> doneTasks;

    // Constructors
    public KanbanBoard() {}

    public KanbanBoard(List<Task> todoTasks, List<Task> inProgressTasks, List<Task> doneTasks) {
        this.todoTasks = todoTasks;
        this.inProgressTasks = inProgressTasks;
        this.doneTasks = doneTasks;
    }

    // Getters and Setters
    public List<Task> getTodoTasks() { return todoTasks; }
    public void setTodoTasks(List<Task> todoTasks) { this.todoTasks = todoTasks; }

    public List<Task> getInProgressTasks() { return inProgressTasks; }
    public void setInProgressTasks(List<Task> inProgressTasks) { this.inProgressTasks = inProgressTasks; }

    public List<Task> getDoneTasks() { return doneTasks; }
    public void setDoneTasks(List<Task> doneTasks) { this.doneTasks = doneTasks; }
}
