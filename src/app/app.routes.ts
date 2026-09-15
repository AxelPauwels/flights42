import { Routes } from '@angular/router';
import { About } from './shell/about/about';
import { Home } from './shell/home/home';
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    component: Home,
  },
  {
    path: 'ticketing',
    loadChildren: () =>
      import('./domains/ticketing/ticketing.routes')
  },
  {
    path: 'about',
    component: About,
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
