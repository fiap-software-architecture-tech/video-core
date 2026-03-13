# 🚀 Scripts de Deploy

Este diretório contém scripts para automatizar o build e deploy da aplicação video-core na AWS.

## 📋 Scripts Disponíveis

### 1. `build-and-push.sh`
Script para construir a imagem Docker e fazer push para o Amazon ECR.

**Variáveis de Ambiente Necessárias:**
```bash
AWS_REGION=us-east-1
ECR_REPOSITORY_URL=123456789012.dkr.ecr.us-east-1.amazonaws.com/video-core-image
ECR_REPOSITORY_NAME=video-core-image
IMAGE_TAG=abc1234
```

**Uso:**
```bash
cd video-core
chmod +x scripts/build-and-push.sh
./scripts/build-and-push.sh
```

**O que faz:**
1. ✅ Valida variáveis de ambiente
2. 🔑 Faz login no Amazon ECR
3. 🔨 Constrói a imagem Docker (com tags `IMAGE_TAG` e `latest`)
4. 📤 Faz push das imagens para o ECR

---

### 2. `deploy-ecs.sh`
Script para fazer deploy da aplicação no Amazon ECS.

**Variáveis de Ambiente Necessárias:**
```bash
AWS_REGION=us-east-1
ECS_CLUSTER_NAME=video-core-cluster-dev
ECS_SERVICE_NAME=video-core-service-dev
IMAGE_TAG=abc1234
```

**Uso:**
```bash
cd video-core
chmod +x scripts/deploy-ecs.sh
./scripts/deploy-ecs.sh
```

**O que faz:**
1. ✅ Valida variáveis de ambiente
2. 📊 Mostra status atual do serviço
3. 🚀 Força novo deployment no ECS
4. ⚠️ Deployment roda em background (monitore no console AWS)

---

## 🎯 Uso no GitHub Actions

Os scripts são chamados automaticamente pelo workflow `.github/workflows/deploy-app.yml`:

```yaml
- name: 🔨 Build and Push Docker Image
  env:
    AWS_REGION: us-east-1
    ECR_REPOSITORY_URL: ${{ steps.vars.outputs.ecr_url }}
    ECR_REPOSITORY_NAME: ${{ steps.vars.outputs.ecr_name }}
    IMAGE_TAG: ${{ steps.vars.outputs.image_tag }}
  run: |
    chmod +x scripts/build-and-push.sh
    ./scripts/build-and-push.sh

- name: 🚀 Deploy to ECS
  env:
    AWS_REGION: us-east-1
    ECS_CLUSTER_NAME: ${{ steps.vars.outputs.ecs_cluster }}
    ECS_SERVICE_NAME: ${{ steps.vars.outputs.ecs_service }}
    IMAGE_TAG: ${{ steps.vars.outputs.image_tag }}
  run: |
    chmod +x scripts/deploy-ecs.sh
    ./scripts/deploy-ecs.sh
```

---

## 💻 Uso Local

Para testar os scripts localmente:

### 1. Configure as credenciais AWS
```bash
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
export AWS_SESSION_TOKEN=your_token  # se necessário
```

### 2. Obtenha os valores do Terraform
```bash
cd video-infra/terraform

# Inicialize o Terraform
terraform init

# Obtenha os outputs
export ECR_REPOSITORY_URL=$(terraform output -raw ecr_repository_url)
export ECR_REPOSITORY_NAME=$(terraform output -raw ecr_repository_name)
export ECS_CLUSTER_NAME=$(terraform output -raw ecs_cluster_name)
export ECS_SERVICE_NAME=$(terraform output -raw ecs_service_name)
```

### 3. Configure as variáveis
```bash
export AWS_REGION=us-east-1
export IMAGE_TAG=$(git rev-parse --short HEAD)
```

### 4. Execute os scripts
```bash
cd video-core

# Build e push
./scripts/build-and-push.sh

# Deploy
./scripts/deploy-ecs.sh
```

---

## 🔧 Troubleshooting

### Erro: "Permission denied"
```bash
chmod +x scripts/build-and-push.sh
chmod +x scripts/deploy-ecs.sh
```

### Erro: "Missing required environment variables"
Certifique-se de que todas as variáveis listadas acima estão definidas.

### Erro: "Docker login failed"
Verifique suas credenciais AWS e permissões para ECR.

### Erro: "ECS service not found"
Verifique se a infraestrutura foi provisionada corretamente com Terraform.

---

🖥️ Como Encontrar a Aplicação na Interface da AWS
🎯 Método 1: Via ECS Console (Mais Direto)
Passo 1: Acessar ECS
Abra o AWS Console: https://console.aws.amazon.com/
Na barra de pesquisa no topo, digite: ECS
Clique em "Elastic Container Service"
Passo 2: Acessar o Cluster
No menu lateral, clique em "Clusters"
Clique no cluster: video-core-cluster-dev
Passo 3: Acessar o Service
Na aba "Services", clique no serviço: video-core-service-dev
Você verá:
Status: ACTIVE
Desired tasks: 1
Running tasks: 1
Pending tasks: 0
Passo 4: Ver Tasks Rodando
Role para baixo e clique na aba "Tasks"
Você verá uma lista de tasks
Clique na Task ID (algo como abc123def456...)
Passo 5: Pegar o IP Público ⭐
Na página da Task, procure a seção "Configuration":

┌─────────────────────────────────────────┐
│ Configuration                           │
├─────────────────────────────────────────┤
│ Task definition: video-core-task-dev:3  │
│ Launch type: FARGATE                    │
│ Platform version: LATEST                │
│                                         │
│ Network                                 │
│ ├─ Public IP: 3.215.123.45  ← AQUI! 🎯 │
│ ├─ Private IP: 10.0.1.23                │
│ └─ Subnet: subnet-abc123                │
│                                         │
│ Container                               │
│ ├─ Name: video-core                     │
│ ├─ Image: ...ecr.../video-core:latest   │
│ └─ Port: 3000                           │
└─────────────────────────────────────────┘

Copie o Public IP e teste no navegador:
http://3.215.123.45:3000/docs
## 📚 Referências

- [AWS ECR Documentation](https://docs.aws.amazon.com/ecr/)
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [Docker Documentation](https://docs.docker.com/)
