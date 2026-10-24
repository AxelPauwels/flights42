import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { Routes } from '@angular/router';
import { Home } from './shell/home/home';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { Wrapper, WrapperConfig } from './domains/shared/ui-federation/wrapper';
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
    path: 'svelte-app',
    component: Wrapper,
    data: {
      config: {
        remoteName: 'svelte-mfe',
        exposedModule: './web-components',
        elementName: 'svelte-mfe',
      } as WrapperConfig,
    },
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
