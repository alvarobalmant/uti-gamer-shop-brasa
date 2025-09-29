_# Análise do Modal e Widget de UTI Coins

## 1. Visão Geral e Localização dos Componentes

A funcionalidade de UTI Coins, incluindo o widget no cabeçalho e o modal que ele abre, é centralizada principalmente no componente `src/components/Retention/DailyCodeWidget.tsx`. Embora existam outros arquivos com nomes similares, como `UTICoinsWidget.tsx` e `UTICoinsMobileWidget.tsx`, a análise do código revela que o `DailyCodeWidget.tsx` é o componente ativo e responsável pela experiência no header, tanto em desktop quanto em mobile.

- **Componente Principal:** `DailyCodeWidget.tsx`
- **Contexto de Dados:** `useUTICoins` (de `src/contexts/UTICoinsContext.tsx`) e `useDailyCodes` (de `src/hooks/useDailyCodes.ts`)
- **Integração:** O widget é renderizado dentro do `src/components/Header/HeaderActionsEnhanced.tsx`, que faz parte do cabeçalho principal da aplicação.

## 2. Análise do Widget e do Modal

O componente `DailyCodeWidget.tsx` é responsável por renderizar tanto o botão (widget) que exibe o saldo de moedas quanto o modal (popover) que é aberto ao clicar nele.

### Funcionalidades do Modal:

O modal é rico em funcionalidades e informações, servindo como um painel de controle para o sistema de recompensas do usuário.

- **Saldo e Nível:** Exibe o saldo atual de UTI Coins do usuário e seu nível de fidelidade (Bronze, Prata, Ouro, etc.), juntamente com uma barra de progresso para o próximo nível.

- **Sistema de Bônus Diário (Streak):** Esta é a funcionalidade central do modal.
  - **Resgate de Código:** Permite ao usuário resgatar um código diário para ganhar moedas.
  - **Contador de Sequência (Streak):** Mostra há quantos dias consecutivos o usuário resgata o bônus, com animações e badges especiais para incentivar a frequência.
  - **Temporizador:** Exibe um contador regressivo para o próximo bônus diário disponível.
  - **Recompensa Futura:** Calcula e exibe a quantidade de moedas que o usuário ganhará no próximo resgate, incentivando-o a voltar.

- **Histórico de Transações:** Apresenta um resumo das transações mais recentes, mostrando ganhos e gastos de moedas.

- **Estatísticas Gerais:** Mostra o total de moedas ganhas e gastas ao longo do tempo.

- **Navegação:** Inclui um botão de ação principal que leva o usuário para a página completa de UTI Coins (`/coins`), onde ele pode ver mais detalhes e gastar suas moedas.

- **Animações e Feedback Visual:** O modal utiliza a biblioteca `framer-motion` para fornecer um feedback visual rico e animado, como animações quando o saldo de moedas aumenta, quando a sequência de bônus é atualizada e na abertura/fechamento do próprio modal.

## 3. Diferenças entre Desktop e Mobile

O componente `DailyCodeWidget.tsx` foi projetado para ser totalmente responsivo, adaptando sua apresentação para diferentes tamanhos de tela, mas mantendo a mesma lógica de negócios.

### Versão Desktop:

- **Posicionamento do Widget:** O widget é renderizado como parte do fluxo normal do cabeçalho, ao lado dos outros ícones de ação (conta de usuário, carrinho).
- **Posicionamento do Modal:** O modal (popover) abre logo abaixo do widget, posicionado de forma relativa a ele.

### Versão Mobile:

- **Posicionamento do Widget:** Na versão mobile, o componente utiliza um **React Portal** (`createPortal`) para renderizar o widget fora da estrutura normal do DOM. Ele se torna um elemento com posicionamento fixo (`fixed`) no canto superior direito da tela, flutuando sobre o conteúdo da página.
- **Posicionamento do Modal:** O modal também é renderizado através de um portal e cobre uma área maior da tela para melhor usabilidade em dispositivos de toque. O bloqueio de rolagem (`scroll lock`) é ativado para focar a interação do usuário no modal.

## 4. Conclusão

O sistema de UTI Coins, encapsulado no componente `DailyCodeWidget`, é uma ferramenta de engajamento e retenção de usuários muito bem elaborada. Ele utiliza conceitos de gamificação, como níveis, sequências (streaks) e recompensas diárias, para incentivar a interação contínua do usuário com a plataforma.

A implementação técnica é robusta, utilizando um único componente responsivo que se adapta a diferentes telas através de renderização condicional e portais, garantindo a consistência da funcionalidade em todos os dispositivos. O uso de animações e feedback visual aprimora significativamente a experiência do usuário, tornando a interação com o sistema de moedas mais agradável e recompensadora.
