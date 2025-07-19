import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminUserManagementPageComponent } from './pages/admin-user-management-page/admin-user-management-page.component';

const routes: Routes = [
  {
    path: '',
    component: AdminUserManagementPageComponent,
    data: {
      title: 'User Management',
      breadcrumb: 'Users'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminUserManagementRoutingModule {}
