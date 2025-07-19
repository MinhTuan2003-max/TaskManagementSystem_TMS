package com.luv2code.springboot.demo.tsm.dto.response;

import lombok.Data;

@Data
public class ProjectStatsResponse {
    private int totalTasks;
    private int completedTasks;
    private int inProgressTasks;
    private int overdueTasks;
    private int activeMembers;

    public ProjectStatsResponse(int totalTasks, int completedTasks,
                                int inProgressTasks, int overdueTasks, int activeMembers) {
        this.totalTasks = totalTasks;
        this.completedTasks = completedTasks;
        this.inProgressTasks = inProgressTasks;
        this.overdueTasks = overdueTasks;
        this.activeMembers = activeMembers;
    }
}
