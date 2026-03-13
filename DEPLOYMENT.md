# 🚀 Deployment Workflow

Este repositório contém a aplicação video-core e o GitHub Actions workflow para build e deploy automático no AWS ECS.

## 📋 Estrutura

```
video-core/
├── src/                   # Application code
├── scripts/               # Deployment scripts
│   ├── build-and-push.sh # Build and push to ECR
│   └── deploy-ecs.sh     # Deploy to ECS
├── Dockerfile            # Container definition
└── .github/
    └── workflows/
        └── deploy-app.yml  # CI/CD workflow
```

## 🔄 Fluxo de Deploy

### 1. **Pré-requisito: Infraestrutura**

Antes de fazer deploy da aplicação, certifique-se de que a infraestrutura foi provisionada:
👉 [video-infra → Deploy Infrastructure](https://github.com/fiap-software-architecture-tech/video-infra/actions/workflows/deploy-infra.yml)

### 2. **Configuração Inicial**

#### Opção A: Deploy Manual (Primeira vez)

O workflow pode ser executado manualmente fornecendo os valores do Terraform:

1. Obtenha os outputs do [video-infra deployment](https://github.com/fiap-software-architecture-tech/video-infra/actions)
2. Vá para: [Actions → Deploy Application](https://github.com/fiap-software-architecture-tech/video-core/actions/workflows/deploy-app.yml)
3. Clique em "Run workflow"
4. Preencha os campos:
   - **ECR Repository URL**: `123456789012.dkr.ecr.us-east-1.amazonaws.com/video-core-image`
   - **ECR Repository Name**: `video-core-image`
   - **ECS Cluster Name**: `video-core-cluster-dev`
   - **ECS Service Name**: `video-core-service-dev`
5. Execute o workflow

#### Opção B: Deploy Automático (Recomendado)

Configure as variáveis uma vez para habilitar deploy automático em cada push:

1. Vá para: [Settings → Secrets and variables → Actions → Variables](https://github.com/fiap-software-architecture-tech/video-core/settings/variables/actions)
2. Clique em "New repository variable"
3. Adicione as seguintes variáveis:

| Nome | Valor | Descrição |
|------|-------|-----------|
| `ECR_REPOSITORY_URL` | `<account>.dkr.ecr.us-east-1.amazonaws.com/video-core-image` | Do Terraform output |
| `ECR_REPOSITORY_NAME` | `video-core-image` | Do Terraform output |
| `ECS_CLUSTER_NAME` | `video-core-cluster-dev` | Do Terraform output |
| `ECS_SERVICE_NAME` | `video-core-service-dev` | Do Terraform output |

**Onde encontrar estes valores?**
- Vá para o último run do [video-infra workflow](https://github.com/fiap-software-architecture-tech/video-infra/actions)
- Veja o step "Infrastructure Summary"
- Copie os valores exibidos

### 3. **Trigger do Workflow**

Após configuração, o workflow é acionado quando:
- ✅ Push para branch `main` com mudanças em código
- ✅ Execução manual via Actions tab

### 4. **Etapas do Deploy**

```mermaid
graph LR
    A[Push/Manual] --> B[Checkout Code]
    B --> C[Configure AWS]
    C --> D[Set Variables]
    D --> E[Build Docker Image]
    E --> F[Push to ECR]
    F --> G[Deploy to ECS]
    G --> H[Container Starts]
    H --> I[Run Migrations]
    I --> J[Start Application]
```

## 🗄️ Database Migrations

As migrations do Prisma são executadas **automaticamente** quando o container inicia.

### Como Funciona

O container usa um script de entrypoint (`docker-entrypoint.sh`) que:

1. 🗄️ Executa `npx prisma migrate deploy`
2. ✅ Aguarda conclusão das migrations
3. 🚀 Inicia a aplicação Node.js

### Logs de Migration

Para ver os logs das migrations:

```bash
# Ver logs do ECS
aws logs tail /ecs/video-core-dev --follow --filter-pattern "migration"

# Ou via console AWS
# CloudWatch → Log Groups → /ecs/video-core-dev
```

### ⚠️ Considerações

- **Startup mais lento**: Container leva ~5-10s a mais para iniciar
- **Health check**: Configurado com `startPeriod: 60s` para dar tempo das migrations
- **Single instance recommended**: Múltiplas tasks podem causar conflito de migrations

### Rollback de Migrations

Se precisar fazer rollback:

```bash
# 1. Conectar ao RDS
mysql -h <rds-endpoint> -u admin -p

# 2. Ver migrations aplicadas
USE video_core_db;
SELECT * FROM _prisma_migrations ORDER BY finished_at DESC LIMIT 5;

# 3. Reverter manualmente (se necessário)
# Não há comando automático - precisa criar migration de reversão
```

## 🎯 Como Fazer Deploy

### Deploy Automático (Push)

```bash
# 1. Faça alterações no código
vim src/index.ts

# 2. Commit e push
git add .
git commit -m "feat: add new feature"
git push origin main

# 3. Aguarde o workflow concluir
# GitHub Actions → Deploy Application
```

### Deploy Manual

```bash
# Opção 1: Via GitHub UI
1. Actions → Deploy Application
2. Run workflow → Preencher inputs
3. Run workflow

# Opção 2: Via Scripts Locais
export AWS_REGION=us-east-1
export ECR_REPOSITORY_URL=<from-terraform>
export ECR_REPOSITORY_NAME=<from-terraform>
export ECS_CLUSTER_NAME=<from-terraform>
export ECS_SERVICE_NAME=<from-terraform>
export IMAGE_TAG=$(git rev-parse --short HEAD)

# Build e push
./scripts/build-and-push.sh

# Deploy
./scripts/deploy-ecs.sh
```

## 🔐 Secrets Necessários

Configure em: [Settings → Secrets and variables → Actions](https://github.com/fiap-software-architecture-tech/video-core/settings/secrets/actions)

**Repository Secrets:**
- `AWS_ACCESS_KEY_ID` - AWS Access Key
- `AWS_SECRET_ACCESS_KEY` - AWS Secret Access Key
- `AWS_SESSION_TOKEN` - AWS Session Token (para AWS Academy)

**Repository Variables** (para deploy automático):
- `ECR_REPOSITORY_URL` - Do Terraform output
- `ECR_REPOSITORY_NAME` - Do Terraform output
- `ECS_CLUSTER_NAME` - Do Terraform output
- `ECS_SERVICE_NAME` - Do Terraform output

## 📊 Monitoramento

### Workflow Logs
- **GitHub Actions**: [Deploy Application](https://github.com/fiap-software-architecture-tech/video-core/actions/workflows/deploy-app.yml)

### AWS Console
- **ECR Images**: [Repositories](https://console.aws.amazon.com/ecr/repositories)
- **ECS Service**: [Clusters → video-core-cluster-dev](https://console.aws.amazon.com/ecs/v2/clusters)
- **Task Logs**: CloudWatch Logs

### Verificar Deployment

```bash
# Listar imagens no ECR
aws ecr list-images \
  --repository-name video-core-image \
  --region us-east-1

# Descrever serviço ECS
aws ecs describe-services \
  --cluster video-core-cluster-dev \
  --services video-core-service-dev \
  --region us-east-1
```

## 🛠️ Troubleshooting

### ❌ Erro: "Missing required variables"

**Push-triggered deployment** requer variáveis configuradas.

**Solução**: Configure as variáveis de repositório (ver [Opção B](#opção-b-deploy-automático-recomendado)) OU execute manualmente com inputs.

### ❌ Erro: "No basic auth credentials"

**Causa**: Login no ECR falhou.

**Solução**:
1. Verifique secrets AWS
2. Confirme que session token não expirou
3. Verifique permissões do LabRole para ECR

### ❌ Erro: "No such repository"

**Causa**: ECR repository não existe.

**Solução**: Execute o [video-infra deployment](https://github.com/fiap-software-architecture-tech/video-infra) primeiro.

### ❌ Erro: "Service not found"

**Causa**: ECS service não existe.

**Solução**: Execute o [video-infra deployment](https://github.com/fiap-software-architecture-tech/video-infra) primeiro.

### ❌ Build lento

**Causa**: Docker build reinstala dependências.

**Solução**: Já otimizado com multi-stage build. Considere GitHub Actions cache para npm.

## 🔍 Verificar Aplicação

Após deploy bem-sucedido:

```bash
# 1. Obter IP público da task
aws ecs list-tasks \
  --cluster video-core-cluster-dev \
  --service-name video-core-service-dev \
  --region us-east-1

# 2. Descrever task para pegar IP
aws ecs describe-tasks \
  --cluster video-core-cluster-dev \
  --tasks <task-arn> \
  --region us-east-1

# 3. Testar aplicação
curl http://<public-ip>:3000/health
```

## 📚 Scripts

Veja documentação detalhada: [scripts/README.md](scripts/README.md)

- `build-and-push.sh` - Build Docker image e push para ECR
- `deploy-ecs.sh` - Force new deployment no ECS

## 🔗 Repositórios Relacionados

- **Aplicação**: video-core (este repositório)
- **Infraestrutura**: [video-infra](https://github.com/fiap-software-architecture-tech/video-infra)

---

## 📖 Recursos

- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [AWS ECR User Guide](https://docs.aws.amazon.com/ecr/)
- [AWS ECS Developer Guide](https://docs.aws.amazon.com/ecs/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
