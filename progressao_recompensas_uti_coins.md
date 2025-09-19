# Progressão de Recompensas UTI Coins - Sistema de 7 Dias

## Como Funciona a Progressão

O sistema de UTI Coins utiliza um **ciclo de 7 dias** com progressão linear de recompensas. Quando um cliente chega na sequência de 7 dias, ele recebe **70 UTI Coins** (a recompensa máxima do ciclo), mas no dia seguinte o ciclo **reinicia** e ele volta a receber 30 coins.

### Tabela de Progressão por Dia

| Dia no Ciclo | Recompensa | Incremento |
|--------------|------------|------------|
| Dia 1        | 30 coins   | Base       |
| Dia 2        | 37 coins   | +7 coins   |
| Dia 3        | 43 coins   | +6 coins   |
| Dia 4        | 50 coins   | +7 coins   |
| Dia 5        | 57 coins   | +7 coins   |
| Dia 6        | 63 coins   | +6 coins   |
| Dia 7        | 70 coins   | +7 coins   |

**Após o dia 7, o ciclo reinicia no dia 1 (30 coins)**

## Fórmula de Cálculo

O sistema utiliza uma **progressão linear** com os seguintes parâmetros:

- **Base:** 30 coins
- **Máximo:** 70 coins  
- **Duração do ciclo:** 7 dias
- **Incremento por dia:** 6,67 coins (arredondado)

### Fórmula:
```
recompensa = 30 + ((posição_no_ciclo - 1) × 6,67)
```

## Exemplo Prático: Cliente com 7 Dias de Sequência

Quando um cliente está no **dia 7 da sequência**:

1. **Hoje (dia 7):** Ele pode resgatar **70 coins** (recompensa máxima)
2. **Amanhã (dia 8):** O modal mostrará que ele ganhará **30 coins** (reinício do ciclo)

### Sequência Completa de 14 Dias:

| Sequência Total | Posição no Ciclo | Recompensa do Dia | Próxima Recompensa |
|-----------------|------------------|-------------------|-------------------|
| 1 dia           | Dia 1            | 30 coins          | 37 coins          |
| 2 dias          | Dia 2            | 37 coins          | 43 coins          |
| 3 dias          | Dia 3            | 43 coins          | 50 coins          |
| 4 dias          | Dia 4            | 50 coins          | 57 coins          |
| 5 dias          | Dia 5            | 57 coins          | 63 coins          |
| 6 dias          | Dia 6            | 63 coins          | 70 coins          |
| **7 dias**      | **Dia 7**        | **70 coins**      | **30 coins**      |
| 8 dias          | Dia 1 (novo)     | 30 coins          | 37 coins          |
| 9 dias          | Dia 2            | 37 coins          | 43 coins          |
| 10 dias         | Dia 3            | 43 coins          | 50 coins          |
| 11 dias         | Dia 4            | 50 coins          | 57 coins          |
| 12 dias         | Dia 5            | 57 coins          | 63 coins          |
| 13 dias         | Dia 6            | 63 coins          | 70 coins          |
| **14 dias**     | **Dia 7**        | **70 coins**      | **30 coins**      |

## Lógica de Implementação

O código utiliza a operação **módulo (%)** para determinar a posição no ciclo:

```javascript
// Próxima posição no ciclo (dia seguinte)
const nextStreakPosition = Math.max(1, (currentStreak % 7) + 1);

// Se chegou ao final do ciclo, volta para o dia 1
const finalPosition = nextStreakPosition > 7 ? 1 : nextStreakPosition;
```

## Objetivo do Sistema

Este sistema de **ciclo renovável** tem como objetivo:

1. **Manter o engajamento contínuo:** Mesmo após 7 dias, o usuário tem incentivo para continuar
2. **Evitar inflação descontrolada:** Limita a recompensa máxima a 70 coins por dia
3. **Criar expectativa:** O usuário sempre sabe quanto ganhará no próximo dia
4. **Gamificação:** O ciclo de 7 dias cria uma meta tangível e alcançável

## Resposta à Pergunta

**Quando o cliente chega na sequência de 7 dias:**
- Ele ganha **70 UTI Coins** naquele dia (recompensa máxima)
- O modal mostra que **amanhã ele ganhará 30 coins** (reinício do ciclo)
- A progressão reinicia, mas a **sequência total continua contando** (8, 9, 10 dias...)
- Ele mantém os badges especiais de sequência longa (🔥 Em chamas!, etc.)
