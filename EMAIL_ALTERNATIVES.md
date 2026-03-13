# Alternativas para Envio de Email (AWS Academy)

O AWS Academy não permite uso do SES. Use uma das alternativas abaixo:

## 🌟 Opção 1: Resend (Recomendado)

**Vantagens:**
- Moderno e simples
- 100 emails/dia grátis
- 3.000 emails/mês grátis
- API REST simples
- Excelente para desenvolvimento

### Passos:

1. **Criar conta:** https://resend.com
2. **Obter API Key:** Dashboard > API Keys
3. **Instalar SDK:**
   ```bash
   npm install resend
   ```

4. **Criar serviço:** `src/infrastructure/services/resend/resend-email.service.ts`
   ```typescript
   import { Resend } from 'resend';
   import { inject, injectable } from 'inversify';
   
   import { SendEmailDTO } from '#/domain/services/dto/email.dto';
   import { IEmailService } from '#/domain/services/email.service';
   import { ILogger } from '#/domain/services/logger.service';
   import { TYPES } from '#/infrastructure/config/di/types';
   
   @injectable()
   export class ResendEmailService implements IEmailService {
       private resend: Resend;
       private fromEmail: string;
   
       constructor(@inject(TYPES.Logger) private readonly logger: ILogger) {
           this.resend = new Resend(process.env.RESEND_API_KEY);
           this.fromEmail = process.env.EMAIL_FROM || 'noreply@resend.dev';
       }
   
       async send(request: SendEmailDTO): Promise<void> {
           this.logger.info('Sending email via Resend', { to: request.to, subject: request.subject });
   
           try {
               const { data, error } = await this.resend.emails.send({
                   from: this.fromEmail,
                   to: request.to,
                   subject: request.subject,
                   text: request.body,
                   html: request.html,
               });
   
               if (error) {
                   throw new Error(error.message);
               }
   
               this.logger.info('Email sent successfully', { to: request.to, id: data?.id });
           } catch (error) {
               this.logger.error('Failed to send email', error as Error, { to: request.to });
               throw error;
           }
       }
   }
   ```

5. **Atualizar DI Container:** `src/infrastructure/config/di/bindings/infrastructure.binding.ts`
   ```typescript
   import { ResendEmailService } from '#/infrastructure/services/resend/resend-email.service';
   
   // Trocar:
   // container.bind<IEmailService>(TYPES.EmailService).to(SesEmailService).inSingletonScope();
   // Por:
   container.bind<IEmailService>(TYPES.EmailService).to(ResendEmailService).inSingletonScope();
   ```

6. **Atualizar variáveis de ambiente:**
   - `.env`:
     ```env
     RESEND_API_KEY=re_xxxxxxxxxxxxx
     EMAIL_FROM=noreply@resend.dev
     ```
   
   - `src/infrastructure/config/env.ts`:
     ```typescript
     const envSchema = z.object({
         // ... outras variáveis
         RESEND_API_KEY: z.string(),
         EMAIL_FROM: z.string().email(),
     });
     ```
   
   - `terraform/locals.tf` (adicionar ao ecs_container_environment):
     ```hcl
     {
       name  = "RESEND_API_KEY"
       value = var.resend_api_key
     },
     {
       name  = "EMAIL_FROM"
       value = "noreply@seu-dominio.com"
     },
     ```
   
   - `terraform/variables.tf`:
     ```hcl
     variable "resend_api_key" {
       description = "Resend API Key for sending emails"
       type        = string
       sensitive   = true
     }
     ```

---

## 📧 Opção 2: SendGrid

**Vantagens:**
- 100 emails/dia grátis permanentemente
- Muito popular e confiável
- Boa documentação

### Passos:

1. **Criar conta:** https://sendgrid.com
2. **Obter API Key:** Settings > API Keys
3. **Instalar SDK:**
   ```bash
   npm install @sendgrid/mail
   ```

4. **Criar serviço:** Similar ao Resend, mas usando `@sendgrid/mail`

---

## 🔧 Opção 3: Nodemailer (Gmail/SMTP)

**Vantagens:**
- Grátis (use seu Gmail)
- Funciona com qualquer SMTP
- Bom para desenvolvimento

**Desvantagens:**
- Gmail limita a 500 emails/dia
- Menos confiável para produção

### Passos:

1. **Instalar:**
   ```bash
   npm install nodemailer
   ```

2. **Criar serviço:** `src/infrastructure/services/nodemailer/nodemailer-email.service.ts`

3. **Configurar Gmail:**
   - Ativar "2-Step Verification"
   - Gerar "App Password": https://myaccount.google.com/apppasswords

4. **Variáveis de ambiente:**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=seu-email@gmail.com
   SMTP_PASS=sua-app-password
   EMAIL_FROM=seu-email@gmail.com
   ```

---

## 🧪 Opção 4: Mailtrap (Apenas Desenvolvimento)

**Para testes locais sem enviar emails reais:**

1. **Criar conta:** https://mailtrap.io
2. **Usar credenciais SMTP do Mailtrap**
3. **Todos os emails vão para o inbox do Mailtrap**

---

## 📝 Recomendação

**Para este projeto:**
- **Desenvolvimento:** Resend (free tier) ou Mailtrap
- **Produção:** Resend ou SendGrid

**Mais simples:** Use **Resend** - é moderno, tem free tier generoso e é muito fácil de usar!
