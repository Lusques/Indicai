import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="app-sidebar">

      <!-- Brand -->
      <div class="sidebar-brand">
        <a class="brand-logo" routerLink="/dashboard">
          <i class="bi bi-broadcast"></i>
          Indica<span class="brand-accent">í</span>
        </a>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <div class="nav-section-title">Menu</div>

        <a
          class="sidebar-link"
          routerLink="/dashboard"
          routerLinkActive="active"
        >
          <i class="bi bi-grid-1x2"></i>
          Dashboard
        </a>

        <a
          class="sidebar-link"
          routerLink="/nova-vaga"
          routerLinkActive="active"
        >
          <i class="bi bi-plus-circle"></i>
          Nova Vaga
        </a>

        <a
          class="sidebar-link"
          routerLink="/canais"
          routerLinkActive="active"
        >
          <i class="bi bi-broadcast-pin"></i>
          Canais
        </a>

        <a
          class="sidebar-link"
          routerLink="/contas"
          routerLinkActive="active"
        >
          <i class="bi bi-person-badge"></i>
          Contas
        </a>

        <div class="nav-section-title" style="margin-top: 1rem;">Em breve</div>

        <a class="sidebar-link" style="opacity: 0.4; cursor: not-allowed;">
          <i class="bi bi-clock-history"></i>
          Histórico
        </a>

        <a class="sidebar-link" style="opacity: 0.4; cursor: not-allowed;">
          <i class="bi bi-bar-chart-line"></i>
          Relatórios
        </a>
      </nav>

      <!-- Footer -->
      <div class="sidebar-footer">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <div
            style="width: 28px; height: 28px; border-radius: 50%;
                   background: #374151; display: flex; align-items: center;
                   justify-content: center; font-size: 0.7rem; color: #9ca3af;"
          >
            <i class="bi bi-person"></i>
          </div>
          <div>
            <div style="font-size: 0.78rem; color: #d1d5db; font-weight: 500;">
              Minha conta
            </div>
            <div style="font-size: 0.68rem; color: #4b5563;">v0.1.0 MVP</div>
          </div>
        </div>
      </div>

    </aside>
  `,
})
export class SidebarComponent {}
