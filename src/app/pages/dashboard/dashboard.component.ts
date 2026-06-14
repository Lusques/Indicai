import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Vaga {
  id: number;
  titulo: string;
  empresa: string;
  area: string;
  status: 'postada' | 'pendente' | 'erro';
  canais: number;
  data: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header">
      <h4>Dashboard</h4>
      <p>Visão geral das suas distribuições de vagas</p>
    </div>

    <!-- Stat cards -->
    <div class="row g-3 mb-4">

      <div class="col-md-3">
        <div class="stat-card">
          <div class="d-flex align-items-start justify-content-between">
            <div>
              <div class="stat-value">{{ stats.totalVagas }}</div>
              <div class="stat-label">Total de vagas</div>
            </div>
            <div class="stat-icon" style="background: #e0e7ff;">
              <i class="bi bi-briefcase" style="color: #4338ca;"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="stat-card">
          <div class="d-flex align-items-start justify-content-between">
            <div>
              <div class="stat-value">{{ stats.postadasHoje }}</div>
              <div class="stat-label">Postadas hoje</div>
            </div>
            <div class="stat-icon" style="background: #dcfce7;">
              <i class="bi bi-send-check" style="color: #15803d;"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="stat-card">
          <div class="d-flex align-items-start justify-content-between">
            <div>
              <div class="stat-value">{{ stats.canaisAtivos }}</div>
              <div class="stat-label">Canais ativos</div>
            </div>
            <div class="stat-icon" style="background: #fef3c7;">
              <i class="bi bi-broadcast-pin" style="color: #b45309;"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="stat-card">
          <div class="d-flex align-items-start justify-content-between">
            <div>
              <div class="stat-value">{{ stats.taxaSucesso }}%</div>
              <div class="stat-label">Taxa de sucesso</div>
            </div>
            <div class="stat-icon" style="background: #f3e8ff;">
              <i class="bi bi-graph-up-arrow" style="color: #7c3aed;"></i>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Tabela de vagas recentes -->
    <div class="table-card">
      <div class="table-card-header">
        <h6><i class="bi bi-list-ul me-2"></i>Vagas recentes</h6>
        <a routerLink="/nova-vaga" class="btn btn-primary btn-sm">
          <i class="bi bi-plus-lg me-1"></i> Nova Vaga
        </a>
      </div>

      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Título / Empresa</th>
              <th>Área</th>
              <th>Status</th>
              <th>Canais</th>
              <th>Data</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            @for (vaga of vagas; track vaga.id) {
              <tr>
                <td>
                  <div style="font-weight: 600; color: #0f172a;">{{ vaga.titulo }}</div>
                  <div style="font-size: 0.775rem; color: #64748b;">{{ vaga.empresa }}</div>
                </td>
                <td>
                  <span class="badge-status badge-info">{{ vaga.area }}</span>
                </td>
                <td>
                  <span class="badge-status" [ngClass]="{
                    'badge-success': vaga.status === 'postada',
                    'badge-pending': vaga.status === 'pendente',
                    'badge-error':   vaga.status === 'erro'
                  }">
                    <i class="bi" [ngClass]="{
                      'bi-check-circle-fill': vaga.status === 'postada',
                      'bi-hourglass-split':   vaga.status === 'pendente',
                      'bi-x-circle-fill':     vaga.status === 'erro'
                    }"></i>
                    {{ vaga.status | titlecase }}
                  </span>
                </td>
                <td style="color: #64748b; font-size: 0.82rem;">
                  <i class="bi bi-broadcast me-1"></i>{{ vaga.canais }} canais
                </td>
                <td style="color: #64748b; font-size: 0.82rem;">{{ vaga.data }}</td>
                <td>
                  <button class="btn btn-sm" style="color: #6366f1; padding: 0.25rem 0.5rem;">
                    <i class="bi bi-three-dots"></i>
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6" class="text-center" style="padding: 3rem; color: #94a3b8;">
                  <i class="bi bi-inbox" style="font-size: 2rem; display: block; margin-bottom: 0.5rem;"></i>
                  Nenhuma vaga cadastrada ainda.
                  <a routerLink="/nova-vaga" class="d-block mt-2" style="color: #6366f1;">
                    Cadastrar primeira vaga →
                  </a>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class DashboardComponent {
  stats = {
    totalVagas: 12,
    postadasHoje: 3,
    canaisAtivos: 5,
    taxaSucesso: 94,
  };

  vagas: Vaga[] = [
    {
      id: 1,
      titulo: 'Desenvolvedor Frontend',
      empresa: 'TechCorp',
      area: 'Tecnologia',
      status: 'postada',
      canais: 4,
      data: 'Hoje, 14:30',
    },
    {
      id: 2,
      titulo: 'Analista de Marketing',
      empresa: 'MarketFlow',
      area: 'Marketing',
      status: 'postada',
      canais: 3,
      data: 'Hoje, 11:00',
    },
    {
      id: 3,
      titulo: 'Assistente Administrativo',
      empresa: 'AdminPlus',
      area: 'Administrativo',
      status: 'pendente',
      canais: 2,
      data: 'Ontem, 16:45',
    },
    {
      id: 4,
      titulo: 'Vendedor Externo',
      empresa: 'SalesForce BR',
      area: 'Vendas',
      status: 'erro',
      canais: 3,
      data: 'Ontem, 09:15',
    },
  ];
}
