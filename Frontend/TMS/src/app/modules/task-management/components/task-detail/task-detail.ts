import { Component, OnInit } from '@angular/core';
import { Task, Comment } from '../../../../core/models';
import { ActivatedRoute } from '@angular/router';
import {TaskService} from '../../../../core/services/task.service';
import {FormsModule} from '@angular/forms';
import {CommentListComponent} from '../comment-list/comment-list';
import {DatePipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.html',
  imports: [
    FormsModule,
    CommentListComponent,
    NgIf,
    DatePipe
  ],
  styleUrls: ['./task-detail.scss']
})
export class TaskDetailComponent implements OnInit {
  task?: Task;
  comments: Comment[] = [];
  newComment: string = '';

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

  addComment() {
    if (!this.newComment.trim() || !this.task) return;

    this.taskService.addComment(this.task.id, { content: this.newComment }).subscribe(comment => {
      this.comments.push(comment);
      this.newComment = '';
    });
  }

}
