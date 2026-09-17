---
name: Vínculo seção ↔ produtos restaurado
description: product_section_items recriada (2026-09-17); painel Seções Produtos salva produtos/tags por seção; home e página de seção consomem via useProductSections
type: feature
---
A tabela `product_section_items` (section_id text → product_sections.id, item_type 'product'|'tag', item_id text, display_order) foi recriada em 17/09/2026 — havia sido removida, deixando todas as seções vazias/fallback. Regras: leitura pública (home precisa renderizar para visitantes), escrita só admin (`is_admin(auth.uid())`), cascade ao excluir seção. `useProductSections` carrega os itens e os salva (delete+insert) em createSection/updateSection. `SectionRenderer` e `SectionPage` já tinham a lógica legada que consome `section.items` — voltaram a funcionar sem alteração. Seções sem itens continuam no fallback (destaques, até 12).
