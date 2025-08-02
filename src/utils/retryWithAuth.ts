import { supabase } from '@/integrations/supabase/client';

export interface RetryConfig {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  context?: string;
}

export interface RetryResult<T> {
  success: boolean;
  data?: T;
  error?: any;
  retriesUsed: number;
}

const DEFAULT_CONFIG: Required<RetryConfig> = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 5000,
  context: 'unknown'
};

// Detect JWT expiration errors
const isJWTExpiredError = (error: any): boolean => {
  if (!error) return false;
  
  const message = error.message?.toLowerCase() || '';
  const code = error.code?.toLowerCase() || '';
  
  return (
    message.includes('jwt') && message.includes('expired') ||
    message.includes('token') && message.includes('expired') ||
    message.includes('unauthorized') ||
    code === 'pgrst301' || // PostgREST JWT expired
    code === '401'
  );
};

// Wait for token refresh with timeout
const waitForTokenRefresh = async (timeoutMs: number = 10000): Promise<boolean> => {
  console.log('🔄 [RetryAuth] Waiting for token refresh...');
  
  const startTime = Date.now();
  
  return new Promise((resolve) => {
    const checkToken = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (session?.access_token && !error) {
          console.log('✅ [RetryAuth] Token refreshed successfully');
          resolve(true);
          return;
        }
        
        // Check timeout
        if (Date.now() - startTime > timeoutMs) {
          console.warn('⏰ [RetryAuth] Token refresh timeout');
          resolve(false);
          return;
        }
        
        // Wait and check again
        setTimeout(checkToken, 500);
      } catch (err) {
        console.error('❌ [RetryAuth] Error checking token:', err);
        resolve(false);
      }
    };
    
    checkToken();
  });
};

export async function retryWithAuth<T>(
  operation: () => Promise<T>,
  config: RetryConfig = {}
): Promise<RetryResult<T>> {
  const { maxRetries, baseDelay, maxDelay, context } = { ...DEFAULT_CONFIG, ...config };
  
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 [RetryAuth:${context}] Attempt ${attempt + 1}/${maxRetries + 1}`);
      
      const result = await operation();
      
      if (attempt > 0) {
        console.log(`✅ [RetryAuth:${context}] Success after ${attempt} retries`);
      }
      
      return {
        success: true,
        data: result,
        retriesUsed: attempt
      };
      
    } catch (error) {
      lastError = error;
      console.error(`❌ [RetryAuth:${context}] Attempt ${attempt + 1} failed:`, error);
      
      // If it's not a JWT error or we're on the last attempt, don't retry
      if (!isJWTExpiredError(error) || attempt === maxRetries) {
        break;
      }
      
      console.log(`🔄 [RetryAuth:${context}] JWT expired, attempting token refresh...`);
      
      // Wait for token refresh
      const refreshSuccess = await waitForTokenRefresh();
      
      if (!refreshSuccess) {
        console.error(`❌ [RetryAuth:${context}] Token refresh failed, aborting retries`);
        break;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      console.log(`⏳ [RetryAuth:${context}] Waiting ${delay}ms before retry...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  console.error(`💥 [RetryAuth:${context}] All retries exhausted`);
  
  return {
    success: false,
    error: lastError,
    retriesUsed: maxRetries
  };
}

// Specialized retry for Supabase queries
export async function retrySupabaseQuery<T = any>(
  operation: () => Promise<{ data: T | null; error: any }>,
  context: string = 'supabase-query'
): Promise<{ data: T | null; error: any }> {
  const result = await retryWithAuth(operation, { context });
  
  if (result.success && result.data) {
    return result.data as { data: T | null; error: any };
  }
  
  return {
    data: null,
    error: result.error || new Error('Retry failed')
  };
}