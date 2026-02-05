
# Plano: Substituir Produtos de Teste por Produtos Reais

## Resumo

Vou apagar todos os produtos de teste atuais e cadastrar 10 produtos reais identificados nas fotos, com preços pesquisados no mercado brasileiro e as imagens que você forneceu.

---

## Produtos Identificados e Precos Pesquisados

| # | Produto | Categoria | Preco (R$) | Plataforma |
|---|---------|-----------|------------|------------|
| 1 | DualShock 4 - Controle PS4 Preto | Controles | 299,90 | PS4 |
| 2 | JBL Flip 7 - Caixa de Som Bluetooth | Audio | 759,00 | Universal |
| 3 | Xbox Wireless Controller Pulse Cipher (Vermelho) | Controles | 590,00 | Xbox Series |
| 4 | DualSense PS5 - Midnight Black | Controles | 349,90 | PS5 |
| 5 | DualSense PS5 - Starlight Blue | Controles | 399,90 | PS5 |
| 6 | PlayStation PULSE Elite - Headset Sem Fio | Audio | 799,90 | PS5/PC |
| 7 | JBL Quantum 100 M2 - Headset Gamer | Audio | 199,90 | Universal |
| 8 | JBL Xtreme 4 - Caixa de Som 100W | Audio | 2.199,00 | Universal |
| 9 | Logitech G29 Driving Force - Volante | Acessorios | 1.799,00 | PS5/PS4/PC |
| 10 | DualSense Edge PS5 - Controle Pro | Controles | 1.199,00 | PS5 |

---

## Fase 1: Upload das Imagens

Vou copiar as 10 imagens para a pasta `public/products/`:

```text
public/products/
  dualshock4-preto.jpeg
  jbl-flip7.jpeg
  xbox-pulse-cipher.jpeg
  dualsense-preto.jpeg
  dualsense-azul.jpeg
  pulse-elite.jpeg
  jbl-quantum-100.jpeg
  jbl-xtreme4.jpeg
  logitech-g29.jpeg
  dualsense-edge.jpeg
```

---

## Fase 2: Limpar Produtos de Teste

Executar SQL para remover produtos de teste:

```sql
DELETE FROM integra_product_tags WHERE product_id IN (
  SELECT id FROM integra_products WHERE matricula BETWEEN 1001 AND 1009
);
DELETE FROM integra_products WHERE matricula BETWEEN 1001 AND 1009;
```

---

## Fase 3: Inserir Produtos Reais

Inserir os 10 produtos na tabela `integra_products` com:

- `matricula`: IDs sequenciais (2001-2010)
- `descricao`: Nome completo do produto
- `preco_venda`: Preco normal
- `preco_promocao`: Alguns com preco promocional
- `foto`: URL local das imagens
- `grupo`: Categoria (Controles, Audio, Acessorios)
- `platform`: Plataforma compativel
- `saldo_atual`: Estoque disponivel
- `is_active`: true
- `is_featured`: true (para aparecer nas secoes)
- `badge_text` / `badge_color`: Badges visuais para alguns produtos

---

## Fase 4: Associar Tags

Criar tags e associar aos produtos:

```text
Tags a criar/usar:
- Controles
- Audio
- PlayStation
- Xbox
- PS5
- PS4
- JBL
- Sony
- Logitech
- Microsoft
- Headset
- Caixa de Som
- Volante
```

---

## Exemplo de Dados para Insert

```text
Produto 1 - DualShock 4:
  matricula: 2001
  descricao: "Controle Sony DualShock 4 PS4 Sem Fio - Preto"
  preco_venda: 299.90
  foto: "/products/dualshock4-preto.jpeg"
  grupo: "Controles"
  platform: "PS4"
  saldo_atual: 25
  is_featured: true
  badge_text: "Original"
  badge_color: "#003087"

Produto 6 - PULSE Elite:
  matricula: 2006
  descricao: "PlayStation PULSE Elite Headset Sem Fio"
  preco_venda: 899.90
  preco_promocao: 799.90
  foto: "/products/pulse-elite.jpeg"
  grupo: "Audio"
  platform: "PS5"
  saldo_atual: 10
  is_featured: true
  badge_text: "Lancamento"
  badge_color: "#22c55e"
```

---

## Resultado Esperado

- 0 produtos de teste restantes
- 10 produtos reais cadastrados
- Imagens reais das fotos fornecidas
- Precos atualizados do mercado brasileiro
- Produtos visíveis nas secoes "Produtos em Destaque"
- Cards funcionando com fotos de alta qualidade

---

## Secao Tecnica

### Mapeamento de Arquivos de Imagem

| Arquivo Original | Destino |
|-----------------|---------|
| WhatsApp_Image_2026-02-05_at_17.16.16_3.jpeg | dualshock4-preto.jpeg |
| WhatsApp_Image_2026-02-05_at_17.16.16_2.jpeg | jbl-flip7.jpeg |
| WhatsApp_Image_2026-02-05_at_17.16.16_1.jpeg | xbox-pulse-cipher.jpeg |
| WhatsApp_Image_2026-02-05_at_17.16.16.jpeg | dualsense-preto.jpeg |
| WhatsApp_Image_2026-02-05_at_17.16.15_3.jpeg | dualsense-azul.jpeg |
| WhatsApp_Image_2026-02-05_at_17.16.15_2.jpeg | pulse-elite.jpeg |
| WhatsApp_Image_2026-02-05_at_17.16.15_1.jpeg | jbl-quantum-100.jpeg |
| WhatsApp_Image_2026-02-05_at_17.16.15.jpeg | jbl-xtreme4.jpeg |
| WhatsApp_Image_2026-02-05_at_17.16.14_4.jpeg | logitech-g29.jpeg |
| WhatsApp_Image_2026-02-05_at_17.16.14_3.jpeg | dualsense-edge.jpeg |

### Campos do integra_products

```text
id (uuid) - gerado automaticamente
matricula (integer) - codigo interno 2001-2010
descricao (text) - nome do produto
preco_venda (numeric) - preco cheio
preco_promocao (numeric) - preco promocional (opcional)
foto (text) - URL da imagem
grupo (text) - categoria
platform (text) - plataforma
saldo_atual (integer) - estoque
is_active (boolean) - ativo
is_featured (boolean) - destaque
badge_text (text) - texto do badge
badge_color (text) - cor do badge
```
