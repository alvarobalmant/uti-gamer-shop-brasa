
# Plano: Cadastrar 10 Novos Produtos Reais

## Resumo

Vou adicionar mais 10 produtos reais ao catalogo, usando as fotos que voce enviou e precos pesquisados no mercado brasileiro. Os produtos atuais (matricula 2001-2010) serao mantidos.

---

## Produtos Identificados e Precos Pesquisados

| # | Produto | Categoria | Preco (R$) | Plataforma |
|---|---------|-----------|------------|------------|
| 1 | Controle Sony DualSense PS5 - Branco | Controles | 369,90 | PS5 |
| 2 | QCY ArcBuds Lite T27 Fone Bluetooth TWS | Audio | 89,90 | Universal |
| 3 | JBL Quantum 360X Headset Wireless Xbox | Audio | 549,90 | Xbox Series |
| 4 | Logitech Driving Force Shifter Cambio | Acessorios | 499,00 | PS5/PC |
| 5 | PlayStation 5 Disc Drive Leitor Disco | Acessorios | 699,90 | PS5 |
| 6 | PlayStation VR2 | Consoles | 2.499,00 | PS5 |
| 7 | PlayStation 5 Slim Console | Consoles | 3.499,00 | PS5 |
| 8 | Controle Sony DualSense PS5 - Cobalt Blue | Controles | 469,90 | PS5 |
| 9 | DualSense Base de Carregamento PS5 | Acessorios | 199,90 | PS5 |
| 10 | Controle Xbox Wireless Velocity Green | Controles | 599,00 | Xbox Series |

---

## Fase 1: Upload das Imagens

Copiar as 10 novas imagens para `public/products/`:

```text
public/products/
  dualsense-branco.jpeg
  qcy-arcbuds-lite.jpeg
  jbl-quantum-360x.jpeg
  logitech-shifter.jpeg
  ps5-disc-drive.jpeg
  playstation-vr2.jpeg
  ps5-slim-console.jpeg
  dualsense-cobalt-blue.jpeg
  dualsense-charging-station.jpeg
  xbox-velocity-green.jpeg
```

---

## Fase 2: Inserir Produtos no Banco

Inserir os 10 novos produtos na tabela `integra_products` com:

- `matricula`: IDs sequenciais (2011-2020)
- `descricao`: Nome completo do produto
- `preco_venda`: Preco normal pesquisado
- `preco_promocao`: Alguns com preco promocional
- `foto`: URL local das imagens
- `grupo`: Categoria (Controles, Audio, Acessorios, Consoles)
- `platform`: Plataforma compativel
- `saldo_atual`: Estoque disponivel
- `is_active`: true
- `is_featured`: true (para aparecer nas secoes)
- `badge_text` / `badge_color`: Badges visuais para alguns produtos

---

## Fase 3: Criar e Associar Tags

Novas tags necessarias:
- `QCY` (marca)
- `VR` (subcategoria)
- `Console` (tipo)
- `Fone TWS` (subcategoria)

Associar tags existentes e novas aos produtos.

---

## Mapeamento de Arquivos de Imagem

| Arquivo Original | Produto | Destino |
|-----------------|---------|---------|
| WhatsApp_Image_2026-02-05_at_17.16.14_2.jpeg | DualSense Branco | dualsense-branco.jpeg |
| WhatsApp_Image_2026-02-05_at_17.16.14_1.jpeg | QCY ArcBuds Lite | qcy-arcbuds-lite.jpeg |
| WhatsApp_Image_2026-02-05_at_17.16.14.jpeg | JBL Quantum 360X | jbl-quantum-360x.jpeg |
| WhatsApp_Image_2026-02-05_at_17.16.13_4.jpeg | Logitech Shifter | logitech-shifter.jpeg |
| WhatsApp_Image_2026-02-05_at_17.16.13_3.jpeg | PS5 Disc Drive | ps5-disc-drive.jpeg |
| WhatsApp_Image_2026-02-05_at_17.16.13_2.jpeg | PlayStation VR2 | playstation-vr2.jpeg |
| WhatsApp_Image_2026-02-05_at_17.16.13_1.jpeg | PS5 Slim Console | ps5-slim-console.jpeg |
| WhatsApp_Image_2026-02-05_at_17.16.13.jpeg | DualSense Cobalt Blue | dualsense-cobalt-blue.jpeg |
| WhatsApp_Image_2026-02-05_at_17.16.12_1.jpeg | DualSense Charging Station | dualsense-charging-station.jpeg |
| WhatsApp_Image_2026-02-05_at_17.16.12.jpeg | Xbox Velocity Green | xbox-velocity-green.jpeg |

---

## Dados Detalhados para Insercao

