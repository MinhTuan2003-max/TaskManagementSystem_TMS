import { Component, OnInit } from '@angular/core';
import { Task, Comment } from '../../../../core/models';
import {ActivatedRoute, Router} from '@angular/router';
import {TaskService} from '../../../../core/services/task.service';
import {AuthService} from '../../../../core/services/auth.service';
import {DatePipe, NgIf} from '@angular/common';
import {CommentListComponent} from '../../components/comment-list/comment-list';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.html',
  styleUrls: ['./view-task.scss'],
  imports: [
    NgIf,
    CommentListComponent,
    FormsModule,
    DatePipe
  ]
})
export class ViewTaskPage implements OnInit {
  task?: Task;
  comments: Comment[] = [];
  newComment = '';

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.loadTask(id);
    this.loadComments(id);
  }

  loadTask(id: number) {
    this.taskService.getTask(id).subscribe({
      next: (task) => (this.task = task),
      error: (err) => console.error(err),
    });
  }

  loadComments(id: number) {
    this.taskService.getCommentsByTask(id).subscribe({
      next: (comments) => (this.comments = comments),
      error: (err) => console.error(err),
    });
  }

  addComment() {
    if (!this.newComment.trim() || !this.task) {
      return;
    }
    this.taskService.addComment(this.task.id, { content: this.newComment })
      .subscribe({
      next: (comment) => {
        this.comments.push(comment);
        this.newComment = '';
      },
      error: (err) => console.error(err),
    });
  }

  canEdit(): boolean {
    // Example permission based on roles
    return this.authService.hasAnyRole(['ROLE_MANAGER', 'ROLE_ADMIN']);
  }

  canComment(): boolean {
    return this.authService.hasAnyRole(['ROLE_MANAGER', 'ROLE_ADMIN', 'ROLE_USER']);
  }

  goToEdit(): void {
    if (!this.task) return;
    this.router.navigate(['/tasks/edit', this.task.id]);
  }
}
