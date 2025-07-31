import { Component, Input } from '@angular/core';
import { Comment } from '../../../../core/models';
import {DatePipe, NgForOf} from '@angular/common';

@Component({
  selector: 'app-comment-list',
  imports: [
    NgForOf,
    DatePipe
  ],
  templateUrl: './comment-list.html'
})
export class CommentListComponent {
  @Input() comments: Comment[] = [];
}
