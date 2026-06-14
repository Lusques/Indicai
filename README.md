# Indicaí 📡

> Distribuição automática de vagas para grupos de WhatsApp, Telegram, Facebook e LinkedIn.

---

## Visão geral

O **Indicaí** automatiza o processo de divulgação de vagas indicadas. Você cadastra a vaga uma vez e o sistema distribui automaticamente para todos os grupos e canais configurados — WhatsApp, Telegram, Facebook e LinkedIn — gerando a imagem do post e o texto formatado.

---

## Stack

| Camada      | Tecnologia                              |
|-------------|------------------------------------------|
| Frontend    | Angular 19 + Bootstrap 5 + Bootstrap Icons |
| Backend     | Node.js + Express + TypeScript (fase 2) |
| Banco       | PostgreSQL + Prisma ORM (fase 2)        |
| WhatsApp    | Baileys (@whiskeysockets/baileys)       |
| Facebook    | Playwright + stealth plugin             |
| Telegram    | API oficial (Telegraf)                  |
| Imagens     | HTML template → Playwright screenshot   |

---

## Fases do projeto

### ✅ Fase 1 — MVP Frontend
- [x] Layout com sidebar e topbar
- [x] Dashboard com stats e tabela de vagas
- [x] Formulário de nova vaga com preview
- [x] Gerenciamento de canais e grupos

### 🔄 Fase 2 — Backend + WhatsApp
- [ ] API REST com Node.js + Express
- [ ] Banco PostgreSQL com Prisma
- [ ] Integração com Baileys (WhatsApp)
- [ ] Integração com Telegram Bot API

### 📋 Fase 3 — Automação completa
- [ ] Facebook via Playwright stealth
- [ ] Geração de imagem automática
- [ ] Fila de postagens com BullMQ
- [ ] Agendamento de posts
- [ ] Histórico e relatórios

---

## Como rodar

### Pré-requisitos
- Node.js 20+
- npm 10+
- Angular CLI 19

### Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm start
```

Acesse `http://localhost:4200`

---

## Estrutura do projeto

```
indicai/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── sidebar/        # Navegação lateral
│   │   │   └── topbar/         # Barra superior
│   │   ├── pages/
│   │   │   ├── dashboard/      # Visão geral e vagas recentes
│   │   │   ├── nova-vaga/      # Formulário + preview + seleção de canais
│   │   │   └── canais/         # Gestão de grupos por plataforma
│   │   ├── app.component.ts    # Layout raiz
│   │   ├── app.config.ts       # Providers Angular
│   │   └── app.routes.ts       # Rotas
│   ├── styles.scss             # Estilos globais
│   └── index.html
├── angular.json
├── package.json
└── tsconfig.json
```

---

## Canais suportados

| Canal     | Método           | Status      |
|-----------|------------------|-------------|
| WhatsApp  | Baileys          | ✅ Fase 2   |
| Telegram  | API oficial      | ✅ Fase 2   |
| Facebook  | Playwright       | 🔄 Fase 3   |
| LinkedIn  | API + Playwright | 🔄 Fase 3   |
