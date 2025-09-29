/**
 * Helper para testar o comportamento do scroll restoration
 * Usado para validar se as correções estão funcionando corretamente
 */

interface ScrollTestResult {
  page: string;
  scrollRestorationMode: string;
  isProblematicPage: boolean;
  currentScrollY: number;
  timestamp: number;
}

class ScrollTestHelper {
  private testResults: ScrollTestResult[] = [];

  /**
   * Testa o comportamento atual do scroll restoration
   */
  testCurrentPage(): ScrollTestResult {
    const page = window.location.pathname + window.location.search;
    const scrollRestorationMode = window.history.scrollRestoration || 'auto';
    const problematicPages = ['/busca', '/secao'];
    const isProblematicPage = problematicPages.some(p => page.startsWith(p));
    const currentScrollY = window.scrollY;

    const result: ScrollTestResult = {
      page,
      scrollRestorationMode,
      isProblematicPage,
      currentScrollY,
      timestamp: Date.now()
    };

    this.testResults.push(result);
    
    console.log('[ScrollTest] 🧪 Teste de scroll:', result);
    
    return result;
  }

  /**
   * Valida se o comportamento está correto para o tipo de página
   */
  validateBehavior(): boolean {
    const current = this.testCurrentPage();
    
    if (current.isProblematicPage) {
      // Para páginas problemáticas, deve estar em modo manual
      const isCorrect = current.scrollRestorationMode === 'manual';
      console.log(`[ScrollTest] ${isCorrect ? '✅' : '❌'} Página problemática ${current.page}: modo ${current.scrollRestorationMode}`);
      return isCorrect;
    } else {
      // Para páginas normais, deve estar em modo auto
      const isCorrect = current.scrollRestorationMode === 'auto';
      console.log(`[ScrollTest] ${isCorrect ? '✅' : '❌'} Página normal ${current.page}: modo ${current.scrollRestorationMode}`);
      return isCorrect;
    }
  }

  /**
   * Simula navegação e testa scroll restoration
   */
  async simulateNavigation(targetUrl: string): Promise<void> {
    console.log(`[ScrollTest] 🔄 Simulando navegação para: ${targetUrl}`);
    
    // Salva estado atual
    const beforeNav = this.testCurrentPage();
    
    // Simula scroll para baixo antes de navegar
    window.scrollTo({ top: 500, behavior: 'instant' });
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log(`[ScrollTest] 📍 Scroll antes da navegação: ${window.scrollY}px`);
    
    // Simula navegação (em um teste real, usaria router)
    console.log(`[ScrollTest] ➡️ Navegação simulada para: ${targetUrl}`);
    
    // Em um teste real, aqui verificaríamos o comportamento após a navegação
  }

  /**
   * Força scroll para o topo (simula o comportamento das páginas problemáticas)
   */
  forceScrollToTop(): void {
    console.log('[ScrollTest] ⬆️ Forçando scroll para o topo...');
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    setTimeout(() => {
      const finalScroll = window.scrollY;
      console.log(`[ScrollTest] 📍 Scroll final: ${finalScroll}px`);
    }, 100);
  }

  /**
   * Mostra histórico de testes
   */
  showTestHistory(): void {
    console.log('[ScrollTest] 📊 Histórico de testes:');
    this.testResults.forEach((result, index) => {
      console.log(`  ${index + 1}. ${result.page} - ${result.scrollRestorationMode} - ${result.isProblematicPage ? 'Problemática' : 'Normal'} - ${result.currentScrollY}px`);
    });
  }

  /**
   * Limpa histórico de testes
   */
  clearHistory(): void {
    this.testResults = [];
    console.log('[ScrollTest] 🗑️ Histórico limpo');
  }

  /**
   * Testa se o sistema está funcionando corretamente
   */
  runFullTest(): boolean {
    console.log('[ScrollTest] 🚀 Executando teste completo...');
    
    const isValid = this.validateBehavior();
    
    if (isValid) {
      console.log('[ScrollTest] ✅ Sistema funcionando corretamente!');
    } else {
      console.log('[ScrollTest] ❌ Sistema com problemas!');
    }
    
    return isValid;
  }
}

// Instância global para testes
const scrollTestHelper = new ScrollTestHelper();

// Expor no window para uso no console
(window as any).scrollTestHelper = scrollTestHelper;

// Executar teste automático quando carregado
if (typeof window !== 'undefined') {
  // Aguarda um pouco para garantir que o sistema de scroll foi inicializado
  setTimeout(() => {
    scrollTestHelper.runFullTest();
  }, 1000);
}

export default scrollTestHelper;
