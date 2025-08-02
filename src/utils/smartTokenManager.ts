import { supabase } from '@/integrations/supabase/client';

/**
 * Sistema inteligente de gerenciamento de token
 * - Refresh automático quando token passa da metade da validade
 * - Logout limpo quando token está completamente expirado
 * - Experiência transparente para o usuário
 */
class SmartTokenManager {
  private isRefreshing = false;
  private refreshPromise: Promise<boolean> | null = null;

  /**
   * Verifica e gerencia o token ao entrar no site
   * Retorna true se sessão é válida, false se precisa fazer logout
   */
  async checkAndRefreshOnEntry(): Promise<{ isValid: boolean; needsLogout: boolean; message?: string }> {
    try {
      console.log('🔍 [SmartToken] Verificando token na entrada do site...');

      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('❌ [SmartToken] Erro ao obter sessão:', error);
        return { isValid: false, needsLogout: true, message: 'Erro de autenticação. Faça login novamente.' };
      }

      if (!session) {
        console.log('ℹ️ [SmartToken] Nenhuma sessão encontrada');
        return { isValid: false, needsLogout: false };
      }

      // Verificar se token está expirado
      const now = Math.floor(Date.now() / 1000);
      const tokenExp = session.expires_at || 0;
      const timeUntilExpiry = tokenExp - now;

      console.log(`🕐 [SmartToken] Token expira em: ${Math.round(timeUntilExpiry / 60)} minutos`);

      // Token já expirado - logout imediato
      if (timeUntilExpiry <= 0) {
        console.warn('⏰ [SmartToken] Token expirado - logout necessário');
        return { 
          isValid: false, 
          needsLogout: true, 
          message: 'Sua sessão expirou. Faça login novamente para continuar.' 
        };
      }

      // Token expirando muito em breve (menos de 5 minutos) - logout preventivo
      if (timeUntilExpiry <= 300) {
        console.warn('⚠️ [SmartToken] Token expirando em breve - logout preventivo');
        return { 
          isValid: false, 
          needsLogout: true, 
          message: 'Sua sessão está expirando. Faça login novamente para continuar.' 
        };
      }

      // Calcular se token passou da metade da validade
      const tokenLifetime = this.calculateTokenLifetime(session);
      const halfLife = tokenLifetime / 2;
      const tokenAge = tokenLifetime - timeUntilExpiry;

      console.log(`📊 [SmartToken] Idade do token: ${Math.round(tokenAge / 3600)} horas de ${Math.round(tokenLifetime / 3600)} horas totais`);

      // Token passou da metade da vida - refresh necessário
      if (tokenAge >= halfLife) {
        console.log('🔄 [SmartToken] Token passou da metade da validade - iniciando refresh...');
        
        const refreshSuccess = await this.performSmartRefresh();
        
        if (!refreshSuccess) {
          console.error('❌ [SmartToken] Refresh falhou - logout necessário');
          return { 
            isValid: false, 
            needsLogout: true, 
            message: 'Não foi possível renovar sua sessão. Faça login novamente.' 
          };
        }

        console.log('✅ [SmartToken] Token renovado com sucesso');
        return { isValid: true, needsLogout: false };
      }

      // Token ainda válido e não precisa refresh
      console.log('✅ [SmartToken] Token válido, nenhuma ação necessária');
      return { isValid: true, needsLogout: false };

    } catch (error) {
      console.error('❌ [SmartToken] Erro durante verificação:', error);
      return { 
        isValid: false, 
        needsLogout: true, 
        message: 'Erro inesperado. Faça login novamente.' 
      };
    }
  }

  /**
   * Calcula o tempo de vida total do token baseado na configuração atual
   */
  private calculateTokenLifetime(session: any): number {
    // Por padrão, tokens JWT do Supabase têm 1 hora (3600s)
    // Mas vamos calcular dinamicamente baseado no issued_at se disponível
    const now = Math.floor(Date.now() / 1000);
    const tokenExp = session.expires_at || 0;
    const tokenIat = session.user?.created_at ? 
      Math.floor(new Date(session.user.created_at).getTime() / 1000) : 
      now - 3600; // Fallback para 1 hora atrás

    // Calcular lifetime baseado na diferença entre exp e iat
    const calculatedLifetime = tokenExp - tokenIat;
    
    // Validar se o cálculo faz sentido (entre 1 hora e 7 dias)
    const oneHour = 3600;
    const sevenDays = 7 * 24 * 3600;
    
    if (calculatedLifetime >= oneHour && calculatedLifetime <= sevenDays) {
      console.log(`📏 [SmartToken] Lifetime calculado: ${Math.round(calculatedLifetime / 3600)} horas`);
      return calculatedLifetime;
    }

    // Fallback para configurações conhecidas
    const timeUntilExpiry = tokenExp - now;
    if (timeUntilExpiry > 6 * 24 * 3600) {
      // Provavelmente 7 dias
      console.log('📏 [SmartToken] Detectado lifetime de 7 dias');
      return 7 * 24 * 3600;
    } else if (timeUntilExpiry > 23 * 3600) {
      // Provavelmente 24 horas
      console.log('📏 [SmartToken] Detectado lifetime de 24 horas');
      return 24 * 3600;
    } else {
      // Provavelmente 1 hora
      console.log('📏 [SmartToken] Detectado lifetime de 1 hora');
      return 3600;
    }
  }

  /**
   * Executa refresh inteligente com retry e validação
   */
  private async performSmartRefresh(): Promise<boolean> {
    // Evitar múltiplos refreshes simultâneos
    if (this.isRefreshing && this.refreshPromise) {
      console.log('🔄 [SmartToken] Refresh já em andamento, aguardando...');
      return await this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.executeRefresh();

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  /**
   * Executa o refresh com retry
   */
  private async executeRefresh(): Promise<boolean> {
    const maxRetries = 3;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 [SmartToken] Tentativa de refresh ${attempt}/${maxRetries}`);

        const { data: { session }, error } = await supabase.auth.refreshSession();

        if (error) {
          console.error(`❌ [SmartToken] Erro no refresh (tentativa ${attempt}):`, error);
          
          // Se é erro de token inválido/expirado, não vale a pena tentar novamente
          if (error.message?.includes('invalid') || error.message?.includes('expired')) {
            console.error('❌ [SmartToken] Token inválido/expirado - parando tentativas');
            return false;
          }
          
          // Para outros erros, tentar novamente após delay
          if (attempt < maxRetries) {
            const delay = attempt * 1000; // 1s, 2s, 3s
            console.log(`⏳ [SmartToken] Aguardando ${delay}ms antes da próxima tentativa...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          
          return false;
        }

        if (!session) {
          console.error('❌ [SmartToken] Refresh retornou sessão nula');
          return false;
        }

        // Validar se o novo token é realmente válido
        const now = Math.floor(Date.now() / 1000);
        const newTokenExp = session.expires_at || 0;
        const newTimeUntilExpiry = newTokenExp - now;

        if (newTimeUntilExpiry <= 300) { // Menos de 5 minutos
          console.error('❌ [SmartToken] Novo token já está expirando');
          return false;
        }

        console.log(`✅ [SmartToken] Refresh bem-sucedido! Novo token expira em ${Math.round(newTimeUntilExpiry / 60)} minutos`);
        return true;

      } catch (error) {
        console.error(`❌ [SmartToken] Erro inesperado na tentativa ${attempt}:`, error);
        
        if (attempt < maxRetries) {
          const delay = attempt * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        return false;
      }
    }

    return false;
  }

  /**
   * Executa logout limpo com limpeza completa
   */
  async performCleanLogout(reason?: string): Promise<void> {
    try {
      console.log(`🚪 [SmartToken] Executando logout limpo: ${reason || 'não especificado'}`);

      // Logout do Supabase
      await supabase.auth.signOut();

      // Limpeza completa do storage
      localStorage.clear();
      sessionStorage.clear();

      console.log('✅ [SmartToken] Logout limpo concluído');

    } catch (error) {
      console.error('❌ [SmartToken] Erro durante logout limpo:', error);
      
      // Forçar limpeza mesmo com erro
      localStorage.clear();
      sessionStorage.clear();
    }
  }

  /**
   * Verifica se está em processo de refresh
   */
  isCurrentlyRefreshing(): boolean {
    return this.isRefreshing;
  }

  /**
   * Força um refresh imediato (para uso manual)
   */
  async forceRefresh(): Promise<boolean> {
    console.log('🔄 [SmartToken] Refresh forçado solicitado');
    return await this.performSmartRefresh();
  }
}

export const smartTokenManager = new SmartTokenManager();