```text
Produto 2011 - DualSense Branco:
  descricao: "Controle Sony DualSense PS5 Sem Fio - Branco"
  preco_venda: 369.90
  foto: "/products/dualsense-branco.jpeg"
  grupo: "Controles"
  platform: "PS5"
  saldo_atual: 35
  badge_text: "Original"
  badge_color: "#003087"

Produto 2012 - QCY ArcBuds Lite:
  descricao: "QCY ArcBuds Lite T27 Fone Bluetooth 5.3 TWS"
  preco_venda: 89.90
  foto: "/products/qcy-arcbuds-lite.jpeg"
  grupo: "Audio"
  platform: "Universal"
  saldo_atual: 50
  badge_text: "Custo-Beneficio"
  badge_color: "#f59e0b"

Produto 2013 - JBL Quantum 360X:
  descricao: "JBL Quantum 360X Headset Gamer Wireless para Xbox"
  preco_venda: 599.90
  preco_promocao: 549.90
  foto: "/products/jbl-quantum-360x.jpeg"
  grupo: "Audio"
  platform: "Xbox Series"
  saldo_atual: 12
  badge_text: "Para Xbox"
  badge_color: "#107c10"

Produto 2014 - Logitech Shifter:
  descricao: "Logitech G Driving Force Shifter Cambio 6 Marchas"
  preco_venda: 499.00
  foto: "/products/logitech-shifter.jpeg"
  grupo: "Acessorios"
  platform: "PS5"
  saldo_atual: 8
  badge_text: "Pro Racing"
  badge_color: "#00a2ed"

Produto 2015 - PS5 Disc Drive:
  descricao: "PlayStation 5 Disc Drive Leitor de Disco para PS5 Slim"
  preco_venda: 699.90
  foto: "/products/ps5-disc-drive.jpeg"
  grupo: "Acessorios"
  platform: "PS5"
  saldo_atual: 15
  badge_text: "Oficial"
  badge_color: "#003087"

Produto 2016 - PlayStation VR2:
  descricao: "PlayStation VR2 Oculos de Realidade Virtual PS5"
  preco_venda: 2499.00
  foto: "/products/playstation-vr2.jpeg"
  grupo: "Consoles"
  platform: "PS5"
  saldo_atual: 5
  badge_text: "VR Premium"
  badge_color: "#8b5cf6"

Produto 2017 - PS5 Slim Console:
  descricao: "Console PlayStation 5 Slim com Disco 1TB"
  preco_venda: 3499.00
  foto: "/products/ps5-slim-console.jpeg"
  grupo: "Consoles"
  platform: "PS5"
  saldo_atual: 8
  badge_text: "Novo Slim"
  badge_color: "#003087"

Produto 2018 - DualSense Cobalt Blue:
  descricao: "Controle Sony DualSense PS5 Sem Fio - Cobalt Blue"
  preco_venda: 469.90
  foto: "/products/dualsense-cobalt-blue.jpeg"
  grupo: "Controles"
  platform: "PS5"
  saldo_atual: 20
  badge_text: "Cor Exclusiva"
  badge_color: "#2563eb"

Produto 2019 - Charging Station:
  descricao: "DualSense Base de Carregamento PS5 Charging Station"
  preco_venda: 199.90
  foto: "/products/dualsense-charging-station.jpeg"
  grupo: "Acessorios"
  platform: "PS5"
  saldo_atual: 30
  badge_text: "Essencial"
  badge_color: "#10b981"

Produto 2020 - Xbox Velocity Green:
  descricao: "Controle Xbox Wireless Series X/S Velocity Green"
  preco_venda: 599.00
  foto: "/products/xbox-velocity-green.jpeg"
  grupo: "Controles"
  platform: "Xbox Series"
  saldo_atual: 15
  badge_text: "Edicao Especial"
  badge_color: "#22c55e"
```

---

## Resultado Esperado

- 20 produtos totais no catalogo (10 anteriores + 10 novos)
- Imagens reais de alta qualidade
- Precos atualizados do mercado brasileiro
- Variedade de categorias: Controles, Audio, Acessorios, Consoles
- Todos os produtos visiveis nas secoes em destaque

---

## Secao Tecnica

### Estrutura SQL de Insercao

```sql
INSERT INTO integra_products (
  matricula, descricao, preco_venda, preco_promocao, 
  foto, grupo, platform, saldo_atual, 
  is_active, is_featured, badge_text, badge_color, badge_visible
) VALUES
(2011, '...', 369.90, NULL, '/products/dualsense-branco.jpeg', 'Controles', 'PS5', 35, true, true, 'Original', '#003087', true),
-- ... demais produtos
(2020, '...', 599.00, NULL, '/products/xbox-velocity-green.jpeg', 'Controles', 'Xbox Series', 15, true, true, 'Edicao Especial', '#22c55e', true);
```

### Novas Tags a Criar

```sql
INSERT INTO integra_tags (name, category) VALUES
('QCY', 'marca'),
('VR', 'subcategoria'),
('Console', 'tipo'),
('Fone TWS', 'subcategoria')
ON CONFLICT DO NOTHING;
```

### Associacao de Tags

Cada produto sera associado a 3-5 tags relevantes para facilitar filtragem e busca.
