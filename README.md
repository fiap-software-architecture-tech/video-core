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