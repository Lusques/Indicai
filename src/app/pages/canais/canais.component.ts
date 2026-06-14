import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Canal {
  id: string;
  nome: string;
  icone: string;
  cor: string;
  descricao: string;
  status: 'conectado' | 'desconectado' | 'em_breve';
  grupos: Grupo[];
}

interface Grupo {
  id: number;
  nome: string;
  membros: number;
  ativo: boolean;
}

@Component({
  selector: 'app-canais',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <h4>Canais</h4>
      <p>Gerencie os grupos e canais onde as vagas serão distribuídas</p>
    </div>

    <div class="row g-3">

      @for (canal of canais; track canal.id) {
        <div class="col-12">
          <div
            class="table-card"
            [style.opacity]="canal.status === 'em_breve' ? '0.6' : '1'"
          >
            <!-- Canal header -->
            <div class="table-card-header">
              <div class="d-flex align-items-center gap-3">
                <div
                  class="canal-icon"
                  style="width: 44px; height: 44px; border-radius: 12px; display: flex;
                         align-items: center; justify-content: center; font-size: 1.4rem;"
                  [style.background]="canal.cor + '18'"
                >
                  <i class="bi" [class]="canal.icone" [style.color]="canal.cor"></i>
                </div>
                <div>
                  <div style="font-weight: 700; font-size: 0.95rem; color: #0f172a;">
                    {{ canal.nome }}
                  </div>
                  <div style="font-size: 0.775rem; color: #64748b;">{{ canal.descricao }}</div>
                </div>
              </div>

              <div class="d-flex align-items-center gap-2">
                <span
                  class="badge-status"
                  [ngClass]="{
                    'badge-success': canal.status === 'conectado',
                    'badge-error':   canal.status === 'desconectado',
                    'badge-pending': canal.status === 'em_breve'
                  }"
                >
                  <i class="bi" [ngClass]="{
                    'bi-wifi':          canal.status === 'conectado',
                    'bi-wifi-off':      canal.status === 'desconectado',
                    'bi-clock':         canal.status === 'em_breve'
                  }"></i>
                  {{ statusLabel(canal.status) }}
                </span>

                @if (canal.status !== 'em_breve') {
                  <button
                    class="btn btn-sm"
                    [class.btn-outline-danger]="canal.status === 'conectado'"
                    [class.btn-primary]="canal.status === 'desconectado'"
                    style="font-size: 0.78rem;"
                    (click)="toggleConexao(canal)"
                  >
                    {{ canal.status === 'conectado' ? 'Desconectar' : 'Conectar' }}
                  </button>
                }
              </div>
            </div>

            <!-- Lista de grupos -->
            @if (canal.status === 'conectado' && canal.grupos.length > 0) {
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Grupo / Canal</th>
                      <th>Membros</th>
                      <th>Ativo</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (grupo of canal.grupos; track grupo.id) {
                      <tr>
                        <td>
                          <div style="font-weight: 500; color: #1e293b;">{{ grupo.nome }}</div>
                        </td>
                        <td style="color: #64748b; font-size: 0.82rem;">
                          <i class="bi bi-people me-1"></i>{{ grupo.membros | number }}
                        </td>
                        <td>
                          <div class="form-check form-switch mb-0">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              role="switch"
                              [checked]="grupo.ativo"
                              (change)="toggleGrupo(grupo)"
                              style="cursor: pointer;"
                            />
                          </div>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }

            @if (canal.status === 'desconectado') {
              <div class="text-center p-4" style="color: #94a3b8; font-size: 0.85rem;">
                <i class="bi bi-plug" style="font-size: 1.5rem; display: block; margin-bottom: 0.5rem;"></i>
                Conecte {{ canal.nome }} para ver e gerenciar seus grupos
              </div>
            }

            @if (canal.status === 'em_breve') {
              <div class="text-center p-4" style="color: #94a3b8; font-size: 0.85rem;">
                <i class="bi bi-hourglass-split" style="font-size: 1.5rem; display: block; margin-bottom: 0.5rem;"></i>
                Integração em desenvolvimento — em breve!
              </div>
            }

          </div>
        </div>
      }

    </div>
  `,
})
export class CanaisComponent {
  canais: Canal[] = [
    {
      id: 'whatsapp',
      nome: 'WhatsApp',
      icone: 'bi-whatsapp',
      cor: '#25D366',
      descricao: 'Automação via Baileys — envio para grupos',
      status: 'conectado',
      grupos: [
        { id: 1, nome: 'Vagas TI - São Paulo',     membros: 1240, ativo: true  },
        { id: 2, nome: 'Empregos BH e Região',      membros: 876,  ativo: true  },
        { id: 3, nome: 'Oportunidades RJ',           membros: 534,  ativo: false },
        { id: 4, nome: 'Vagas Remotas Brasil',       membros: 3200, ativo: true  },
      ],
    },
    {
      id: 'telegram',
      nome: 'Telegram',
      icone: 'bi-telegram',
      cor: '#229ED9',
      descricao: 'API oficial — canais e grupos',
      status: 'conectado',
      grupos: [
        { id: 5, nome: '@vagas_tech_br',             membros: 8900, ativo: true  },
        { id: 6, nome: 'Empregos e Oportunidades',   membros: 4300, ativo: true  },
      ],
    },
    {
      id: 'facebook',
      nome: 'Facebook',
      icone: 'bi-facebook',
      cor: '#1877F2',
      descricao: 'Automação via Playwright — grupos de emprego',
      status: 'desconectado',
      grupos: [],
    },
    {
      id: 'linkedin',
      nome: 'LinkedIn',
      icone: 'bi-linkedin',
      cor: '#0A66C2',
      descricao: 'Postagem no feed pessoal via API',
      status: 'em_breve',
      grupos: [],
    },
  ];

  statusLabel(status: string): string {
    const labels: Record<string, string> = {
      conectado: 'Conectado',
      desconectado: 'Desconectado',
      em_breve: 'Em breve',
    };
    return labels[status] ?? status;
  }

  toggleConexao(canal: Canal): void {
    if (canal.status === 'conectado') {
      canal.status = 'desconectado';
    } else {
      canal.status = 'conectado';
    }
  }

  toggleGrupo(grupo: Grupo): void {
    grupo.ativo = !grupo.ativo;
  }
}
