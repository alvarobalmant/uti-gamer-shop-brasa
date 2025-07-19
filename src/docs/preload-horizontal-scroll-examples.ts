/**
 * EXEMPLO DE USO - Sistema de Scroll Horizontal PRÉ-CARREGAMENTO
 * 
 * Este sistema garante que a posição horizontal seja consultada e aplicada
 * ANTES da seção carregar, nunca depois.
 */

// MÉTODO 1: Componente ProductSection (RECOMENDADO)
// Use o componente ProductSection em suas páginas

// MÉTODO 2: Hook Direto
// Use usePreLoadHorizontalScroll diretamente

// FUNCIONAMENTO DO SISTEMA
// ✅ ANTES da seção renderizar: Consulta localStorage para posição salva
// ✅ DURANTE a renderização: Aplica a posição recuperada imediatamente
// ✅ APÓS a renderização: Registra a seção para salvamento contínuo a cada 20ms

// FLUXO OBRIGATÓRIO
// 1. Usuário navega para página → preLoadHorizontalScrollManager.setCurrentPage()
// 2. Seção vai renderizar → usePreLoadHorizontalScroll consulta posição salva
// 3. Seção renderiza → useEffect aplica posição imediatamente
// 4. Seção fica ativa → salvamento a cada 20ms em localStorage
// 5. Usuário sai da página → posições ficam salvas para próxima visita

// DEBUG E MONITORAMENTO
// No console do navegador:
// window.preLoadHorizontalScrollManager.debugPositions() - Mostra tudo
// window.preLoadHorizontalScrollManager.forceSave() - Força salvamento

// VANTAGENS DESTE SISTEMA
// ✅ Consulta OBRIGATÓRIA antes do carregamento
// ✅ Aplicação IMEDIATA da posição
// ✅ Salvamento CONTÍNUO a cada 20ms
// ✅ Persistência em localStorage
// ✅ Sistema robusto com fallbacks
// ✅ Não depende de detecção posterior

export const PreLoadHorizontalScrollExamples = {
  // Este objeto é apenas para documentação
};