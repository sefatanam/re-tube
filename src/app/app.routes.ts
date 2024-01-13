import { Routes } from '@angular/router';
import { authGuard } from '@guards/auth.guard';

export const routes: Routes = [
    {
        path: 'player',
        loadComponent: () => import('./pages/player/player.component').then(c => c.PlayerComponent)
    },
    {
        path: 'personal',
        loadComponent: () => import('./pages/personal/personal.component').then(c => c.PersonalComponent)
    },
    {
        path: 'public',
        loadComponent: () => import('./pages/public/public.component').then(c => c.PublicComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/auth/continue/continue.component').then(c => c.ContinueComponent),
        canActivate: [authGuard]
    },
    {
        path: 'share-target',
        loadComponent: () => import('./pages/share-target/share-target.component').then(c => c.ShareTargetComponent),
    },
    {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent)
    },
    {
        path: '**',
        loadComponent: () => import('./pages/not-found/not-found.component').then(c => c.NotFoundComponent)
    }
]
