import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type PlataformaId = 'whatsapp' | 'telegram' | 'facebook' | 'linkedin';
type StatusConexao = 'desconectado' | 'aguardando_qr' | 'conectado';

interface Grupo {
  id: number;
  nome: string;
  membros: number;
  ativo: boolean;
}

interface ContaWhatsApp {
  id: number;
  numero: string;
  status: StatusConexao;
  grupos: Grupo[];
}

interface ContaTelegram {
  id: number;
  botNome: string;
  botToken: string;
  status: StatusConexao;
  grupos: Grupo[];
}

interface ContaFacebook {
  id: number;
  email: string;
  status: StatusConexao;
  grupos: Grupo[];
}

interface ContaLinkedIn {
  id: number;
  email: string;
  nome: string;
  status: StatusConexao;
}

@Component({
  selector: 'app-contas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h4>Contas</h4>
      <p>Conecte suas contas e gerencie os grupos que receberão as vagas</p>
    </div>

    <!-- Tabs de plataforma -->
    <div class="d-flex gap-2 mb-4">
      @for (p of plataformas; track p.id) {
        <button
          class="btn d-flex align-items-center gap-2"
          [class.btn-primary]="plataformaSelecionada === p.id"
          [class.btn-outline-secondary]="plataformaSelecionada !== p.id"
          (click)="plataformaSelecionada = p.id"
          style="font-size: 0.85rem; font-weight: 500;"
        >
          <i class="bi" [class]="p.icone" [style.color]="plataformaSelecionada === p.id ? 'white' : p.cor"></i>
          {{ p.nome }}
          @if (p.contas > 0) {
            <span
              class="badge rounded-pill"
              [style.background]="plataformaSelecionada === p.id ? 'rgba(255,255,255,0.25)' : '#e0e7ff'"
              [style.color]="plataformaSelecionada === p.id ? 'white' : '#4338ca'"
              style="font-size: 0.7rem;"
            >{{ p.contas }}</span>
          }
        </button>
      }
    </div>

    <!-- ── WhatsApp ──────────────────────────────────────── -->
    @if (plataformaSelecionada === 'whatsapp') {
      <div>
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 style="font-weight: 700; color: #0f172a; margin: 0;">
            <i class="bi bi-whatsapp me-2" style="color: #25D366;"></i>
            Números conectados
          </h6>
          <button class="btn btn-primary btn-sm" (click)="adicionarWhatsApp()">
            <i class="bi bi-plus-lg me-1"></i> Adicionar número
          </button>
        </div>

        <!-- Modal-like: QR Code -->
        @if (mostrandoQR) {
          <div class="table-card mb-3 p-4 text-center">
            <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 1rem;">
              Abra o <strong>WhatsApp</strong> no celular → <strong>Dispositivos conectados</strong> → <strong>Conectar dispositivo</strong>
            </div>
            <div
              style="width: 200px; height: 200px; background: #f1f5f9; border: 2px dashed #cbd5e1;
                     border-radius: 12px; margin: 0 auto; display: flex; align-items: center;
                     justify-content: center; flex-direction: column; gap: 0.5rem;"
            >
              <i class="bi bi-qr-code" style="font-size: 3rem; color: #94a3b8;"></i>
              <small style="color: #94a3b8; font-size: 0.72rem;">QR Code gerado pelo backend</small>
            </div>
            <div style="margin-top: 1rem; display: flex; gap: 0.5rem; justify-content: center;">
              <button class="btn btn-outline-secondary btn-sm" (click)="mostrandoQR = false">Cancelar</button>
              <button class="btn btn-primary btn-sm" (click)="simularConexaoWA()">
                <i class="bi bi-check-lg me-1"></i> Simular conexão
              </button>
            </div>
          </div>
        }

        <!-- Lista de contas WA -->
        <div class="d-flex flex-column gap-3">
          @for (conta of contasWA; track conta.id) {
            <div class="table-card">
              <div class="table-card-header">
                <div class="d-flex align-items-center gap-3">
                  <div style="width: 42px; height: 42px; border-radius: 50%; background: #dcfce7;
                              display: flex; align-items: center; justify-content: center;">
                    <i class="bi bi-phone" style="color: #15803d;"></i>
                  </div>
                  <div>
                    <div style="font-weight: 600; font-size: 0.9rem; color: #0f172a;">{{ conta.numero }}</div>
                    <div style="font-size: 0.775rem; color: #64748b;">
                      {{ conta.grupos.length }} grupos cadastrados
                    </div>
                  </div>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <span class="badge-status badge-success">
                    <i class="bi bi-wifi"></i> Conectado
                  </span>
                  <button class="btn btn-sm btn-outline-danger" style="font-size: 0.75rem;"
                    (click)="desconectarWA(conta)">
                    Desconectar
                  </button>
                </div>
              </div>

              <!-- Grupos desta conta -->
              <div class="px-3 pb-3">
                <div class="d-flex justify-content-between align-items-center mb-2 mt-1">
                  <small style="font-weight: 600; color: #64748b; font-size: 0.75rem;">GRUPOS</small>
                  <button class="btn btn-sm" style="font-size: 0.75rem; color: #6366f1; padding: 0.2rem 0.5rem;">
                    <i class="bi bi-arrow-clockwise me-1"></i>Sincronizar grupos
                  </button>
                </div>
                <div class="d-flex flex-column gap-1">
                  @for (grupo of conta.grupos; track grupo.id) {
                    <div class="d-flex align-items-center justify-content-between py-2 px-3"
                      style="background: #f8fafc; border-radius: 8px; border: 1px solid #f1f5f9;">
                      <div>
                        <div style="font-size: 0.83rem; font-weight: 500; color: #1e293b;">{{ grupo.nome }}</div>
                        <div style="font-size: 0.72rem; color: #94a3b8;">
                          <i class="bi bi-people me-1"></i>{{ grupo.membros | number }} membros
                        </div>
                      </div>
                      <div class="form-check form-switch mb-0">
                        <input class="form-check-input" type="checkbox" role="switch"
                          [checked]="grupo.ativo" (change)="grupo.ativo = !grupo.ativo" style="cursor:pointer;" />
                      </div>
                    </div>
                  }
                  @if (conta.grupos.length === 0) {
                    <div class="text-center py-3" style="color: #94a3b8; font-size: 0.82rem;">
                      Nenhum grupo ainda — clique em "Sincronizar grupos"
                    </div>
                  }
                </div>
              </div>
            </div>
          }

          @if (contasWA.length === 0 && !mostrandoQR) {
            <div class="table-card p-4 text-center" style="color: #94a3b8;">
              <i class="bi bi-whatsapp" style="font-size: 2rem; display: block; margin-bottom: 0.5rem; color: #25D366; opacity: 0.4;"></i>
              Nenhum número conectado ainda.
              <button class="btn btn-primary btn-sm d-block mx-auto mt-2" (click)="adicionarWhatsApp()">
                Conectar primeiro número
              </button>
            </div>
          }
        </div>
      </div>
    }

    <!-- ── Telegram ──────────────────────────────────────── -->
    @if (plataformaSelecionada === 'telegram') {
      <div>
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 style="font-weight: 700; color: #0f172a; margin: 0;">
            <i class="bi bi-telegram me-2" style="color: #229ED9;"></i>
            Bots conectados
          </h6>
          <button class="btn btn-primary btn-sm" (click)="mostrandoFormTelegram = true">
            <i class="bi bi-plus-lg me-1"></i> Adicionar bot
          </button>
        </div>

        <!-- Formulário novo bot -->
        @if (mostrandoFormTelegram) {
          <div class="form-card mb-3">
            <h6 style="font-weight: 600; font-size: 0.9rem; margin-bottom: 1rem; color: #0f172a;">
              Conectar bot do Telegram
            </h6>

            <div class="mb-3 p-3 rounded" style="background: #f0f9ff; border: 1px solid #bae6fd; font-size: 0.8rem; color: #0369a1;">
              <i class="bi bi-info-circle me-1"></i>
              Crie um bot em <strong>&#64;BotFather</strong> no Telegram → /newbot → copie o token gerado
            </div>

            <div class="row g-3">
              <div class="col-12">
                <label class="form-label">Token do bot *</label>
                <input type="text" class="form-control font-monospace"
                  placeholder="1234567890:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                  [(ngModel)]="novoTokenTelegram" />
              </div>
            </div>

            <div class="d-flex gap-2 mt-3">
              <button class="btn btn-primary btn-sm" (click)="conectarTelegram()">
                <i class="bi bi-plug me-1"></i> Conectar
              </button>
              <button class="btn btn-outline-secondary btn-sm" (click)="mostrandoFormTelegram = false">
                Cancelar
              </button>
            </div>
          </div>
        }

        <!-- Lista de bots -->
        <div class="d-flex flex-column gap-3">
          @for (conta of contasTelegram; track conta.id) {
            <div class="table-card">
              <div class="table-card-header">
                <div class="d-flex align-items-center gap-3">
                  <div style="width: 42px; height: 42px; border-radius: 50%; background: #e0f2fe;
                              display: flex; align-items: center; justify-content: center;">
                    <i class="bi bi-robot" style="color: #0284c7;"></i>
                  </div>
                  <div>
                    <div style="font-weight: 600; font-size: 0.9rem; color: #0f172a;">{{ conta.botNome }}</div>
                    <div style="font-size: 0.72rem; color: #94a3b8; font-family: monospace;">
                      {{ conta.botToken | slice:0:20 }}...
                    </div>
                  </div>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <span class="badge-status badge-success">
                    <i class="bi bi-wifi"></i> Conectado
                  </span>
                  <button class="btn btn-sm btn-outline-danger" style="font-size: 0.75rem;">
                    Remover
                  </button>
                </div>
              </div>

              <div class="px-3 pb-3">
                <div class="d-flex justify-content-between align-items-center mb-2 mt-1">
                  <small style="font-weight: 600; color: #64748b; font-size: 0.75rem;">GRUPOS / CANAIS</small>
                  <button class="btn btn-sm" style="font-size: 0.75rem; color: #6366f1; padding: 0.2rem 0.5rem;">
                    <i class="bi bi-arrow-clockwise me-1"></i>Sincronizar
                  </button>
                </div>
                <div class="d-flex flex-column gap-1">
                  @for (grupo of conta.grupos; track grupo.id) {
                    <div class="d-flex align-items-center justify-content-between py-2 px-3"
                      style="background: #f8fafc; border-radius: 8px; border: 1px solid #f1f5f9;">
                      <div>
                        <div style="font-size: 0.83rem; font-weight: 500; color: #1e293b;">{{ grupo.nome }}</div>
                        <div style="font-size: 0.72rem; color: #94a3b8;">
                          <i class="bi bi-people me-1"></i>{{ grupo.membros | number }} membros
                        </div>
                      </div>
                      <div class="form-check form-switch mb-0">
                        <input class="form-check-input" type="checkbox" role="switch"
                          [checked]="grupo.ativo" (change)="grupo.ativo = !grupo.ativo" style="cursor:pointer;" />
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          }

          @if (contasTelegram.length === 0 && !mostrandoFormTelegram) {
            <div class="table-card p-4 text-center" style="color: #94a3b8;">
              <i class="bi bi-telegram" style="font-size: 2rem; display: block; margin-bottom: 0.5rem; color: #229ED9; opacity: 0.4;"></i>
              Nenhum bot conectado ainda.
              <button class="btn btn-primary btn-sm d-block mx-auto mt-2" (click)="mostrandoFormTelegram = true">
                Conectar primeiro bot
              </button>
            </div>
          }
        </div>
      </div>
    }

    <!-- ── LinkedIn ─────────────────────────────────────── -->
    @if (plataformaSelecionada === 'linkedin') {
      <div>
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 style="font-weight: 700; color: #0f172a; margin: 0;">
            <i class="bi bi-linkedin me-2" style="color: #0A66C2;"></i>
            Contas conectadas
          </h6>
          <button class="btn btn-primary btn-sm" (click)="mostrandoFormLinkedIn = true">
            <i class="bi bi-plus-lg me-1"></i> Adicionar conta
          </button>
        </div>

        <div class="mb-3 p-3 rounded" style="background: #f0f9ff; border: 1px solid #bae6fd; font-size: 0.8rem; color: #0369a1;">
          <i class="bi bi-info-circle me-1"></i>
          O post será publicado no <strong>feed pessoal</strong> da conta conectada. Certifique-se de que o perfil está configurado para postagens públicas.
        </div>

        @if (mostrandoFormLinkedIn) {
          <div class="form-card mb-3">
            <h6 style="font-weight: 600; font-size: 0.9rem; margin-bottom: 1rem; color: #0f172a;">
              Conectar conta do LinkedIn
            </h6>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">E-mail *</label>
                <input type="email" class="form-control" placeholder="seu@email.com"
                  [(ngModel)]="novaContaLI.email" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Senha *</label>
                <input type="password" class="form-control" placeholder="••••••••"
                  [(ngModel)]="novaContaLI.senha" />
              </div>
            </div>
            <div class="mt-2" style="font-size: 0.75rem; color: #94a3b8;">
              <i class="bi bi-shield-lock me-1"></i>
              As credenciais são salvas localmente e usadas apenas pelo servidor de automação.
            </div>
            <div class="d-flex gap-2 mt-3">
              <button class="btn btn-primary btn-sm" (click)="conectarLinkedIn()">
                <i class="bi bi-plug me-1"></i> Conectar
              </button>
              <button class="btn btn-outline-secondary btn-sm" (click)="mostrandoFormLinkedIn = false">
                Cancelar
              </button>
            </div>
          </div>
        }

        <div class="d-flex flex-column gap-3">
          @for (conta of contasLinkedIn; track conta.id) {
            <div class="table-card">
              <div class="table-card-header">
                <div class="d-flex align-items-center gap-3">
                  <div style="width: 42px; height: 42px; border-radius: 50%; background: #dbeafe;
                              display: flex; align-items: center; justify-content: center;">
                    <i class="bi bi-person" style="color: #1d4ed8;"></i>
                  </div>
                  <div>
                    <div style="font-weight: 600; font-size: 0.9rem; color: #0f172a;">{{ conta.nome }}</div>
                    <div style="font-size: 0.775rem; color: #64748b;">{{ conta.email }}</div>
                  </div>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <span class="badge-status badge-success">
                    <i class="bi bi-wifi"></i> Conectado
                  </span>
                  <button class="btn btn-sm btn-outline-danger" style="font-size: 0.75rem;"
                    (click)="desconectarLinkedIn(conta)">
                    Desconectar
                  </button>
                </div>
              </div>
              <div class="px-3 pb-3 pt-1">
                <div class="p-3 rounded" style="background: #f8fafc; border: 1px solid #f1f5f9; font-size: 0.8rem; color: #64748b;">
                  <i class="bi bi-megaphone me-1"></i>
                  As vagas serão postadas no <strong>feed</strong> desta conta. Não há grupos — o alcance depende da rede de conexões.
                </div>
              </div>
            </div>
          }

          @if (contasLinkedIn.length === 0 && !mostrandoFormLinkedIn) {
            <div class="table-card p-4 text-center" style="color: #94a3b8;">
              <i class="bi bi-linkedin" style="font-size: 2rem; display: block; margin-bottom: 0.5rem; color: #0A66C2; opacity: 0.4;"></i>
              Nenhuma conta conectada ainda.
              <button class="btn btn-primary btn-sm d-block mx-auto mt-2" (click)="mostrandoFormLinkedIn = true">
                Conectar primeira conta
              </button>
            </div>
          }
        </div>
      </div>
    }

    <!-- ── Facebook ──────────────────────────────────────── -->
    @if (plataformaSelecionada === 'facebook') {
      <div>
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 style="font-weight: 700; color: #0f172a; margin: 0;">
            <i class="bi bi-facebook me-2" style="color: #1877F2;"></i>
            Contas conectadas
          </h6>
          <button class="btn btn-primary btn-sm" (click)="mostrandoFormFacebook = true">
            <i class="bi bi-plus-lg me-1"></i> Adicionar conta
          </button>
        </div>

        <!-- Aviso -->
        <div class="mb-3 p-3 rounded" style="background: #fffbeb; border: 1px solid #fde68a; font-size: 0.8rem; color: #92400e;">
          <i class="bi bi-exclamation-triangle me-1"></i>
          A automação do Facebook usa Playwright (browser headless). Pode ser detectada pelo Facebook dependendo do padrão de uso. Use com moderação.
        </div>

        <!-- Formulário nova conta -->
        @if (mostrandoFormFacebook) {
          <div class="form-card mb-3">
            <h6 style="font-weight: 600; font-size: 0.9rem; margin-bottom: 1rem; color: #0f172a;">
              Conectar conta do Facebook
            </h6>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">E-mail *</label>
                <input type="email" class="form-control" placeholder="seu@email.com"
                  [(ngModel)]="novaContaFB.email" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Senha *</label>
                <input type="password" class="form-control" placeholder="••••••••"
                  [(ngModel)]="novaContaFB.senha" />
              </div>
            </div>
            <div class="mt-2" style="font-size: 0.75rem; color: #94a3b8;">
              <i class="bi bi-shield-lock me-1"></i>
              As credenciais são salvas localmente e usadas apenas pelo servidor de automação.
            </div>
            <div class="d-flex gap-2 mt-3">
              <button class="btn btn-primary btn-sm" (click)="conectarFacebook()">
                <i class="bi bi-plug me-1"></i> Conectar
              </button>
              <button class="btn btn-outline-secondary btn-sm" (click)="mostrandoFormFacebook = false">
                Cancelar
              </button>
            </div>
          </div>
        }

        <!-- Lista de contas FB -->
        <div class="d-flex flex-column gap-3">
          @for (conta of contasFacebook; track conta.id) {
            <div class="table-card">
              <div class="table-card-header">
                <div class="d-flex align-items-center gap-3">
                  <div style="width: 42px; height: 42px; border-radius: 50%; background: #dbeafe;
                              display: flex; align-items: center; justify-content: center;">
                    <i class="bi bi-person" style="color: #1d4ed8;"></i>
                  </div>
                  <div>
                    <div style="font-weight: 600; font-size: 0.9rem; color: #0f172a;">{{ conta.email }}</div>
                    <div style="font-size: 0.775rem; color: #64748b;">
                      {{ conta.grupos.length }} grupos cadastrados
                    </div>
                  </div>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <span class="badge-status badge-success">
                    <i class="bi bi-wifi"></i> Conectado
                  </span>
                  <button class="btn btn-sm btn-outline-danger" style="font-size: 0.75rem;">
                    Desconectar
                  </button>
                </div>
              </div>

              <div class="px-3 pb-3">
                <div class="d-flex justify-content-between align-items-center mb-2 mt-1">
                  <small style="font-weight: 600; color: #64748b; font-size: 0.75rem;">GRUPOS</small>
                  <button class="btn btn-sm" style="font-size: 0.75rem; color: #6366f1; padding: 0.2rem 0.5rem;">
                    <i class="bi bi-plus me-1"></i>Adicionar grupo manualmente
                  </button>
                </div>
                <div class="d-flex flex-column gap-1">
                  @for (grupo of conta.grupos; track grupo.id) {
                    <div class="d-flex align-items-center justify-content-between py-2 px-3"
                      style="background: #f8fafc; border-radius: 8px; border: 1px solid #f1f5f9;">
                      <div>
                        <div style="font-size: 0.83rem; font-weight: 500; color: #1e293b;">{{ grupo.nome }}</div>
                        <div style="font-size: 0.72rem; color: #94a3b8;">
                          <i class="bi bi-people me-1"></i>{{ grupo.membros | number }} membros
                        </div>
                      </div>
                      <div class="form-check form-switch mb-0">
                        <input class="form-check-input" type="checkbox" role="switch"
                          [checked]="grupo.ativo" (change)="grupo.ativo = !grupo.ativo" style="cursor:pointer;" />
                      </div>
                    </div>
                  }
                  @if (conta.grupos.length === 0) {
                    <div class="text-center py-3" style="color: #94a3b8; font-size: 0.82rem;">
                      Adicione os grupos manualmente (Facebook não permite listagem automática)
                    </div>
                  }
                </div>
              </div>
            </div>
          }

          @if (contasFacebook.length === 0 && !mostrandoFormFacebook) {
            <div class="table-card p-4 text-center" style="color: #94a3b8;">
              <i class="bi bi-facebook" style="font-size: 2rem; display: block; margin-bottom: 0.5rem; color: #1877F2; opacity: 0.4;"></i>
              Nenhuma conta conectada ainda.
              <button class="btn btn-primary btn-sm d-block mx-auto mt-2" (click)="mostrandoFormFacebook = true">
                Conectar primeira conta
              </button>
            </div>
          }
        </div>
      </div>
    }
  `,
})
export class ContasComponent {
  plataformaSelecionada: PlataformaId = 'whatsapp';
  mostrandoQR = false;
  mostrandoFormTelegram = false;
  mostrandoFormFacebook = false;
  mostrandoFormLinkedIn = false;
  novoTokenTelegram = '';
  novaContaFB = { email: '', senha: '' };
  novaContaLI = { email: '', senha: '' };
  contasLinkedIn: ContaLinkedIn[] = [];

  plataformas = [
    { id: 'whatsapp' as PlataformaId, nome: 'WhatsApp', icone: 'bi-whatsapp', cor: '#25D366', contas: 1 },
    { id: 'telegram' as PlataformaId, nome: 'Telegram',  icone: 'bi-telegram',  cor: '#229ED9', contas: 1 },
    { id: 'facebook'  as PlataformaId, nome: 'Facebook',  icone: 'bi-facebook',  cor: '#1877F2', contas: 0 },
    { id: 'linkedin'  as PlataformaId, nome: 'LinkedIn',  icone: 'bi-linkedin',  cor: '#0A66C2', contas: 0 },
  ];

  contasWA: ContaWhatsApp[] = [
    {
      id: 1,
      numero: '+55 (11) 99999-0000',
      status: 'conectado',
      grupos: [
        { id: 1, nome: 'Vagas TI - São Paulo',   membros: 1240, ativo: true  },
        { id: 2, nome: 'Empregos BH e Região',    membros: 876,  ativo: true  },
        { id: 3, nome: 'Oportunidades RJ',         membros: 534,  ativo: false },
        { id: 4, nome: 'Vagas Remotas Brasil',     membros: 3200, ativo: true  },
      ],
    },
  ];

  contasTelegram: ContaTelegram[] = [
    {
      id: 1,
      botNome: '@indicai_bot',
      botToken: '1234567890:ABCdefGhIJKlmNoPQRsTUVwxyZ',
      status: 'conectado',
      grupos: [
        { id: 5, nome: '@vagas_tech_br',           membros: 8900, ativo: true },
        { id: 6, nome: 'Empregos e Oportunidades', membros: 4300, ativo: true },
      ],
    },
  ];

  contasFacebook: ContaFacebook[] = [];

  adicionarWhatsApp(): void {
    this.mostrandoQR = true;
  }

  simularConexaoWA(): void {
    this.contasWA.push({
      id: this.contasWA.length + 1,
      numero: '+55 (21) 98888-1111',
      status: 'conectado',
      grupos: [],
    });
    this.mostrandoQR = false;
    this.atualizarContadorPlataforma('whatsapp', this.contasWA.length);
  }

  desconectarWA(conta: ContaWhatsApp): void {
    this.contasWA = this.contasWA.filter((c) => c.id !== conta.id);
    this.atualizarContadorPlataforma('whatsapp', this.contasWA.length);
  }

  conectarTelegram(): void {
    if (!this.novoTokenTelegram) return;
    this.contasTelegram.push({
      id: this.contasTelegram.length + 1,
      botNome: '@novo_bot',
      botToken: this.novoTokenTelegram,
      status: 'conectado',
      grupos: [],
    });
    this.novoTokenTelegram = '';
    this.mostrandoFormTelegram = false;
    this.atualizarContadorPlataforma('telegram', this.contasTelegram.length);
  }

  conectarFacebook(): void {
    if (!this.novaContaFB.email || !this.novaContaFB.senha) return;
    this.contasFacebook.push({
      id: this.contasFacebook.length + 1,
      email: this.novaContaFB.email,
      status: 'conectado',
      grupos: [],
    });
    this.novaContaFB = { email: '', senha: '' };
    this.mostrandoFormFacebook = false;
    this.atualizarContadorPlataforma('facebook', this.contasFacebook.length);
  }

  desconectarLinkedIn(conta: ContaLinkedIn): void {
    this.contasLinkedIn = this.contasLinkedIn.filter((c) => c.id !== conta.id);
    this.atualizarContadorPlataforma('linkedin', this.contasLinkedIn.length);
  }

  conectarLinkedIn(): void {
    if (!this.novaContaLI.email || !this.novaContaLI.senha) return;
    this.contasLinkedIn.push({
      id: this.contasLinkedIn.length + 1,
      email: this.novaContaLI.email,
      nome: this.novaContaLI.email.split('@')[0],
      status: 'conectado',
    });
    this.novaContaLI = { email: '', senha: '' };
    this.mostrandoFormLinkedIn = false;
    this.atualizarContadorPlataforma('linkedin', this.contasLinkedIn.length);
  }

  private atualizarContadorPlataforma(id: PlataformaId, total: number): void {
    const p = this.plataformas.find((x) => x.id === id);
    if (p) p.contas = total;
  }
}
