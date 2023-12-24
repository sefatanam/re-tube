import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'player',
        loadComponent: () => import('./pages/player/player.component').then(c => c.PlayerComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/auth/continue/continue.component').then(c => c.ContinueComponent)
    },
    {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent)
    },
]