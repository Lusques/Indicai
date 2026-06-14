import { Component, ElementRef, ViewChild } from '@angular/core';
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

interface Agendamento {
  id: number;
  data: string;
  hora: string;
}

@Component({
  selector: 'app-nova-vaga',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-header">
      <h4>Nova Vaga</h4>
      <p>Preencha os dados, faça upload da imagem e distribua nos canais selecionados</p>
    </div>

    <div class="row g-4">

      <!-- ── Coluna esquerda ───────────────────────────────── -->
      <div class="col-lg-7">

        <!-- Dados da vaga -->
        <div class="form-card">
          <h6 class="form-section-title">
            <i class="bi bi-briefcase me-2" style="color: #6366f1;"></i>
            Dados da vaga
          </h6>

          <div class="row g-3">
            <div class="col-12">
              <label class="form-label">Título da vaga *</label>
              <input type="text" class="form-control"
                placeholder="ex: Desenvolvedor Frontend Pleno"
                [(ngModel)]="form.titulo" />
            </div>

            <div class="col-md-6">
              <label class="form-label">Empresa *</label>
              <input type="text" class="form-control"
                placeholder="Nome da empresa"
                [(ngModel)]="form.empresa" />
            </div>

            <div class="col-md-6">
              <label class="form-label">Área *</label>
              <select class="form-select" [(ngModel)]="form.area">
                <option value="">Selecione...</option>
                <option *ngFor="let area of areas" [value]="area">{{ area }}</option>
              </select>
            </div>

            <div class="col-12">
              <label class="form-label">Legenda da imagem *</label>
              <textarea class="form-control" rows="5"
                placeholder="Descreva a vaga, requisitos, benefícios e como se candidatar. Este texto vai como legenda da imagem em todos os canais."
                [(ngModel)]="form.descricao"></textarea>
              <div class="d-flex justify-content-end mt-1">
                <small [class.text-danger]="form.descricao.length > 1000" class="text-muted">
                  {{ form.descricao.length }}/1000
                </small>
              </div>
            </div>
          </div>
        </div>

        <!-- Upload de imagem -->
        <div class="form-card mt-3">
          <h6 class="form-section-title">
            <i class="bi bi-image me-2" style="color: #6366f1;"></i>
            Imagem do post
          </h6>

          <!-- Área de upload -->
          @if (!imagemPreview) {
            <div
              class="upload-area"
              [class.dragover]="isDragging"
              (dragover)="onDragOver($event)"
              (dragleave)="onDragLeave()"
              (drop)="onDrop($event)"
              (click)="fileInput.click()"
            >
              <i class="bi bi-cloud-upload" style="font-size: 2rem; color: #94a3b8;"></i>
              <div style="font-weight: 600; color: #475569; margin-top: 0.5rem;">
                Arraste a imagem aqui ou clique para selecionar
              </div>
              <div style="font-size: 0.78rem; color: #94a3b8; margin-top: 0.25rem;">
                PNG, JPG ou WEBP — máx. 5MB
              </div>
            </div>
          }

          <!-- Preview da imagem carregada -->
          @if (imagemPreview) {
            <div class="uploaded-image-wrapper">
              <img [src]="imagemPreview" alt="Preview" class="uploaded-image" />
              <div class="uploaded-image-overlay">
                <button class="btn btn-sm btn-light" (click)="removerImagem()">
                  <i class="bi bi-trash me-1"></i> Remover
                </button>
                <button class="btn btn-sm btn-light" (click)="fileInput.click()">
                  <i class="bi bi-arrow-repeat me-1"></i> Trocar
                </button>
              </div>
            </div>
          }

          <input #fileInput type="file" accept="image/*" hidden (change)="onFileSelected($event)" />

          @if (imagemPreview) {
            <div class="mt-2 d-flex align-items-center gap-2"
              style="font-size: 0.78rem; color: #15803d;">
              <i class="bi bi-check-circle-fill"></i>
              {{ imagemNome }} carregada com sucesso
            </div>
          }
        </div>

        <!-- Canais -->
        <div class="form-card mt-3">
          <h6 class="form-section-title">
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
                <div class="canal-icon"
                  style="width: 40px; height: 40px; border-radius: 10px;
                         display: flex; align-items: center; justify-content: center;"
                  [style.background]="canal.cor + '20'">
                  <i class="bi" [class]="canal.icone" [style.color]="canal.cor"></i>
                </div>

                <div class="canal-info">
                  <h6>{{ canal.nome }}</h6>
                  <small>{{ canal.grupos }} grupos configurados</small>
                </div>

                <div class="form-check form-switch mb-0">
                  <input class="form-check-input" type="checkbox" role="switch"
                    [checked]="canal.selecionado"
                    (click)="$event.stopPropagation()"
                    (change)="toggleCanal(canal)"
                    style="cursor: pointer;" />
                </div>
              </div>
            }
          </div>

          <div class="mt-3 d-flex justify-content-between align-items-center">
            <small class="text-muted">
              <i class="bi bi-info-circle me-1"></i>
              {{ canaisSelecionados }} canal(is) selecionado(s)
            </small>
            <a routerLink="/contas" style="font-size: 0.8rem; color: #6366f1;">
              Gerenciar contas →
            </a>
          </div>
        </div>

        <!-- Agendamento -->
        <div class="form-card mt-3">
          <h6 class="form-section-title">
            <i class="bi bi-calendar-event me-2" style="color: #6366f1;"></i>
            Quando publicar
          </h6>

          <!-- Toggle postar agora / agendar -->
          <div class="d-flex gap-2 mb-3">
            <button
              class="btn btn-sm flex-fill"
              [class.btn-primary]="!agendando"
              [class.btn-outline-secondary]="agendando"
              (click)="agendando = false"
            >
              <i class="bi bi-send me-1"></i> Postar agora
            </button>
            <button
              class="btn btn-sm flex-fill"
              [class.btn-primary]="agendando"
              [class.btn-outline-secondary]="!agendando"
              (click)="agendando = true"
            >
              <i class="bi bi-clock me-1"></i> Agendar
            </button>
          </div>

          @if (!agendando) {
            <div class="p-3 rounded" style="background: #f0fdf4; border: 1px solid #bbf7d0;
                font-size: 0.82rem; color: #15803d;">
              <i class="bi bi-lightning-charge-fill me-1"></i>
              A vaga será postada imediatamente ao confirmar.
            </div>
          }

          @if (agendando) {
            <div>
              <!-- Lista de agendamentos -->
              <div class="d-flex flex-column gap-2 mb-3">
                @for (ag of agendamentos; track ag.id) {
                  <div class="d-flex align-items-center gap-2 p-2 rounded"
                    style="background: #f8fafc; border: 1px solid #e2e8f0;">
                    <i class="bi bi-calendar-check" style="color: #6366f1;"></i>
                    <div class="row g-2 flex-fill">
                      <div class="col-6">
                        <input type="date" class="form-control form-control-sm"
                          [(ngModel)]="ag.data" />
                      </div>
                      <div class="col-4">
                        <input type="time" class="form-control form-control-sm"
                          [(ngModel)]="ag.hora" />
                      </div>
                    </div>
                    <button class="btn btn-sm text-danger p-1" (click)="removerAgendamento(ag)"
                      [disabled]="agendamentos.length === 1">
                      <i class="bi bi-x-lg"></i>
                    </button>
                  </div>
                }
              </div>

              <button class="btn btn-sm btn-outline-secondary w-100" (click)="adicionarAgendamento()">
                <i class="bi bi-plus-lg me-1"></i> Adicionar outro horário
              </button>

              <div class="mt-2" style="font-size: 0.75rem; color: #94a3b8;">
                <i class="bi bi-info-circle me-1"></i>
                A mesma vaga será postada em cada um dos horários configurados.
              </div>
            </div>
          }
        </div>

        <!-- Ações -->
        <div class="d-flex gap-2 mt-3">
          <button class="btn btn-primary flex-fill" [disabled]="!formValido" (click)="postar()">
            <i class="bi" [class]="agendando ? 'bi-calendar-check' : 'bi-send'" style="margin-right: 0.4rem;"></i>
            {{ agendando ? 'Agendar postagem' : 'Postar agora' }}
          </button>
          <button class="btn btn-outline-secondary" (click)="salvarRascunho()">
            <i class="bi bi-floppy me-1"></i> Rascunho
          </button>
          <a class="btn btn-outline-secondary" routerLink="/dashboard">Cancelar</a>
        </div>

      </div>

      <!-- ── Coluna direita: preview ───────────────────────── -->
      <div class="col-lg-5">
        <div class="form-card" style="position: sticky; top: 80px;">
          <h6 class="form-section-title">
            <i class="bi bi-eye me-2" style="color: #6366f1;"></i>
            Preview do post
          </h6>

          <!-- Preview estilo mensagem real -->
          <div class="post-preview">
            <div class="preview-label">
              <i class="bi bi-whatsapp me-1" style="color: #25D366;"></i>
              Como aparece nas plataformas
            </div>

            <!-- Imagem -->
            @if (imagemPreview) {
              <img [src]="imagemPreview" alt="Preview"
                style="width: 100%; height: auto; display: block;" />
            } @else {
              <div style="width: 100%; height: 160px; background: #f1f5f9;
                          display: flex; flex-direction: column; align-items: center;
                          justify-content: center; gap: 0.4rem; color: #94a3b8;">
                <i class="bi bi-image" style="font-size: 2rem;"></i>
                <span style="font-size: 0.75rem;">Faça upload da imagem da empresa</span>
              </div>
            }

            <!-- Legenda (como aparece no WhatsApp/Telegram/etc) -->
            <div class="preview-body" style="border-top: 1px solid #e2e8f0;">
              <div style="font-size: 0.7rem; color: #94a3b8; margin-bottom: 0.4rem;
                          font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em;">
                Legenda / Descrição
              </div>
              <div style="white-space: pre-wrap; color: #1e293b; font-size: 0.83rem; line-height: 1.6;">
                {{ form.descricao || 'Escreva a descrição da vaga — este texto vai como legenda da imagem em todos os canais.' }}
              </div>
            </div>
          </div>

          <!-- Resumo do envio -->
          @if (canaisSelecionados > 0) {
            <div class="mt-3 p-3 rounded"
              style="background: #f0fdf4; border: 1px solid #bbf7d0;">
              <div style="font-size: 0.8rem; font-weight: 600; color: #15803d;">
                <i class="bi bi-check-circle me-1"></i>
                {{ canaisSelecionados }} canal(is) selecionado(s)
              </div>
              <div style="font-size: 0.75rem; color: #166534; margin-top: 0.25rem;">
                @for (canal of canaisSelecionadosList; track canal.id) {
                  <span class="me-2">• {{ canal.nome }}</span>
                }
              </div>
            </div>
          }

          @if (agendando && agendamentos.length > 0) {
            <div class="mt-2 p-3 rounded"
              style="background: #f0f4ff; border: 1px solid #c7d2fe;">
              <div style="font-size: 0.8rem; font-weight: 600; color: #4338ca;">
                <i class="bi bi-clock me-1"></i>
                {{ agendamentos.length }} horário(s) agendado(s)
              </div>
              @for (ag of agendamentos; track ag.id) {
                <div style="font-size: 0.75rem; color: #3730a3; margin-top: 0.2rem;">
                  • {{ ag.data || '—' }} às {{ ag.hora || '—' }}
                </div>
              }
            </div>
          }
        </div>
      </div>

    </div>
  `,
  styles: [`
    .form-section-title {
      font-weight: 700;
      font-size: 0.9rem;
      color: #0f172a;
      margin-bottom: 1.25rem;
    }

    .upload-area {
      border: 2px dashed #cbd5e1;
      border-radius: 12px;
      padding: 2.5rem 1rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      background: #f8fafc;

      &:hover, &.dragover {
        border-color: #6366f1;
        background: #f5f3ff;
      }
    }

    .uploaded-image-wrapper {
      position: relative;
      border-radius: 12px;
      overflow: hidden;

      &:hover .uploaded-image-overlay {
        opacity: 1;
      }
    }

    .uploaded-image {
      width: 100%;
      max-height: 240px;
      object-fit: cover;
      display: block;
      border-radius: 12px;
    }

    .uploaded-image-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      opacity: 0;
      transition: opacity 0.2s ease;
      border-radius: 12px;
    }
  `],
})
export class NovaVagaComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  form = {
    titulo: '',
    empresa: '',
    area: '',
    descricao: '',
  };

  imagemPreview: string | null = null;
  imagemNome = '';
  isDragging = false;
  agendando = false;

  agendamentos: Agendamento[] = [
    { id: 1, data: this.dataHoje(), hora: '08:00' },
  ];

  areas = [
    'Tecnologia', 'Marketing', 'Vendas', 'Administrativo',
    'Financeiro', 'RH', 'Operações', 'Design',
    'Jurídico', 'Saúde', 'Educação', 'Outros',
  ];

  canais: CanalOpcao[] = [
    { id: 'whatsapp', nome: 'WhatsApp', icone: 'bi-whatsapp', cor: '#25D366', selecionado: true,  grupos: 8 },
    { id: 'telegram', nome: 'Telegram', icone: 'bi-telegram', cor: '#229ED9', selecionado: true,  grupos: 3 },
    { id: 'facebook', nome: 'Facebook', icone: 'bi-facebook', cor: '#1877F2', selecionado: false, grupos: 5 },
    { id: 'linkedin', nome: 'LinkedIn', icone: 'bi-linkedin', cor: '#0A66C2', selecionado: false, grupos: 1 },
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

  // ── Upload de imagem ──────────────────────────────────────

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.processarArquivo(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(): void {
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer?.files[0];
    if (file && file.type.startsWith('image/')) {
      this.processarArquivo(file);
    }
  }

  private processarArquivo(file: File): void {
    this.imagemNome = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagemPreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  removerImagem(): void {
    this.imagemPreview = null;
    this.imagemNome = '';
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  // ── Agendamento ───────────────────────────────────────────

  adicionarAgendamento(): void {
    this.agendamentos.push({
      id: Date.now(),
      data: this.dataHoje(),
      hora: '08:00',
    });
  }

  removerAgendamento(ag: Agendamento): void {
    if (this.agendamentos.length > 1) {
      this.agendamentos = this.agendamentos.filter((a) => a.id !== ag.id);
    }
  }

  private dataHoje(): string {
    return new Date().toISOString().split('T')[0];
  }

  // ── Ações ─────────────────────────────────────────────────

  postar(): void {
    if (!this.formValido) return;
    const acao = this.agendando ? 'agendada' : 'postada';
    alert(`Vaga "${this.form.titulo}" ${acao} para ${this.canaisSelecionados} canal(is)!`);
  }

  salvarRascunho(): void {
    alert('Rascunho salvo! (integração com backend em breve)');
  }
}
