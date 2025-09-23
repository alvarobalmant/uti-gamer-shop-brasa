# Prompt para IA do Backend - Sistema de Recompensas Diárias

## 🎯 **Contexto**
Estou trabalhando no frontend do sistema de UTI Coins e preciso entender completamente como funciona o backend das recompensas diárias para debugar um problema onde o botão de resgate não está aparecendo quando deveria.

## 📋 **Por favor, explique DETALHADAMENTE:**

### **1. Geração de Códigos Diários**
- **Horário exato** que os códigos são gerados (fuso horário)
- **Processo** de geração (automático? cron job? trigger?)
- **Duração** de validade dos códigos
- **O que acontece** com códigos antigos quando novos são gerados

### **2. Horários e Timings**
- **Horário de geração:** Quando exatamente são criados os novos códigos?
- **Horário de expiração:** Quando exatamente os códigos antigos expiram?
- **Janela de disponibilidade:** Por quanto tempo um código fica disponível para resgate?
- **Fuso horário:** Qual timezone está sendo usado? (UTC? Brasil?)

### **3. Estados dos Códigos**
- **can_claim:** Quando essa flag fica `true` vs `false`?
- **hours_until_claim_expires:** Como é calculado?
- **hours_until_validity_expires:** Como é calculado?
- **Diferença** entre "expirado para resgate" vs "expirado para streak"

### **4. Lógica de Streak**
- **Como funciona** o sistema de streak em relação aos códigos?
- **O que acontece** se o usuário não resgatar no dia?
- **Quando a streak é quebrada** vs mantida?

### **5. Tabelas e Estrutura**
- **Tabelas envolvidas** no sistema de códigos diários
- **Campos importantes** e seus significados
- **Relacionamentos** entre as tabelas

### **6. Cenário Específico - Debug**
**Situação atual:** 
- Usuário esperava que às 20h fosse gerado um novo código
- Códigos antigos expiraram corretamente
- Mas não apareceu novo código disponível para resgate
- Frontend mostra "Recompensa Resgatada!" quando deveria mostrar botão de resgate

**Perguntas específicas:**
- O que pode estar causando isso?
- Como verificar se os códigos estão sendo gerados corretamente?
- Existe algum delay entre geração e disponibilidade?
- Há alguma condição especial que impede a geração?

### **7. Queries para Debug**
- **SQL queries** que posso rodar para verificar:
  - Se códigos estão sendo gerados hoje
  - Status atual dos códigos do usuário
  - Histórico de códigos das últimas 24h
  - Estado da streak do usuário

### **8. Configurações e Variáveis**
- **Variáveis de ambiente** relacionadas aos horários
- **Configurações** que podem afetar a geração de códigos
- **Logs** que posso verificar para debugar

## ⚠️ **Importante:**
Preciso dessa informação para corrigir o frontend e garantir que o botão de resgate apareça no momento certo. Atualmente o sistema está confuso sobre quando mostrar cada estado da recompensa.

**Por favor, seja o mais específico possível com horários, condições e lógica do sistema!**
