# video-core

API REST para plataforma de upload e processamento de vídeos desenvolvida com Node.js, TypeScript, Fastify e Prisma.

## 📌 Visão Geral

**video-core** é o serviço principal da plataforma de processamento de vídeos, responsável por:
- Autenticação de usuários (JWT)
- Upload de vídeos para S3
- Publicação de eventos de processamento via SQS
- Listagem de jobs de processamento

## 🚀 Tecnologias

- **Runtime**: Node.js 20
- **Framework**: Fastify
- **ORM**: Prisma
- **Database**: MySQL (RDS em produção)
- **Storage**: AWS S3
- **Queue**: AWS SQS
- **Auth**: JWT
- **Hash**: Bcrypt
- **Logger**: Pino

## 📋 Pré-requisitos

- Node.js >= 20
- Docker & Docker Compose (para desenvolvimento local)
- AWS CLI (para deploy)

## ⚙️ Desenvolvimento Local

### 1. Clonar repositório

```bash
git clone https://github.com/fiap-software-architecture-tech/video-core.git
cd video-core
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
# Edite .env com suas configurações
```

### 4. Subir infraestrutura local (LocalStack)

```bash
docker-compose up -d
```

Isso irá iniciar:
- LocalStack (S3 + SQS)
- MySQL
- Prisma Studio

### 5. Executar migrations

```bash
npm run prisma:migrate
```

### 6. Rodar aplicação

```bash
# Desenvolvimento (watch mode)
npm run dev

# Produção
npm run build
npm start
```

A API estará disponível em: `http://localhost:3000`

## 🚢 Deploy em Produção (AWS)

### Pré-requisito

Antes de fazer deploy da aplicação, provisione a infraestrutura AWS:
👉 [video-infra](https://github.com/fiap-software-architecture-tech/video-infra)

### CI/CD com GitHub Actions

Este repositório possui workflow automatizado para build e deploy no AWS ECS.

#### Configuração Inicial

1. **Configure os secrets no GitHub:**
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_SESSION_TOKEN` (se usar AWS Academy)

2. **Configure as variáveis do repositório** (para deploy automático):
   - `ECR_REPOSITORY_URL`
   - `ECR_REPOSITORY_NAME`
   - `ECS_CLUSTER_NAME`
   - `ECS_SERVICE_NAME`

   *(Obtenha estes valores do output do [video-infra deployment](https://github.com/fiap-software-architecture-tech/video-infra))*

3. **Deploy automático**: Push para `main` faz deploy automaticamente

4. **Deploy manual**: Execute via Actions tab fornecendo os valores manualmente

### Documentação Completa

📖 **Veja:** [DEPLOYMENT.md](DEPLOYMENT.md) para guia completo de deploy

### Scripts de Deploy

```bash
# Build e push da imagem Docker para ECR
./scripts/build-and-push.sh

# Deploy no ECS
./scripts/deploy-ecs.sh
```

📖 **Veja:** [scripts/README.md](scripts/README.md) para documentação dos scripts

## 🔗 Repositórios Relacionados

- **Aplicação**: video-core (este repositório) - API REST
- **Infraestrutura**: [video-infra](https://github.com/fiap-software-architecture-tech/video-infra) - Provisionamento AWS
- **Processamento**: video-processing-service - Lambda de processamento de vídeos

## 📚 Documentação Adicional

- [DEPLOYMENT.md](DEPLOYMENT.md) - Guia completo de deployment
- [scripts/README.md](scripts/README.md) - Documentação dos scripts de deploy

## 🚀 Funcionalidades Essenciais

### ⚡ Processamento Concorrente
- **Múltiplos vídeos simultâneos:** Arquitetura com SQS + ECS Fargate permite processamento paralelo
- **Escalabilidade automática:** Sistema escala horizontalmente conforme demanda
- **Não perde requisições:** SQS garante persistência das mensagens mesmo em picos de carga

### 🔐 Autenticação e Segurança
- **Proteção por usuário e senha:** Login com JWT + bcrypt
- **Tokens seguros:** Expiração configurável e refresh tokens

### 📋 Acompanhamento de Processamento
- **Status em tempo real:** PROCESSING → DONE → ERROR
- **Listagem por usuário:** Cada usuário vê apenas seus vídeos
- **Histórico completo:** Todos os jobs permanecem registrados

### 📧 Notificações Automáticas
- **Email em caso de erro:** Notificação HTML profissional quando falha o processamento
- **Detalhes do erro:** Informações específicas para ajudar o usuário
- **Template customizado:** Design profissional com branding

## 🧪 Testes e Qualidade

### 📊 Estratégia de Testes
- **Testes Unitários:** Use cases, repositories, services
- **Testes de Integração:** Controllers, APIs, fluxos completos
- **Mock Services:** Isolamento de dependências externas
- **Coverage:** Meta de 90%+ cobertura de código

### 🔧 Executar Testes
```bash
# Rodar todos os testes
npm test

# Modo watch (desenvolvimento)
npm run test:watch

# Coverage report
npm run test:coverage
```

### 📋 Qualidade de Código
- **ESLint + Prettier:** Padronização e formatação automática
- **TypeScript:** Tipagem forte e segurança
- **Arquitetura Limpa:** Separação clara de responsabilidades
- **DI Container:** Inversify para gerenciamento de dependências

## 🔄 CI/CD Pipeline

### 🚀 Workflows Automatizados
- **Build & Test:** `.github/workflows/build-and-test.yml`
  - Node.js setup
  - Install dependencies
  - Run lint + tests
  - Build application

- **Deploy:** `.github/workflows/deploy-app.yml`
  - Docker build & push (ECR)
  - Deploy automático no ECS
  - Trigger: push para main

### ⚙️ Configuração CI/CD
```bash
# Secrets necessários no GitHub
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_SESSION_TOKEN

# Variáveis do repositório
ECR_REPOSITORY_URL
ECR_REPOSITORY_NAME
ECS_CLUSTER_NAME
ECS_SERVICE_NAME
```

### 📦 Pipeline em Ação
1. **Push para main** → Trigger automático
2. **Build & Test** → Validação de qualidade
3. **Docker Image** → Build e push ECR
4. **ECS Deploy** → Atualização zero-downtime
5. **Health Check** → Monitoramento pós-deploy

## 🏗️ Arquitetura

Diagramas da arquitetura do sistema:

- **Arquitetura Completa** - Visão geral de todos os componentes
  - [docs/Draw_arch_full.jpeg](docs/Draw_arch_full.jpeg)
- **Arquitetura Detalhada** - Detalhes dos componentes e fluxos
  - [docs/Draw_arch_detail.jpeg](docs/Draw_arch_detail.jpeg)
- **Arquitetura de Login** - Fluxo de autenticação
  - [docs/Draw_arch_login.jpeg](docs/Draw_arch_login.jpeg)
