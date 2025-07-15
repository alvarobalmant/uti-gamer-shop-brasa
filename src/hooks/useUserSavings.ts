
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface UserSavings {
  total_savings: number;
  promotion_savings: number;
  uti_pro_savings: number;
  total_purchases: number;
}

export const useUserSavings = () => {
  const { user } = useAuth();
  const [savings, setSavings] = useState<UserSavings>({
    total_savings: 0,
    promotion_savings: 0,
    uti_pro_savings: 0,
    total_purchases: 0
  });
  const [loading, setLoading] = useState(false);

  const loadUserSavings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('get_user_total_savings', { p_user_id: user.id });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setSavings(data[0]);
      }
    } catch (error) {
      console.error('Error loading user savings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserSavings();
  }, [user]);

  return {
    savings,
    loading,
    loadUserSavings
  };
};
