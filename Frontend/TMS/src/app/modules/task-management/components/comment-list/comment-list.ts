import { Component, Input } from '@angular/core';
import { Comment } from '../../../../core/models';
import {DatePipe, NgForOf} from '@angular/common';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.html',
  styleUrls: ['./comment-list.scss'],
  standalone: true,
  imports: [
    NgForOf,
    DatePipe
  ]
})
export class CommentListComponent {
  @Input() comments: Comment[] = [];
}
