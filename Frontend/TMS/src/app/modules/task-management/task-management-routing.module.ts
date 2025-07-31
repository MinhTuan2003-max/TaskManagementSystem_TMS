import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { TaskOverviewPage } from './pages/task-overview/task-overview';
import { CreateTaskPage } from './pages/create-task/create-task';
import { EditTaskPage } from './pages/edit-task/edit-task';
import { ViewTaskPage } from './pages/view-task/view-task';
import { Kanban } from './pages/kanban/kanban';
import {RoleGuard} from '../../core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        component: TaskOverviewPage,
        data: { title: 'Danh sách công việc' }
      },
      {
        path: 'create',
        component: CreateTaskPage,
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_MANAGER', 'ROLE_ADMIN'], title: 'Tạo công việc' }
      },
      {
        path: 'edit/:id',
        component: EditTaskPage,
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_MANAGER', 'ROLE_ADMIN'], title: 'Chỉnh sửa công việc' }
      },
      {
        path: 'view/:id',
        component: ViewTaskPage,
        data: { title: 'Chi tiết công việc' }
      },
      {
        path: 'kanban',
        component: Kanban,
        data: { title: 'Bảng Kanban' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskManagementRoutingModule {}
