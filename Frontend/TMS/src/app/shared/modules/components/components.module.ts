import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NotificationComponent} from './notification/notification.component';
import {LoadingComponent} from './loading/loading.component';

@NgModule({
  imports: [
    CommonModule,
    LoadingComponent,
    NotificationComponent
  ],
  exports: [
    NotificationComponent,
    LoadingComponent
  ]
})
export class ComponentsModule { }
