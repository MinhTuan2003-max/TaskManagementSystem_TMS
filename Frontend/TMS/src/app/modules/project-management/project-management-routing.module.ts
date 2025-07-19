import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProjectManagement} from './pages/project-management/project-management';
import {ProjectListContainer} from './containers/project-list/project-list';
import {ProjectDetailContainer} from './containers/project-detail/project-detail';
import {ProjectSettingsContainer} from './containers/project-settings/project-settings';
const routes: Routes = [
  {
    path: '',
    component: ProjectManagement,
    children: [
      {
        path: '',
        component: ProjectListContainer,
        title: 'My Projects'
      },
      {
        path: ':id',
        component: ProjectDetailContainer,
        title: 'Project Details'
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
