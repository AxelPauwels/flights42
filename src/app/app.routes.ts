import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { Routes } from '@angular/router';
import { Home } from './shell/home/home';
import { loadRemoteModule } from '@angular-architects/native-federation';
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
    loadChildren: () => import('./domains/ticketing/ticketing.routes'),
  },
  {
    path: 'about',
    loadComponent: () => import('./shell/about/about'),
  },
  {
    path: 'miles',
    // loadComponent: () => loadRemoteModule('miles', './Component'),
    loadChildren: () =>
      isPlatformBrowser(inject(PLATFORM_ID))
        ? loadRemoteModule('miles', './Routes')
        : Promise.resolve([]),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
