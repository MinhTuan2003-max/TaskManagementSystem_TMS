import { Component, OnInit } from '@angular/core';
import { Task, Comment } from '../../../../core/models';
import { ActivatedRoute } from '@angular/router';
import {TaskService} from '../../../../core/services/task.service';

@Component({
  selector: 'app-view-task-page',
  templateUrl: './view-task.html'
})
export class ViewTaskPage implements OnInit {
  task?: Task;
  comments: Comment[] = [];
  newComment = '';

  constructor(private taskService: TaskService, private route: ActivatedRoute) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.loadTask(id);
    this.loadComments(id);
  }

  loadTask(id: number) {
    this.taskService.getTask(id).subscribe(task => this.task = task);
  }

  loadComments(taskId: number) {
    this.taskService.getCommentsByTask(taskId).subscribe(comments => this.comments = comments);
  }

  onAddComment() {
    if (!this.newComment.trim()) return;
    if (!this.task) return;

    this.taskService.addComment(this.task.id, {content: this.newComment}).subscribe(comment => {
      this.comments.push(comment);
      this.newComment = '';
    });
  }
}
