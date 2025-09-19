# Correção do Sistema de Recompensas UTI Coins

## Problema Identificado

O sistema atual **reinicia o ciclo de recompensas** a cada 7 dias, fazendo com que um cliente que tenha 7+ dias de sequência volte a ganhar apenas 30 coins no 8º dia. Isso é **contraproducente** para o engajamento do usuário.

### Comportamento Atual (Incorreto):
- Dia 6: 63 coins
- Dia 7: 70 coins  
- **Dia 8: 30 coins** ❌ (reinicia o ciclo)
- Dia 9: 37 coins
- Dia 10: 43 coins

### Comportamento Desejado (Correto):
- Dia 6: 63 coins
- Dia 7: 70 coins
- **Dia 8: 70 coins** ✅ (mantém o máximo)
- Dia 9: 70 coins
- Dia 10: 70 coins

## Código Atual Problemático

### Arquivo: `src/components/Retention/DailyCodeWidget.tsx`

**Função problemática (linha ~352):**
```javascript
const calculateNextReward = () => {
  // Se não tem streak, usar valor base
  if (!streakStatus?.streak_count) return 30;
  
  const currentStreak = streakStatus.streak_count;
  const baseAmount = 30;
  const maxAmount = 70;
  const streakDays = 7;
  
  // ❌ PROBLEMA: Usa módulo para reiniciar o ciclo
  const nextStreakPosition = Math.max(1, (currentStreak % streakDays) + 1);
  const finalPosition = nextStreakPosition > streakDays ? 1 : nextStreakPosition;
  
  const increment = (maxAmount - baseAmount) / (streakDays - 1);
  return Math.round(baseAmount + ((finalPosition - 1) * increment));
};
```

**Função também problemática (linha ~294):**
```javascript
const calculateRewardFromStreak = useCallback((streakDay: number) => {
  const baseAmount = 30;
  const maxAmount = 70;
  const streakDays = 7;
  
  if (streakDay <= 0) return baseAmount;
  // ❌ PROBLEMA: Só retorna máximo se for exatamente >= 7
  if (streakDay >= streakDays) return maxAmount;
  
  const increment = (maxAmount - baseAmount) / (streakDays - 1);
  return Math.round(baseAmount + ((streakDay - 1) * increment));
}, []);
```

## Correção Necessária

### 1. Corrigir `calculateNextReward`:

```javascript
const calculateNextReward = () => {
  // Se não tem streak, usar valor base
  if (!streakStatus?.streak_count) return 30;
  
  const currentStreak = streakStatus.streak_count;
  const baseAmount = 30;
  const maxAmount = 70;
  const streakDays = 7;
  
  // ✅ CORREÇÃO: Próximo dia da sequência
  const nextDay = currentStreak + 1;
  
  // ✅ CORREÇÃO: Se já passou do dia 7, mantém no máximo
  if (nextDay >= streakDays) return maxAmount;
  
  // Progressão linear apenas até o dia 7
  const increment = (maxAmount - baseAmount) / (streakDays - 1);
  return Math.round(baseAmount + ((nextDay - 1) * increment));
};
```

### 2. A função `calculateRewardFromStreak` já está correta:

```javascript
const calculateRewardFromStreak = useCallback((streakDay: number) => {
  const baseAmount = 30;
  const maxAmount = 70;
  const streakDays = 7;
  
  if (streakDay <= 0) return baseAmount;
  // ✅ Esta linha já está correta - mantém máximo após dia 7
  if (streakDay >= streakDays) return maxAmount;
  
  const increment = (maxAmount - baseAmount) / (streakDays - 1);
  return Math.round(baseAmount + ((streakDay - 1) * increment));
}, []);
```

## Impacto da Correção

### Antes da Correção:
| Sequência | Recompensa Atual | Próxima Recompensa |
|-----------|------------------|-------------------|
| 5 dias    | 57 coins         | 63 coins          |
| 6 dias    | 63 coins         | 70 coins          |
| 7 dias    | 70 coins         | **30 coins** ❌   |
| 8 dias    | 30 coins         | 37 coins          |
| 14 dias   | 70 coins         | **30 coins** ❌   |

### Após a Correção:
| Sequência | Recompensa Atual | Próxima Recompensa |
|-----------|------------------|-------------------|
| 5 dias    | 57 coins         | 63 coins          |
| 6 dias    | 63 coins         | 70 coins          |
| 7 dias    | 70 coins         | **70 coins** ✅   |
| 8 dias    | 70 coins         | **70 coins** ✅   |
| 14 dias   | 70 coins         | **70 coins** ✅   |

## Benefícios da Correção

1. **Maior Engajamento:** Usuários com sequências longas são recompensados adequadamente
2. **Lógica Intuitiva:** Faz mais sentido manter a recompensa máxima após atingi-la
3. **Incentivo à Fidelidade:** Usuários têm motivo para manter sequências longas
4. **Redução de Frustração:** Evita a decepção de voltar para 30 coins após 7 dias

## Arquivo a Ser Modificado

**Caminho:** `src/components/Retention/DailyCodeWidget.tsx`
**Linha:** ~352 (função `calculateNextReward`)

A correção é simples: remover o uso do operador módulo (`%`) e usar lógica linear que mantém o máximo após o dia 7.
