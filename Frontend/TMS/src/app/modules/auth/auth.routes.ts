import { Routes } from '@angular/router';
import { LoginContainerComponent } from './containers/login-container/login-container';
import { RegisterContainerComponent } from './containers/register-container/register-container';
import { AuthRedirectComponent } from './containers/auth-redirect/auth-redirect';
import {AuthPageComponent} from './page/auth-page/auth-page';

export const authRoutes: Routes = [
  {
    path: '',
    component: AuthPageComponent,
    children: [
      {
        path: 'login',
        component: LoginContainerComponent,
        title: 'Sign In'
      },
      {
        path: 'register',
        component: RegisterContainerComponent,
        title: 'Sign Up'
      },
      {
        path: 'redirect',
        component: AuthRedirectComponent,
        title: 'Redirecting...'
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  }
];
