import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'nova-vaga',
    loadComponent: () =>
      import('./pages/nova-vaga/nova-vaga.component').then(
        (m) => m.NovaVagaComponent
      ),
  },
  {
    path: 'canais',
    loadComponent: () =>
      import('./pages/canais/canais.component').then(
        (m) => m.CanaisComponent
      ),
  },
  {
    path: 'contas',
    loadComponent: () =>
      import('./pages/contas/contas.component').then(
        (m) => m.ContasComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
