import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'',
        loadComponent:()=>import('./pages/home/home.component').then(c=>c.HomeComponent)
    },
    {
        path:'login',
        loadComponent:()=>import('./pages/auth/continue/continue.component').then(c=>c.ContinueComponent)
    }
]