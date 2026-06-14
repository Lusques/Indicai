import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface CanalOpcao {
  id: string;
  nome: string;
  icone: string;
  cor: string;
  selecionado: boolean;
  grupos: number;
}

@Component({
  selector: 'app-nova-vaga',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-header">
      <h4>Nova Vaga</h4>
      <p>Preencha os dados e distribua nos canais selecionados</p>
    </div>

    <div class="row g-4">

      <!-- Formulário -->
      <div class="col-lg-7">
        <div class="form-card">
          <h6 style="font-weight: 700; color: #0f172a; margin-bottom: 1.25rem;">
            <i class="bi bi-briefcase me-2" style="color: #6366f1;"></i>
            Dados da vaga
          </h6>

          <div class="row g-3">

            <div class="col-12">
              <label class="form-label">Título da vaga *</label>
              <input
                type="text"
                class="form-control"
                placeholder="ex: Desenvolvedor Frontend Pleno"
                [(ngModel)]="form.titulo"
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">Empresa *</label>
              <input
                type="text"
                class="form-control"
                placeholder="Nome da empresa"
                [(ngModel)]="form.empresa"
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">Área *</label>
              <select class="form-select" [(ngModel)]="form.area">
                <option value="">Selecione...</option>
                <option *ngFor="let area of areas" [value]="area">{{ area }}</option>
              </select>
            </div>

            <div class="col-12">
              <label class="form-label">Descrição / Texto do post *</label>
              <textarea
                class="form-control"
                rows="5"
                placeholder="Descreva a vaga, requisitos, benefícios e como se candidatar..."
                [(ngModel)]="form.descricao"
              ></textarea>
              <div class="d-flex justify-content-between mt-1">
                <small class="text-muted">Esse texto vai no corpo do post</small>
                <small [class.text-danger]="form.descricao.length > 1000" class="text-muted">
                  {{ form.descricao.length }}/1000
                </small>
              </div>
            </div>

          </div>
        </div>

        <!-- Seleção de canais -->
        <div class="form-card mt-3">
          <h6 style="font-weight: 700; color: #0f172a; margin-bottom: 1.25rem;">
            <i class="bi bi-broadcast-pin me-2" style="color: #6366f1;"></i>
            Onde distribuir
          </h6>

          <div class="d-flex flex-column gap-2">
            @for (canal of canais; track canal.id) {
              <div
                class="canal-card"
                [style.border-color]="canal.selecionado ? '#6366f1' : '#e2e8f0'"
                [style.background]="canal.selecionado ? '#f5f3ff' : '#ffffff'"
                style="cursor: pointer;"
                (click)="toggleCanal(canal)"
              >
                <div
                  class="canal-icon"
                  [style.background]="canal.cor + '20'"
                >
                  <i class="bi" [class]="canal.icone" [style.color]="canal.cor"></i>
                </div>

                <div class="canal-info">
                  <h6>{{ canal.nome }}</h6>
                  <small>{{ canal.grupos }} grupos configurados</small>
                </div>

                <div class="form-check form-switch mb-0">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                    [checked]="canal.selecionado"
                    (click)="$event.stopPropagation()"
                    (change)="toggleCanal(canal)"
                    style="cursor: pointer;"
                  />
                </div>
              </div>
            }
          </div>

          <div class="mt-3 d-flex justify-content-between align-items-center">
            <small class="text-muted">
              <i class="bi bi-info-circle me-1"></i>
              {{ canaisSelecionados }} canal(is) selecionado(s)
            </small>
            <a routerLink="/canais" style="font-size: 0.8rem; color: #6366f1;">
              Gerenciar canais →
            </a>
          </div>
        </div>

        <!-- Ações -->
        <div class="d-flex gap-2 mt-3">
          <button
            class="btn btn-primary flex-fill"
            [disabled]="!formValido"
            (click)="postar()"
          >
            <i class="bi bi-send me-2"></i>
            Postar agora
          </button>
          <button class="btn btn-outline-secondary" routerLink="/dashboard">
            Cancelar
          </button>
        </div>
      </div>

      <!-- Preview -->
      <div class="col-lg-5">
        <div class="form-card" style="position: sticky; top: 80px;">
          <h6 style="font-weight: 700; color: #0f172a; margin-bottom: 1rem;">
            <i class="bi bi-eye me-2" style="color: #6366f1;"></i>
            Preview do post
          </h6>

          <div class="post-preview">
            <div class="preview-label">Como ficará a imagem</div>
            <div class="preview-image">
              @if (form.empresa) {
                <div class="preview-empresa">{{ form.empresa }}</div>
              }
              <div class="preview-titulo">
                {{ form.titulo || 'Título da vaga' }}
              </div>
              @if (form.area) {
                <div class="preview-area">{{ form.area }}</div>
              }
            </div>
            <div class="preview-body">
              {{ form.descricao || 'A descrição da vaga aparecerá aqui...' }}
            </div>
          </div>

          @if (canaisSelecionados > 0) {
            <div
              class="mt-3 p-3 rounded"
              style="background: #f0fdf4; border: 1px solid #bbf7d0;"
            >
              <div style="font-size: 0.8rem; font-weight: 600; color: #15803d;">
                <i class="bi bi-check-circle me-1"></i>
                Vai ser enviado para {{ canaisSelecionados }} canal(is)
              </div>
              <div style="font-size: 0.75rem; color: #166534; margin-top: 0.25rem;">
                @for (canal of canaisSelecionadosList; track canal.id) {
                  <span class="me-2">• {{ canal.nome }}</span>
                }
              </div>
            </div>
          }
        </div>
      </div>

    </div>
  `,
})
export class NovaVagaComponent {
  form = {
    titulo: '',
    empresa: '',
    area: '',
    descricao: '',
  };

  areas = [
    'Tecnologia',
    'Marketing',
    'Vendas',
    'Administrativo',
    'Financeiro',
    'RH',
    'Operações',
    'Design',
    'Jurídico',
    'Saúde',
    'Educação',
    'Outros',
  ];

  canais: CanalOpcao[] = [
    {
      id: 'whatsapp',
      nome: 'WhatsApp',
      icone: 'bi-whatsapp',
      cor: '#25D366',
      selecionado: true,
      grupos: 8,
    },
    {
      id: 'telegram',
      nome: 'Telegram',
      icone: 'bi-telegram',
      cor: '#229ED9',
      selecionado: true,
      grupos: 3,
    },
    {
      id: 'facebook',
      nome: 'Facebook',
      icone: 'bi-facebook',
      cor: '#1877F2',
      selecionado: false,
      grupos: 5,
    },
    {
      id: 'linkedin',
      nome: 'LinkedIn',
      icone: 'bi-linkedin',
      cor: '#0A66C2',
      selecionado: false,
      grupos: 1,
    },
  ];

  get canaisSelecionados(): number {
    return this.canais.filter((c) => c.selecionado).length;
  }

  get canaisSelecionadosList(): CanalOpcao[] {
    return this.canais.filter((c) => c.selecionado);
  }

  get formValido(): boolean {
    return (
      !!this.form.titulo &&
      !!this.form.empresa &&
      !!this.form.area &&
      !!this.form.descricao &&
      this.canaisSelecionados > 0
    );
  }

  toggleCanal(canal: CanalOpcao): void {
    canal.selecionado = !canal.selecionado;
  }

  postar(): void {
    if (!this.formValido) return;
    // TODO: integrar com backend
    alert(`Vaga "${this.form.titulo}" enviada para ${this.canaisSelecionados} canal(is)!`);
  }
}
