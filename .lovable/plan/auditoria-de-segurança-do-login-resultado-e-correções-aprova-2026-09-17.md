# Auditoria de segurança do login — resultado e correções aprovadas

Auditoria concluída. O login usa Supabase Auth com e-mail/senha chamado direto do navegador; o Turnstile é validado no servidor pela função `verify-turnstile`, com a chave secreta apenas no cofre. Abaixo o resultado e o escopo desta etapa.

## O que já está correto (preservar, sem duplicar)

- Chave secreta da Cloudflare só no servidor; o site nunca chama a Cloudflare diretamente.
- O código do desafio fica só na memória da tela, nunca é salvo no navegador; é descartado após cada tentativa, ao trocar de aba e ao fechar o modal. Códigos expirados ou já usados são recusados.
- Não existem cookies próprios do site: a sessão é gerenciada pelo Supabase.
- Nenhuma senha aparece em registros do navegador.

## Alterações desta etapa

### 1. Verificação obrigatória no login
Hoje a verificação é opcional internamente: sem o código do desafio, o login prossegue. Passa a ser obrigatória — sem o código, a tentativa de login nem é feita. Cadastro continua sem exigência, e recuperação de senha não é tocada.

### 2. Código do desafio enviado ao Supabase
`signInWithPassword` passa a receber `options: { captchaToken }`, deixando o código preparado para quando a proteção nativa do Supabase for ativada por quem tem acesso ao painel. Enquanto não estiver ativada, o Supabase ignora o campo — não há segunda validação. Importante: até essa ativação, um atacante que ignore completamente a tela do site e chame o Supabase diretamente não é barrado pela verificação.

### 3. Mensagens de erro do login
`Invalid login credentials` passa a exibir **"Email ou senha inválidos."**; o aviso separado de e-mail não confirmado é mantido; outros erros seguem uma mensagem genérica. Cadastro e recuperação de senha ficam como estão.

### 4. Registros sem dados sensíveis
Remoção de e-mail, ID do usuário e trechos de token de acesso dos registros de autenticação e do diagnóstico de sessão. Nenhum código de desafio ou senha é registrado. Ficam apenas informações não identificáveis.

### Arquivos a alterar

| Arquivo | Mudança |
| --- | --- |
| `src/hooks/useAuth.tsx` | Verificação obrigatória no login; `options: { captchaToken }`; mensagem genérica de credenciais; registros sem ID de usuário |
| `src/utils/sessionMonitor.ts` | Remover e-mail, ID e trechos de token dos registros |
| `src/components/Auth/AuthModalImproved.tsx` | Remover registros da tentativa e ajustar o texto de erro exibido |

Nada mais será alterado: cadastro, recuperação de senha, confirmação de e-mail, sessão, `AuthProvider`, papéis, `isAdmin`, guardas de admin, banco de dados, regras de acesso, produtos, pedidos, pagamentos e design permanecem intactos. **Nenhuma função de servidor nova. Nenhuma dependência alterada.**

## Fora do escopo desta etapa (apenas documentado)

- **Limite de tentativas:** não será implementado. O login fala direto com o Supabase Auth, que já aplica os próprios limites de autenticação; não existe intermediário no projeto onde adicionar um limite sem mudar a arquitetura.
- **Cabeçalhos de segurança:** nenhum configurado hoje. Ficam como recomendação futura, direto na infraestrutura/Cloudflare: `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` e, com teste cuidadoso para não quebrar o Turnstile, `Content-Security-Policy`.
- **CAPTCHA nativo do Supabase:** não será ativado nem configurado agora; fica para quem tem acesso administrativo ao projeto.
- **Segundo fator para administradores** e **reautenticação em operações sensíveis** (troca de e-mail/senha, ações administrativas): recomendações futuras, sem alteração agora.
- Sessão, armazenamento do Supabase, papéis e permissões: sem alterações.

## Testes

Abrir o modal; tentar login sem concluir a verificação (não deve executar); concluir a verificação; login correto; senha errada mostrando "Email ou senha inválidos."; código inválido e código expirado; fechar e reabrir o modal; repetir login após falha; desktop e mobile; pré-visualização e, quando possível, produção; conferir que não há dados sensíveis nos registros.

## Detalhes técnicos

- `verifyCaptcha` deixa de retornar cedo quando o token está ausente: `signIn` lança erro antes de qualquer chamada ao Supabase. Em `signUp` o parâmetro segue **opcional**, preservando `RegisterPage.tsx` e qualquer chamador existente.
- Mapeamento de erro: `Invalid login credentials` → "Email ou senha inválidos."; `Email not confirmed` mantém o comportamento atual; demais erros → mensagem genérica de falha no login.
- Validação server-side existente (`verify-turnstile`, secret `TURNSTILE_SECRET_KEY` no cofre) preservada sem alteração; a Secret Key permanece fora do frontend.
- Sessão em `localStorage` via `brokeredPreviewStorage` (padrão Supabase); sem cookies próprios, portanto `Secure`/`HttpOnly`/`SameSite` não se aplicam ao site.
