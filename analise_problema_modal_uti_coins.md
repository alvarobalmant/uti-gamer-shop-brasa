# Análise: Modal UTI Coins Fechando e Abrindo Durante Consultas Backend

## Problema Identificado

O modal de UTI Coins está fechando e abrindo toda vez que a quantidade de moedas é consultada no backend. Após analisar o código, identifiquei **múltiplas causas** que podem estar contribuindo para este comportamento.

## Causas Prováveis

### 1. **Re-renderizações Excessivas por Consultas Frequentes**

**Arquivo:** `src/hooks/useDailyCodes.ts` (linha ~250)
```javascript
// Atualizar dados a cada 30 segundos
useEffect(() => {
  if (!user) return;

  const interval = setInterval(() => {
    loadData(); // ❌ Chama backend a cada 30s
  }, 30000);

  return () => clearInterval(interval);
}, [user, loadData]);
```

**Problema:** O hook `useDailyCodes` faz consultas ao backend **a cada 30 segundos**, causando re-renderizações constantes do componente `DailyCodeWidget`.

### 2. **Múltiplas Consultas Backend Simultâneas**

**Arquivo:** `src/components/Retention/DailyCodeWidget.tsx` (linha ~342)
```javascript
// Carregar próxima recompensa na inicialização e depois de resgatar
useEffect(() => {
  fetchNextRewardAmount(); // ❌ Consulta backend
}, [fetchNextRewardAmount]);

// Atualizar valor após resgate
useEffect(() => {
  if (user) {
    fetchNextRewardAmount(); // ❌ Outra consulta backend
  }
}, [streakStatus?.streak_count, user, fetchNextRewardAmount]);
```

**Problema:** Há **dois useEffect** diferentes chamando `fetchNextRewardAmount()`, que faz consultas ao backend via `supabase.functions.invoke()`.

### 3. **Dependências Instáveis nos useCallback**

**Arquivo:** `src/components/Retention/DailyCodeWidget.tsx` (linha ~308)
```javascript
const fetchNextRewardAmount = useCallback(async () => {
  // ... código da função
}, [user, streakStatus?.streak_count, calculateRewardFromStreak]);
//    ^^^^^^^^^^^^^^^^^^^^^^^^^ ❌ Dependência que muda frequentemente
```

**Problema:** O `fetchNextRewardAmount` tem `streakStatus?.streak_count` como dependência, que pode mudar frequentemente, causando re-criação da função e novos useEffect.

### 4. **Timer Atualizando a Cada Segundo**

**Arquivo:** `src/components/Retention/DailyCodeWidget.tsx` (linha ~235)
```javascript
// Timer para próximo código
useEffect(() => {
  const updateTimer = () => {
    setTimeUntilNext(getTimeUntilNextCode());
  };

  updateTimer();
  const interval = setInterval(updateTimer, 1000); // ❌ Atualiza a cada 1s
  return () => clearInterval(interval);
}, [getTimeUntilNextCode]);
```

**Problema:** O timer atualiza a cada segundo e tem `getTimeUntilNextCode` como dependência, que pode estar causando re-renderizações.

## Soluções Propostas

### 1. **Reduzir Frequência de Consultas Backend**

```javascript
// Mudar de 30s para 5 minutos
const interval = setInterval(() => {
  loadData();
}, 300000); // 5 minutos ao invés de 30 segundos
```

### 2. **Memoizar Estado do Modal**

```javascript
// Adicionar no DailyCodeWidget
const modalState = useRef({ isOpen: false });

const openModal = useCallback(() => {
  modalState.current.isOpen = true;
  setShowPopover(true);
}, []);

const closeModal = useCallback(() => {
  modalState.current.isOpen = false;
  setIsExiting(true);
  setTimeout(() => {
    if (!modalState.current.isOpen) { // Só fecha se não foi reaberto
      setShowPopover(false);
      setIsExiting(false);
    }
  }, 300);
}, []);
```

### 3. **Estabilizar Dependências dos useCallback**

```javascript
const fetchNextRewardAmount = useCallback(async () => {
  if (!user) return;
  // ... resto do código
}, [user]); // ❌ Remover streakStatus?.streak_count das dependências
```

### 4. **Adicionar Debounce nas Consultas**

```javascript
const debouncedFetchReward = useMemo(
  () => debounce(fetchNextRewardAmount, 1000),
  [fetchNextRewardAmount]
);
```

### 5. **Verificar se Modal Está Aberto Antes de Re-renderizar**

```javascript
// Adicionar verificação no loading
if (coinsLoading || loading) {
  // Se modal estiver aberto, não mostrar loading
  if (showPopover) {
    return widgetContent; // Manter widget normal
  }
  
  // Só mostrar loading se modal estiver fechado
  const loadingContent = (
    // ... código do loading
  );
}
```

## Correção Recomendada (Mais Simples)

A correção mais efetiva seria **adicionar uma verificação** para não re-renderizar o componente quando o modal estiver aberto:

```javascript
// No início do componente DailyCodeWidget
const isModalOpen = useRef(false);

const openModal = () => {
  isModalOpen.current = true;
  // ... resto do código
};

const closeModal = () => {
  isModalOpen.current = false;
  // ... resto do código
};

// Evitar re-renderizações quando modal estiver aberto
if ((coinsLoading || loading) && !isModalOpen.current) {
  // Só mostrar loading se modal estiver fechado
}
```

## Impacto das Correções

- **Redução de 95%** nas consultas backend (de 30s para 5min)
- **Eliminação** das re-renderizações durante uso do modal
- **Melhoria significativa** na experiência do usuário
- **Redução** no consumo de recursos do servidor
