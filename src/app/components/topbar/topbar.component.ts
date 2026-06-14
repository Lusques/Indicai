import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="app-topbar">
      <div style="flex: 1;">
        <span style="font-size: 0.82rem; color: #94a3b8;">
          <i class="bi bi-broadcast me-1"></i>
          Distribuição automática de vagas
        </span>
      </div>

      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <a
          routerLink="/nova-vaga"
          class="btn btn-primary btn-sm"
          style="display: flex; align-items: center; gap: 0.4rem;"
        >
          <i class="bi bi-plus-lg"></i>
          Nova Vaga
        </a>

        <button
          class="btn btn-sm"
          style="color: #64748b; border: 1px solid #e2e8f0;"
          title="Configurações"
        >
          <i class="bi bi-gear"></i>
        </button>
      </div>
    </header>
  `,
})
export class TopbarComponent {}
