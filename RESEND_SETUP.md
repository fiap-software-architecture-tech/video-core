# 🎉 Resend Implementado com Sucesso!

O serviço de email foi migrado de AWS SES para Resend.

## ✅ O que foi feito

1. ✅ Instalado pacote `resend`
2. ✅ Criado `ResendEmailService` em [src/infrastructure/services/resend/resend-email.service.ts](video-core/src/infrastructure/services/resend/resend-email.service.ts)
3. ✅ Atualizado DI container para usar `ResendEmailService`
4. ✅ Atualizado variáveis de ambiente em `.env`, `.env.example` e `env.ts`
5. ✅ Atualizado Terraform (`locals.tf` e `variables.tf`)

## 🔑 Próximo Passo: Obter API Key do Resend

### 1. Criar Conta no Resend

Acesse: https://resend.com/signup

### 2. Obter API Key

1. Faça login em https://resend.com
2. Vá para **API Keys** no menu lateral
3. Clique em **Create API Key**
4. Dê um nome (ex: "Video Core API")
5. Copie a API key (formato: `re_xxxxxxxxxxxxx`)

### 3. Configurar Localmente

Edite o arquivo `.env`:

```env
RESEND_API_KEY=re_sua_api_key_aqui
EMAIL_FROM=noreply@resend.dev
```

### 4. Configurar no AWS (ECS)

Edite o arquivo `terraform/terraform.tfvars` (crie se não existir):

```hcl
resend_api_key = "re_sua_api_key_aqui"
email_from     = "noreply@resend.dev"
```

Ou defina diretamente usando variáveis de ambiente do Terraform:

```bash
export TF_VAR_resend_api_key="re_sua_api_key_aqui"
export TF_VAR_email_from="noreply@resend.dev"
```

## 📧 Usar Seu Próprio Domínio (Opcional)

Por padrão, você pode usar `noreply@resend.dev` para testes. Para usar seu próprio domínio:

1. Acesse **Domains** no Resend
2. Clique em **Add Domain**
3. Digite seu domínio (ex: `fiapx.com`)
4. Configure os registros DNS conforme instruções
5. Aguarde verificação (geralmente alguns minutos)
6. Use emails do seu domínio: `noreply@fiapx.com`

## 🧪 Testar Envio de Email

Depois de configurar a API key, teste enviando um email:

```bash
# Inicie a aplicação
npm run dev

# Teste o endpoint de registro ou outra funcionalidade que envia email
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "seu-email@gmail.com",
    "password": "senha123"
  }'
```

Você deve receber um email no endereço fornecido!

## 📊 Limites do Free Tier

- **100 emails/dia**
- **3.000 emails/mês**
- Perfeito para desenvolvimento e projetos pequenos

## 🆘 Troubleshooting

### Erro: "Invalid API key"
- Verifique se a API key está correta no `.env`
- Certifique-se de que não há espaços extras
- A key deve começar com `re_`

### Erro: "Domain not verified"
- Se usar domínio próprio, aguarde verificação DNS
- Ou use `noreply@resend.dev` para testes

### Email não chegou
- Verifique spam/lixo eletrônico
- Verifique logs da aplicação
- Acesse Resend Dashboard > Emails para ver histórico

## 📚 Documentação Adicional

- [Resend Docs](https://resend.com/docs)
- [Resend Node.js SDK](https://resend.com/docs/send-with-nodejs)
- [EMAIL_ALTERNATIVES.md](EMAIL_ALTERNATIVES.md) - Outras opções de email

---

🎯 **Tudo pronto!** Basta obter a API key do Resend e configurar no `.env`!
