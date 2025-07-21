import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectManagement } from './pages/project-management/project-management';
import { ProjectListContainer } from './containers/project-list/project-list';
import { ProjectDetailContainer } from './containers/project-detail/project-detail';
import { ProjectSettingsContainer } from './containers/project-settings/project-settings';
import { CreateProjectContainer } from './containers/create-project/create-project';
import { EditProjectContainer } from './containers/edit-project/edit-project';

const routes: Routes = [
  {
    path: '',
    component: ProjectManagement,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: ProjectListContainer,
        title: 'My Projects'
      },
      {
        path: 'create',
        component: CreateProjectContainer,
        title: 'Create New Project'
      },
      {
        path: ':id',
        component: ProjectDetailContainer,
        title: 'Project Details'
      },
      {
        path: ':id/edit',
        component: EditProjectContainer,
        title: 'Edit Project'
      },
      {
        path: ':id/settings',
        component: ProjectSettingsContainer,
        title: 'Project Settings'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectManagementRoutingModule { }
