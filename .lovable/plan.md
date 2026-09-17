# Auditoria de segurança do login — resultado e correções

Auditoria concluída (nada foi alterado ainda). O login usa Supabase Auth com e-mail/senha, chamado diretamente do navegador; o Turnstile é validado no servidor pela função `verify-turnstile`, com a chave secreta apenas no cofre. Abaixo o que encontrei e o que proponho mudar.

## O que já está correto (preservar, sem duplicar)

- Chave secreta da Cloudflare só no servidor; o site nunca chama a Cloudflare diretamente.
- O código do desafio fica só na memória da tela, nunca é salvo no navegador; é descartado após cada tentativa, ao trocar de aba e ao fechar o modal. Códigos expirados e reutilizados são recusados (a Cloudflare aceita cada código uma única vez).
- Não existem cookies próprios do site: a sessão é gerenciada pelo Supabase.
- Nenhuma senha aparece em registros do navegador.

## Problemas encontrados

### 1. A verificação pode ser contornada (severidade ALTA — sem correção possível só por código)

O login acontece direto entre o navegador e o Supabase. Um robô pode ignorar completamente a nossa tela e chamar o Supabase diretamente, sem passar pela verificação. Além disso, hoje a verificação é *opcional* internamente: se o código do desafio não for enviado, o login prossegue.

- **Correção parcial que farei:** tornar o código do desafio obrigatório no login (sem ele, o login nem é tentado) e enviá-lo também ao Supabase, de modo que, no dia em que o CAPTCHA nativo for ligado no painel, a proteção passe a valer de verdade sem nova alteração.
- **Correção definitiva (depende de você):** ligar o CAPTCHA nativo no painel do Supabase (Authentication → Bot and Abuse Protection, provedor Cloudflare Turnstile, colando a chave secreta). Só isso amarra a verificação ao login de forma que não possa ser contornada. Você mencionou não ter acesso ao painel — nesse caso, é preciso pedir a quem tem.

### 2. Limite de tentativas no login: não existe

Não há nenhum ponto de servidor entre o site e o Supabase onde colocar um limite; o Supabase Auth aplica os limites da própria plataforma. Criar um intermediário mudaria a arquitetura do login, o que está fora do escopo. **Não vou implementar** — fica documentado que o limite efetivo depende de ligar o CAPTCHA nativo (item 1) e, se desejado, dos limites de autenticação no painel do Supabase.

### 3. Mensagens de erro revelam informação e vêm em inglês (MÉDIA)

Hoje a mensagem crua do Supabase é exibida ("Invalid login credentials"). Vou padronizar para **"Email ou senha inválidos."**, mantendo o aviso separado quando falta confirmar o e-mail. Cadastro e recuperação de senha não serão tocados.

### 4. Dados sensíveis no console do navegador (MÉDIA)

O diagnóstico de sessão imprime e-mail, ID do usuário e um trecho do token de acesso guardado no navegador. Vou remover esses valores dos registros, mantendo apenas informação não identificável.

### 5. Cabeçalhos de segurança: nenhum configurado (MÉDIA — configuração externa)

O site não envia `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` nem política de conteúdo. Não há onde configurá-los neste projeto (o `netlify.toml` existente só trata rotas e não é usado pela hospedagem atual). **Não vou inventar solução** — documento o que configurar na Cloudflare, incluindo liberar `challenges.cloudflare.com` em qualquer política de conteúdo para não quebrar a verificação.

### 6. Sem segundo fator para contas administrativas (recomendação futura)

Não existe segundo fator hoje. Fica registrado como recomendação separada, sem alteração de papéis ou permissões nesta tarefa.

### 7. Reautenticação em operações sensíveis (recomendação futura)

Troca de e-mail/senha e operações administrativas não pedem reconfirmação de identidade. Apenas documentado; nenhum desses fluxos será alterado.

## Alterações que serão feitas

| Arquivo | Mudança |
| --- | --- |
| `src/hooks/useAuth.tsx` | Verificação obrigatória no login; código do desafio também enviado ao Supabase; mensagem genérica de credenciais; registros sem ID de usuário |
| `src/utils/sessionMonitor.ts` | Remover e-mail, ID e trechos de token dos registros |
| `src/components/Auth/AuthModalImproved.tsx` | Remover registro do e-mail/tentativa e ajustar o texto de erro exibido |

Nada mais será alterado: cadastro, recuperação de senha, confirmação de e-mail, sessão, `AuthProvider`, papéis, `isAdmin`, guardas de admin, banco de dados, regras de acesso, produtos, pedidos, pagamentos e design permanecem intactos.

**Nenhuma função de servidor nova será criada. Nenhuma dependência será adicionada, removida ou atualizada.**

## Testes

Login válido, logout, sessão preservada; login sem verificação (bloqueado); código de verificação inválido (recusado no servidor); senha errada (mensagem genérica); código expirado e reabertura do modal; verificação de `http` → `https` no domínio de produção; desktop e mobile, na pré-visualização e em produção.

## Detalhes técnicos

- `verifyCaptcha` deixa de retornar cedo quando o token está ausente: passa a lançar erro no `signIn`. Em `signUp` o parâmetro segue opcional, para não quebrar `RegisterPage.tsx`.
- `signInWithPassword` passará a receber `options: { captchaToken }`. Enquanto o CAPTCHA nativo estiver desligado no painel, o Supabase ignora o campo — não há validação duplicada; quando for ligado, a validação passa a ser obrigatória do lado do Supabase.
- Mapeamento de erro: `Invalid login credentials` → "Email ou senha inválidos."; `Email not confirmed` mantém o aviso atual; outros erros seguem uma mensagem genérica de falha.
- Sessão em `localStorage` via `brokeredPreviewStorage` (padrão do Supabase); sem cookies próprios, portanto `Secure`/`HttpOnly`/`SameSite` não se aplicam ao site.
- Cabeçalhos sugeridos para a Cloudflare (Transform Rules → Response Headers): `Strict-Transport-Security: max-age=31536000; includeSubDomains`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: geolocation=(), microphone=(), camera=()`. Política de conteúdo apenas depois de teste em ambiente separado, permitindo `https://challenges.cloudflare.com` em `script-src` e `frame-src`.
