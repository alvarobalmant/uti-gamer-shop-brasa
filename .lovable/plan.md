
# Plano: Landing Page UTI Care - Sistema de Assinatura de Manutencao

## Resumo

Criar uma landing page completa para o servico "UTI Care" - um modelo de assinatura mensal para manutencao e reparo de consoles e controles. A pagina tera um design profissional de venda, com video explicativo, opcoes de planos e um fluxo de assinatura interativo.

---

## Estrutura da Landing Page

### 1. Hero Section (Secao Principal)
- Titulo impactante: "UTI Care - Protecao Total para seu Console"
- Subtitulo explicando o conceito de assinatura
- Espaco para video explicativo (iframe YouTube/embed)
- CTA principal para iniciar assinatura

### 2. Secao de Beneficios
- Economia vs comprar controle novo
- Tranquilidade com cobertura
- Manutencao preventiva inclusa
- Prioridade no atendimento

### 3. Tabela de Planos (Baseado no Estudo)

| Plano | Cobertura | Preco Mensal |
|-------|-----------|--------------|
| UTI Care Controle | 1 Controle | R$ 19,90 |
| UTI Care Console | 1 Console | R$ 39,90 |
| UTI Care Gamer Pro | 1 Console + 1 Controle | R$ 54,90 |

### 4. Fluxo de Assinatura Multi-Step
**Step 1:** Selecionar Plano
**Step 2:** Escolher Console (PS4, PS5, Xbox One, Xbox Series, Nintendo Switch)
**Step 3:** Escolher Controle(s) e quantidade
**Step 4:** Resumo com valor final
**Step 5:** Dados de contato (preparado para gateway futuro)

---

## Produtos Disponiveis para Selecao

### Consoles (do banco de dados)
- PlayStation 5 Slim (R$ 3.499,00)
- PlayStation VR2 (R$ 2.499,00)

### Controles (do banco de dados)
**PlayStation:**
- DualSense Branco (R$ 369,90)
- DualSense Midnight Black (R$ 349,90)
- DualSense Starlight Blue (R$ 399,90)
- DualSense Cobalt Blue (R$ 469,90)
- DualSense Edge Pro (R$ 1.199,00)
- DualShock 4 Preto (R$ 299,90)

**Xbox:**
- Xbox Pulse Cipher (R$ 590,00)
- Xbox Velocity Green (R$ 599,00)

---

## Logica de Precificacao

### Plano Controle (R$ 19,90/mes)
- Seleciona quantidade de controles (1-4)
- Preco: R$ 19,90 x quantidade

### Plano Console (R$ 39,90/mes)
- Apenas 1 console por assinatura
- Preco fixo: R$ 39,90

### Plano Gamer Pro (R$ 54,90/mes)
- 1 Console + 1-2 Controles inclusos
- Controles adicionais: +R$ 15,90 cada
- Formula: R$ 54,90 + (controles extras x R$ 15,90)

---

## Arquivos a Criar

### 1. Pagina Principal
`src/pages/UTICare.tsx`
- Landing page completa
- Hero com video
- Secao de beneficios
- Cards de planos
- CTA para assinatura

### 2. Componente de Assinatura
`src/components/UTICare/SubscriptionWizard.tsx`
- Modal multi-step fullscreen
- Selecao de plano
- Selecao de equipamentos
- Resumo e calculo de preco
- Formulario de contato

### 3. Componentes de Suporte
`src/components/UTICare/PlanCard.tsx` - Card individual de plano
`src/components/UTICare/EquipmentSelector.tsx` - Seletor de console/controle
`src/components/UTICare/PriceSummary.tsx` - Resumo do preco calculado

---

## Rota da Pagina

Adicionar no `App.tsx`:
```
<Route path="/care" element={<UTICare />} />
```

URL final: `/care`

---

## Design Visual

### Cores
- Primaria: Roxo (#8B5CF6) - Consistente com a marca
- Accent: Verde (#22C55E) - Para badges de economia
- Background: Gradiente escuro (gaming feel)

### Componentes
- Cards com borda glow no hover
- Progress bar no wizard de assinatura
- Animacoes suaves (framer-motion)
- Icones Lucide React

---

## Fluxo do Usuario

```text
1. Usuario acessa /care
2. Assiste video explicativo
3. Clica "Assinar Agora"
4. Modal fullscreen abre
5. Seleciona plano (Controle/Console/Gamer Pro)
6. Seleciona marca (PlayStation/Xbox/Nintendo)
7. Seleciona modelo especifico do console
8. Seleciona controle(s) e quantidade
9. Ve resumo com preco mensal calculado
10. Preenche dados de contato
11. Finaliza (envia para WhatsApp por enquanto)
```

---

## Resultado Final

- Landing page profissional para UTI Care
- Sistema de selecao de equipamentos funcional
- Calculo automatico do valor da assinatura
- Integracao com produtos reais do catalogo
- Preparado para futura integracao com gateway de pagamento
- Mensagem enviada para WhatsApp com todos os detalhes

---

## Secao Tecnica

### Estrutura de Dados para Assinatura

```typescript
interface CareSubscription {
  plan: 'controle' | 'console' | 'gamer-pro';
  console?: {
    brand: string;
    model: string;
  };
  controllers: {
    brand: string;
    model: string;
    quantity: number;
  }[];
  monthlyPrice: number;
  customer: {
    name: string;
    whatsapp: string;
    email: string;
  };
}
```

### Componentes React Necessarios

```text
src/pages/UTICare.tsx
  -> Hero (video + CTA)
  -> Benefits section
  -> Plans section (3 cards)
  -> FAQ section
  -> Footer

src/components/UTICare/
  -> SubscriptionWizard.tsx (modal multi-step)
  -> PlanCard.tsx (card de plano)
  -> ConsoleSelector.tsx (selecao de console)
  -> ControllerSelector.tsx (selecao de controles)
  -> PriceSummary.tsx (resumo de preco)
  -> CustomerForm.tsx (formulario final)
```

### Integracao com Catalogo

Os produtos serao carregados do banco de dados `integra_products` filtrando por:
- `grupo = 'Consoles'` para consoles
- `grupo = 'Controles'` para controles
- Separados por `platform` (PS5, Xbox Series, etc)
