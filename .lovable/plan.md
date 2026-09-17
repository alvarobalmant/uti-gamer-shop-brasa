# Cloudflare Turnstile no login e cadastro

Adicionar a verificação de segurança Turnstile ao modal de entrada existente, usando o CAPTCHA nativo do Supabase. Nada da sessão, papéis de admin, recuperação de senha ou confirmação de e-mail muda.

Site Key pública a usar: `0x4AAAAAAE6ZxbpyLt9wf2lZ`

## O que o cliente vai ver

- Na aba **Entrar**: abaixo do campo Senha aparece a caixinha de verificação da Cloudflare; o botão Entrar fica desabilitado até a verificação concluir.
- Na aba **Cadastrar**: mesma caixinha antes do botão de criar conta (necessária porque o CAPTCHA do Supabase, quando ativado, também exige verificação no cadastro).
- Mensagens claras: "Complete a verificação de segurança", "A verificação expirou, tente novamente", "Falha na verificação de segurança".
- Design, cores e responsividade atuais preservados.

## Alterações de código

1. **Dependência**: instalar `@marsidev/react-turnstile` (não existe alternativa no projeto).
2. **Novo** `src/components/Auth/TurnstileWidget.tsx`: encapsula o widget com a Site Key, tema claro, `size="flexible"`, e expõe `onToken`, `onExpire`, `onError` mais um `ref` para `reset()`.
3. **`src/components/Auth/AuthModalImproved.tsx`**:
   - estados `captchaToken` e `captchaStatus` (`loading` | `pending` | `ready` | `expired` | `error`), um par por aba (login e cadastro) via refs separadas;
   - widget inserido entre Senha e o botão de ação em ambas as abas;
   - `handleSignIn`/`handleSignUp` bloqueiam a chamada e avisam quando não há token; passam o token adiante; após qualquer tentativa (sucesso ou erro) chamam `reset()` do widget e limpam o token, evitando reuso;
   - ao fechar/reabrir o modal e ao trocar de aba, token e widget são resetados.
4. **`src/hooks/useAuth.tsx`**: `signIn(email, password, captchaToken?)` e `signUp(email, password, name, captchaToken?)` — parâmetro **opcional**, então os chamadores atuais continuam válidos. Repassa como `options: { captchaToken }` para `signInWithPassword` e mescla em `options` do `signUp`. O tipo do contexto é atualizado igual. Nenhuma outra lógica do provider muda.
5. **Site Key** fica como constante pública no frontend. A Secret Key não entra no código — ela é cadastrada por você no painel do Supabase.

## Configuração necessária no Supabase (feita por você)

Em Authentication → Settings → Bot and Abuse Protection: ativar "Enable CAPTCHA protection", provedor **Cloudflare Turnstile**, e colar a **Secret Key** do widget. Enquanto isso não estiver ativo, o login continua funcionando normalmente (o token é simplesmente ignorado pelo Supabase) — ou seja, dá para publicar o código antes e ativar depois, sem janela de quebra.

Observação: o widget Turnstile está registrado para `utidosgames.com.br`. Para funcionar também no endereço de pré-visualização do Lovable, adicione esse domínio na lista de domínios do widget na Cloudflare; caso contrário a verificação só passa no domínio oficial.

## Nenhuma Edge Function

A validação é feita pelo próprio Supabase. Nenhuma função de servidor é criada e o frontend nunca chama a API da Cloudflare.

## Testes

Lint e build; verificação no navegador (desktop e mobile) do modal: abrir, tentar entrar sem verificação, concluir verificação, login correto, senha errada, nova tentativa após falha, fechar e reabrir o modal.
