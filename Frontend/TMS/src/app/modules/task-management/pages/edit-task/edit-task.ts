import { Component } from '@angular/core';
import {TaskFormComponent} from '../../components/task-form/task-form';

@Component({
  imports: [
    TaskFormComponent
  ],
  template: `
    <app-task-form></app-task-form>`
})
export class EditTaskPage {}
