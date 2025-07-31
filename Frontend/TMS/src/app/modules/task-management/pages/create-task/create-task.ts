import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {TaskFormComponent} from '../../components/task-form/task-form';

@Component({
  imports: [
    TaskFormComponent
  ],
  template: `
    <app-task-form></app-task-form>`
})
export class CreateTaskPage {}
