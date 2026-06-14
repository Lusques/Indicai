import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

type StatusPost = 'enviado' | 'agendado' | 'erro' | 'cancelado';

interface DetalheCanal {
  nome: string;
  icone: string;
  cor: string;
  status: 'enviado' | 'erro';
  grupo: string;
}

interface PostHistorico {
  id: number;
  titulo: string;
  empresa: string;
  area: string;
  status: StatusPost;
  dataAgendada: string;
  dataEnvio: string | null;
  totalCanais: number;
  canaisEnviados: number;
  detalhes: DetalheCanal[];
  imagemUrl: string | null;
  expandido: boolean;
}

@Component({
  selector: 'app-historico',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-header d-flex justify-content-between align-items-start">
      <div>
        <h4>Histórico</h4>
        <p>Todas as postagens realizadas e agendadas</p>
      </div>
      <a routerLink="/nova-vaga" class="btn btn-primary btn-sm">
        <i class="bi bi-plus-lg me-1"></i> Nova Vaga
      </a>
    </div>

    <!-- Filtros -->
    <div class="form-card mb-4">
      <div class="row g-3 align-items-end">
        <div class="col-md-4">
          <label class="form-label">Buscar</label>
          <div style="position: relative;">
            <i class="bi bi-search"
              style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: #94a3b8;"></i>
            <input type="text" class="form-control" placeholder="Título, empresa ou área..."
              [(ngModel)]="filtro.busca"
              style="padding-left: 2.25rem;" />
          </div>
        </div>
        <div class="col-md-3">
          <label class="form-label">Status</label>
          <select class="form-select" [(ngModel)]="filtro.status">
            <option value="">Todos</option>
            <option value="enviado">Enviado</option>
            <option value="agendado">Agendado</option>
            <option value="erro">Com erro</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Canal</label>
          <select class="form-select" [(ngModel)]="filtro.canal">
            <option value="">Todos</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="telegram">Telegram</option>
            <option value="facebook">Facebook</option>
            <option value="linkedin">LinkedIn</option>
          </select>
        </div>
        <div class="col-md-2">
          <button class="btn btn-outline-secondary w-100" (click)="limparFiltros()">
            <i class="bi bi-x-lg me-1"></i> Limpar
          </button>
        </div>
      </div>
    </div>

    <!-- Resumo rápido -->
    <div class="row g-3 mb-4">
      <div class="col-6 col-md-3">
        <div class="stat-card text-center">
          <div class="stat-value">{{ totalPorStatus('enviado') }}</div>
          <div class="stat-label">Enviados</div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="stat-card text-center">
          <div class="stat-value" style="color: #b45309;">{{ totalPorStatus('agendado') }}</div>
          <div class="stat-label">Agendados</div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="stat-card text-center">
          <div class="stat-value" style="color: #dc2626;">{{ totalPorStatus('erro') }}</div>
          <div class="stat-label">Com erro</div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="stat-card text-center">
          <div class="stat-value" style="color: #6366f1;">{{ totalCanaisAtingidos }}</div>
          <div class="stat-label">Canais atingidos</div>
        </div>
      </div>
    </div>

    <!-- Lista de posts -->
    <div class="table-card">
      <div class="table-card-header">
        <h6><i class="bi bi-clock-history me-2"></i>Postagens</h6>
        <small class="text-muted">{{ postsFiltrados.length }} resultado(s)</small>
      </div>

      @if (postsFiltrados.length === 0) {
        <div class="text-center p-5" style="color: #94a3b8;">
          <i class="bi bi-inbox" style="font-size: 2rem; display: block; margin-bottom: 0.5rem;"></i>
          Nenhuma postagem encontrada.
        </div>
      }

      @for (post of postsFiltrados; track post.id) {
        <div style="border-bottom: 1px solid #f1f5f9;">

          <!-- Linha principal -->
          <div class="d-flex align-items-center px-4 py-3 gap-3"
            style="cursor: pointer;"
            (click)="toggleExpandir(post)">

            <!-- Ícone de status -->
            <div style="width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0;
                        display: flex; align-items: center; justify-content: center;"
              [style.background]="corFundoStatus(post.status)">
              <i class="bi" [class]="iconeStatus(post.status)"
                [style.color]="corStatus(post.status)"></i>
            </div>

            <!-- Info principal -->
            <div style="flex: 1; min-width: 0;">
              <div style="font-weight: 600; font-size: 0.875rem; color: #0f172a;
                          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                {{ post.titulo }}
              </div>
              <div style="font-size: 0.775rem; color: #64748b;">
                {{ post.empresa }} · <span class="badge-status badge-info" style="font-size: 0.68rem;">{{ post.area }}</span>
              </div>
            </div>

            <!-- Status badge -->
            <span class="badge-status d-none d-md-inline-flex"
              [ngClass]="classeBadge(post.status)">
              <i class="bi" [class]="iconeStatus(post.status)"></i>
              {{ labelStatus(post.status) }}
            </span>

            <!-- Canais -->
            <div class="d-none d-md-flex align-items-center gap-1">
              @for (canal of canaiseUnicos(post); track canal) {
                <i class="bi" [class]="iconeCanal(canal)"
                  [style.color]="corCanal(canal)" style="font-size: 1rem;"></i>
              }
              <small class="text-muted ms-1" style="font-size: 0.72rem;">
                {{ post.canaisEnviados }}/{{ post.totalCanais }}
              </small>
            </div>

            <!-- Data -->
            <div class="d-none d-md-block text-end" style="flex-shrink: 0;">
              <div style="font-size: 0.78rem; color: #64748b;">
                {{ post.status === 'agendado' ? 'Agendado para' : 'Enviado em' }}
              </div>
              <div style="font-size: 0.8rem; font-weight: 500; color: #334155;">
                {{ post.status === 'agendado' ? post.dataAgendada : post.dataEnvio }}
              </div>
            </div>

            <!-- Chevron -->
            <i class="bi"
              [class]="post.expandido ? 'bi-chevron-up' : 'bi-chevron-down'"
              style="color: #94a3b8; flex-shrink: 0;"></i>
          </div>

          <!-- Detalhes expandidos -->
          @if (post.expandido) {
            <div class="px-4 pb-3" style="background: #f8fafc; border-top: 1px solid #f1f5f9;">
              <div style="font-size: 0.78rem; font-weight: 600; color: #64748b;
                          text-transform: uppercase; letter-spacing: 0.05em;
                          padding: 0.75rem 0 0.5rem;">
                Detalhes por canal
              </div>
              <div class="d-flex flex-column gap-2">
                @for (detalhe of post.detalhes; track detalhe.grupo) {
                  <div class="d-flex align-items-center gap-3 p-2 rounded"
                    style="background: white; border: 1px solid #e2e8f0;">
                    <i class="bi" [class]="detalhe.icone"
                      [style.color]="detalhe.cor" style="font-size: 1.1rem;"></i>
                    <div style="flex: 1;">
                      <div style="font-size: 0.82rem; font-weight: 500; color: #1e293b;">
                        {{ detalhe.nome }}
                      </div>
                      <div style="font-size: 0.72rem; color: #94a3b8;">{{ detalhe.grupo }}</div>
                    </div>
                    <span class="badge-status"
                      [class.badge-success]="detalhe.status === 'enviado'"
                      [class.badge-error]="detalhe.status === 'erro'">
                      <i class="bi"
                        [class.bi-check-circle-fill]="detalhe.status === 'enviado'"
                        [class.bi-x-circle-fill]="detalhe.status === 'erro'"></i>
                      {{ detalhe.status === 'enviado' ? 'Enviado' : 'Erro' }}
                    </span>
                  </div>
                }
              </div>

              <!-- Ações -->
              <div class="d-flex gap-2 mt-3">
                @if (post.status === 'erro') {
                  <button class="btn btn-sm btn-primary">
                    <i class="bi bi-arrow-clockwise me-1"></i> Reenviar falhas
                  </button>
                }
                @if (post.status === 'agendado') {
                  <button class="btn btn-sm btn-outline-danger" (click)="cancelarPost(post)">
                    <i class="bi bi-x-lg me-1"></i> Cancelar agendamento
                  </button>
                }
                <button class="btn btn-sm btn-outline-secondary" (click)="duplicar(post)">
                  <i class="bi bi-copy me-1"></i> Duplicar vaga
                </button>
              </div>
            </div>
          }

        </div>
      }
    </div>
  `,
})
export class HistoricoComponent {
  filtro = { busca: '', status: '', canal: '' };

  posts: PostHistorico[] = [
    {
      id: 1,
      titulo: 'Desenvolvedor Frontend Pleno',
      empresa: 'TechCorp',
      area: 'Tecnologia',
      status: 'enviado',
      dataAgendada: '14/06/2026 08:00',
      dataEnvio: '14/06/2026 08:01',
      totalCanais: 4,
      canaisEnviados: 4,
      imagemUrl: null,
      expandido: false,
      detalhes: [
        { nome: 'WhatsApp', icone: 'bi-whatsapp', cor: '#25D366', status: 'enviado', grupo: 'Vagas TI - São Paulo' },
        { nome: 'WhatsApp', icone: 'bi-whatsapp', cor: '#25D366', status: 'enviado', grupo: 'Vagas Remotas Brasil' },
        { nome: 'Telegram', icone: 'bi-telegram', cor: '#229ED9', status: 'enviado', grupo: '@vagas_tech_br' },
        { nome: 'LinkedIn', icone: 'bi-linkedin', cor: '#0A66C2', status: 'enviado', grupo: 'Feed pessoal' },
      ],
    },
    {
      id: 2,
      titulo: 'Analista de Marketing Digital',
      empresa: 'MarketFlow',
      area: 'Marketing',
      status: 'agendado',
      dataAgendada: '16/06/2026 18:00',
      dataEnvio: null,
      totalCanais: 3,
      canaisEnviados: 0,
      imagemUrl: null,
      expandido: false,
      detalhes: [
        { nome: 'WhatsApp', icone: 'bi-whatsapp', cor: '#25D366', status: 'enviado', grupo: 'Empregos BH e Região' },
        { nome: 'Telegram', icone: 'bi-telegram', cor: '#229ED9', status: 'enviado', grupo: 'Empregos e Oportunidades' },
        { nome: 'Facebook', icone: 'bi-facebook', cor: '#1877F2', status: 'enviado', grupo: 'Vagas SP e Região' },
      ],
    },
    {
      id: 3,
      titulo: 'Vendedor Externo',
      empresa: 'SalesForce BR',
      area: 'Vendas',
      status: 'erro',
      dataAgendada: '13/06/2026 09:00',
      dataEnvio: '13/06/2026 09:02',
      totalCanais: 3,
      canaisEnviados: 2,
      imagemUrl: null,
      expandido: false,
      detalhes: [
        { nome: 'WhatsApp', icone: 'bi-whatsapp', cor: '#25D366', status: 'enviado', grupo: 'Oportunidades RJ' },
        { nome: 'Telegram', icone: 'bi-telegram', cor: '#229ED9', status: 'enviado', grupo: '@vagas_tech_br' },
        { nome: 'Facebook', icone: 'bi-facebook', cor: '#1877F2', status: 'erro',    grupo: 'Vagas SP e Região' },
      ],
    },
    {
      id: 4,
      titulo: 'Assistente Administrativo',
      empresa: 'AdminPlus',
      area: 'Administrativo',
      status: 'cancelado',
      dataAgendada: '12/06/2026 14:00',
      dataEnvio: null,
      totalCanais: 2,
      canaisEnviados: 0,
      imagemUrl: null,
      expandido: false,
      detalhes: [],
    },
  ];

  get postsFiltrados(): PostHistorico[] {
    return this.posts.filter((p) => {
      const buscaOk = !this.filtro.busca ||
        p.titulo.toLowerCase().includes(this.filtro.busca.toLowerCase()) ||
        p.empresa.toLowerCase().includes(this.filtro.busca.toLowerCase()) ||
        p.area.toLowerCase().includes(this.filtro.busca.toLowerCase());

      const statusOk = !this.filtro.status || p.status === this.filtro.status;

      const canalOk = !this.filtro.canal ||
        p.detalhes.some((d) => d.nome.toLowerCase() === this.filtro.canal);

      return buscaOk && statusOk && canalOk;
    });
  }

  get totalCanaisAtingidos(): number {
    return this.posts
      .filter((p) => p.status === 'enviado' || p.status === 'erro')
      .reduce((acc, p) => acc + p.canaisEnviados, 0);
  }

  totalPorStatus(status: StatusPost): number {
    return this.posts.filter((p) => p.status === status).length;
  }

  toggleExpandir(post: PostHistorico): void {
    post.expandido = !post.expandido;
  }

  cancelarPost(post: PostHistorico): void {
    post.status = 'cancelado';
    post.expandido = false;
  }

  duplicar(post: PostHistorico): void {
    alert(`Duplicar "${post.titulo}" — em breve abrirá o formulário pré-preenchido.`);
  }

  limparFiltros(): void {
    this.filtro = { busca: '', status: '', canal: '' };
  }

  canaiseUnicos(post: PostHistorico): string[] {
    return [...new Set(post.detalhes.map((d) => d.nome.toLowerCase()))];
  }

  iconeStatus(status: StatusPost): string {
    const map: Record<StatusPost, string> = {
      enviado:   'bi-check-circle-fill',
      agendado:  'bi-clock-fill',
      erro:      'bi-exclamation-circle-fill',
      cancelado: 'bi-x-circle-fill',
    };
    return map[status];
  }

  corStatus(status: StatusPost): string {
    const map: Record<StatusPost, string> = {
      enviado:   '#15803d',
      agendado:  '#b45309',
      erro:      '#dc2626',
      cancelado: '#94a3b8',
    };
    return map[status];
  }

  corFundoStatus(status: StatusPost): string {
    const map: Record<StatusPost, string> = {
      enviado:   '#dcfce7',
      agendado:  '#fef3c7',
      erro:      '#fee2e2',
      cancelado: '#f1f5f9',
    };
    return map[status];
  }

  classeBadge(status: StatusPost): string {
    const map: Record<StatusPost, string> = {
      enviado:   'badge-success',
      agendado:  'badge-pending',
      erro:      'badge-error',
      cancelado: 'badge-info',
    };
    return map[status];
  }

  labelStatus(status: StatusPost): string {
    const map: Record<StatusPost, string> = {
      enviado:   'Enviado',
      agendado:  'Agendado',
      erro:      'Com erro',
      cancelado: 'Cancelado',
    };
    return map[status];
  }

  iconeCanal(canal: string): string {
    const map: Record<string, string> = {
      whatsapp: 'bi-whatsapp',
      telegram: 'bi-telegram',
      facebook: 'bi-facebook',
      linkedin: 'bi-linkedin',
    };
    return map[canal] ?? 'bi-broadcast';
  }

  corCanal(canal: string): string {
    const map: Record<string, string> = {
      whatsapp: '#25D366',
      telegram: '#229ED9',
      facebook: '#1877F2',
      linkedin: '#0A66C2',
    };
    return map[canal] ?? '#94a3b8';
  }
}
