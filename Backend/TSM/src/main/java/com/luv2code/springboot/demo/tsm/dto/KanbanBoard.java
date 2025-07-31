package com.luv2code.springboot.demo.tsm.dto;

import com.luv2code.springboot.demo.tsm.entity.Task;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class KanbanBoard {

    private List<Task> todoTasks;
    private List<Task> inProgressTasks;
    private List<Task> reviewTasks;
    private List<Task> doneTasks;

    // Constructors
    public KanbanBoard() {}

    public KanbanBoard(List<Task> todoTasks, List<Task> inProgressTasks,
                       List<Task> reviewTasks, List<Task> doneTasks) {
        this.todoTasks = todoTasks;
        this.inProgressTasks = inProgressTasks;
        this.reviewTasks = reviewTasks;
        this.doneTasks = doneTasks;
    }

}
