# Diagnóstico: Produtos, Imagens, Storage e Seções

Auditoria somente de leitura. Nada foi alterado: nenhuma tabela, bucket, campo, regra de acesso, produto, layout ou design.

## Resposta à pergunta: "por que meu produto novo não aparece na seção?"

A página da seção (ex.: "Lacrados e com 3 anos de garantia") só mostra produtos que foram **vinculados manualmente àquela seção** — mas a tabela que guardava esses vínculos não existe mais no banco. Por isso a página sempre abre vazia ("Nenhum produto encontrado nesta categoria"), e não existe hoje, no painel, nenhum lugar para vincular produtos a uma seção. Cadastrar o produto no menu Produtos não basta. A correção está no item I.3 abaixo.

## A. Como os produtos são armazenados

- Ficam na tabela `products` do banco do projeto. Hoje existem **20 produtos**, todos marcados como "destaque".
- O menu **Produtos** do painel tem cadastro, edição e exclusão funcionando de verdade (grava direto nessa tabela).
- Há comentários antigos no código dizendo "gerenciado pelo ERP" que não valem mais: o cadastro atual é próprio, não vem do ERP.
- Existe uma tela antiga de produtos no código que não está mais acessível por nenhum endereço do site.

## B. Como as imagens são armazenadas

- Cada produto tem um campo de imagem principal e uma lista de imagens adicionais.
- Na aba **Imagens** do editor só é possível **colar um endereço (URL)**. Não existe botão de enviar arquivo ali.
- As 20 imagens atuais são todas diferentes entre si, porém **nenhuma está hospedada no projeto** — todas apontam para endereços externos.
- Já existe código pronto para enviar arquivo (converte para WebP automaticamente), mas ele não está ligado ao editor de produto.
- Uma terceira peça de gestão de imagem de produto existe mas está desligada (só registra no console).

## C. Como o Storage funciona

- Existe **um único depósito de arquivos**, `site-images`, compartilhado entre imagens do site e de produtos. Não há depósito dedicado a produtos; a separação é apenas por pasta (`products/...`).
- O menu **Gerenciar Storage** conversa com uma função de servidor que: varre o depósito, mostra estatísticas (tamanho, quantidade, quantas já são WebP) e lista **imagens externas** dos produtos, com botão para baixá-las e comprimi-las.
- O vínculo arquivo ↔ produto é indireto: existe só porque o endereço gravado no produto aponta para o arquivo. Não há relação estruturada.

## D. Como as Seções Produtos funcionam

- A tabela de seções guarda **apenas aparência**: título, partes do título, cores e link "ver todos". Existem 15 seções.
- A tabela que guardava **quais produtos pertencem a cada seção não existe mais** no banco. O código sempre devolve lista vazia de itens.
- Consequência: não há seleção manual, filtro por categoria, ordenação nem limite configurável por seção.
- O menu **Layout Home** controla somente a ordem e a visibilidade dos blocos da home.

## E/F. Como "Jogos mais vendidos" e as outras seções escolhem produtos

Todas caem no mesmo caminho de emergência do código: mostra os produtos marcados como destaque (até 12) e, se não houver nenhum, os 12 primeiros da lista.

| Seção na home | Origem real dos produtos |
|---|---|
| Jogos mais vendidos | destaques (mesmo conjunto) |
| Lançamentos Incríveis | destaques (mesmo conjunto) |
| Colecionáveis Exclusivos | destaques (mesmo conjunto) |
| ps5 jogos | destaques — e está oculta na home hoje |

Como os 20 produtos estão todos marcados como destaque, **as quatro seções mostram praticamente os mesmos produtos**; o título é apenas um rótulo.

"Jogos mais vendidos" **não usa vendas reais** — nenhum trecho do sistema soma vendas por produto.

Dados de venda existentes:
- Pedidos online: **0 registros** (fluxo novo, ainda sem uso).
- Códigos de retirada: **178 registros, 33 concluídos**, e cada um guarda os itens com produto, nome e quantidade. **É uma base real de vendas utilizável.**

