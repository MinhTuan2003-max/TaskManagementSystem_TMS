import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import {LandingComponent} from './modules/landing-page/landing-page';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    title: 'Task Management System - Manage Your Tasks Efficiently'
  },
  // Authentication routes
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.routes').then(r => r.authRoutes),
    title: 'Authentication'
  },

  // Dashboard routes (protected)
  // {
  //   path: 'dashboard',
  //   loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent),
  //   canActivate: [AuthGuard],
  //   title: 'Dashboard'
  // },
  //
  // // Error pages
  // {
  //   path: 'unauthorized',
  //   loadComponent: () => import('./shared/components/unauthorized/unauthorized.component').then(c => c.UnauthorizedComponent),
  //   title: 'Unauthorized'
  // },
  //
  // {
  //   path: 'not-found',
  //   loadComponent: () => import('./shared/components/not-found/not-found.component').then(c => c.NotFoundComponent),
  //   title: 'Page Not Found'
  // },

  // Default redirect
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },

  // Wildcard route
  {
    path: '**',
    redirectTo: '/not-found'
  }
];