## G. Como o card do produto recebe a imagem

- O card usado na home, nas seções, nas categorias, nos relacionados e no modal é o mesmo, e simplesmente mostra o endereço gravado no produto, com uma imagem cinza de reserva caso falhe.
- A busca usa um card próprio; as páginas de plataforma (Xbox) usam outro; o carrinho não usa card de produto.
- Existem duas versões "otimizadas" de imagem no código que **não estão em uso** — uma delas inclusive lê um campo de imagem que não existe mais.

## H. O que falta para cada produto ter sua imagem corretamente

1. Ligar o envio de arquivo (já existente) ao editor de produto, na aba Imagens, mantendo também a opção de colar endereço.
2. Padronizar a pasta de destino por produto dentro do depósito atual, sem criar depósito novo.
3. Usar o "Gerenciar Storage" para trazer as 20 imagens externas para dentro do projeto (o botão já existe), evitando dependência de sites de terceiros.
4. Fazer o card usar a versão otimizada de imagem que já existe (carregamento sob demanda, WebP, tamanho adequado), sem trocar o desenho.
5. Corrigir o card não utilizado que lê o campo de imagem errado, ou removê-lo.

## I. O que falta para "Jogos mais vendidos" usar vendas reais

1. Criar uma função no servidor que some as quantidades vendidas por produto a partir dos códigos de retirada concluídos (e, quando houver, dos pedidos online).
2. Ligar essa lista à seção "Jogos mais vendidos", com período (ex.: últimos 90 dias) e limite de itens.
3. Restaurar a curadoria das outras seções: devolver ao painel a escolha de quais produtos aparecem em cada seção (seleção manual e/ou por categoria/etiqueta), com ordenação e limite — hoje isso não existe.

## Ordem sugerida de implementação

1. Envio de imagem no editor de produto + trazer as imagens externas para dentro do projeto.
2. Imagem otimizada no card.
3. Curadoria por seção no painel.
4. "Mais vendidos" com vendas reais.

Nada será alterado até você escolher por onde começar.

## Detalhes técnicos

- Admin ativo: `src/pages/Admin.tsx` → `src/components/Admin/AdminPanel.tsx` → `ProductManager/ProductManagerOptimizedNew.tsx`; CRUD real em `src/hooks/useProducts/productApi.ts` (`supabase.from('products')`). `adminProductApi.fetchMasterProductsForAdmin` é stub.
- Imagens: `ProductEditor/Tabs/ImagesTab.tsx` (URL only); upload real disponível em `src/hooks/useImageUpload.ts` (bucket `site-images`, WebP no cliente, invoca `storage-manager`); `useProductImageManager.ts` é stub.
- Storage: bucket único `site-images`; edge functions `storage-manager`, `compress-images`, `scan-storage`, `image-proxy`; admin em `src/components/Admin/StorageManager.tsx`.
- Seções: `src/hooks/useProductSections.ts` retorna sempre `items: []` (`product_section_items` inexistente: `42P01`); fallback em `src/components/HomePage/SectionRenderer.tsx:114-127` (`is_featured` → `slice(0,12)`).
- Layout: `src/pages/Admin/HomepageLayoutManager.tsx` + `homepage_layout` (`section_key = product_section_<uuid>`).
- Vendas: `orders`/`order_items` com 0 linhas; `order_verification_codes` (178 linhas, 33 `completed`) com `items` jsonb contendo `product_id`, `quantity`, `price`, `total`.
- Card ativo: `src/components/ProductCard.tsx` → `ProductCard/ProductCardImage.tsx` (`product.image`, `loading="lazy"`, fallback SVG). Não usados: `ProductCard/ProductCardImageOptimized.tsx`, `ProductCardOptimized.tsx` (lê `image_url`, inexistente).
- Cache: `src/utils/ProductCacheManager.ts` (TTL 5 min), `src/hooks/useProductPrefetch.ts` (hover, TTL 5 min), `src/utils/imageOptimization.ts` (srcSet/WebP/preload — consumido só pelo card otimizado inativo).
