
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const DataSeeder = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const { isAdmin } = useAuth();

  const seedInitialData = async () => {
    if (!isAdmin || isSeeding) return;
    
    setIsSeeding(true);
    
    try {
      // Check if quick links already exist
      const { data: existingQuickLinks } = await supabase
        .from('quick_links')
        .select('id')
        .limit(1);
      
      if (!existingQuickLinks || existingQuickLinks.length === 0) {
        console.log('Seeding quick links...');
        
        const quickLinksData = [
          {
            label: 'PlayStation',
            icon_url: '/lovable-uploads/136bb734-dc02-4a5a-a4b8-300ce6d655b1.png',
            path: '/categoria/playstation',
            position: 1,
            is_active: true
          },
          {
            label: 'Xbox',
            icon_url: '/lovable-uploads/8cf1f59f-91ee-4e94-b333-02445409df1a.png',
            path: '/categoria/xbox',
            position: 2,
            is_active: true
          },
          {
            label: 'Nintendo',
            icon_url: '/lovable-uploads/103e7d18-a70a-497f-a476-e6c513079b69.png',
            path: '/categoria/nintendo',
            position: 3,
            is_active: true
          },
          {
            label: 'PC Games',
            icon_url: '/lovable-uploads/1415b5a0-5865-4967-bb92-9f2c3915e2c0.png',
            path: '/categoria/pc',
            position: 4,
            is_active: true
          },
          {
            label: 'Acessórios',
            icon_url: '/lovable-uploads/a514a032-d79a-4bc4-a10e-3c9f0f9cde73.png',
            path: '/categoria/acessorios',
            position: 5,
            is_active: true
          },
          {
            label: 'Retro',
            icon_url: '/lovable-uploads/ab54f665-ca93-42fa-9bca-d93b35cc87f7.png',
            path: '/categoria/retro',
            position: 6,
            is_active: true
          }
        ];

        await supabase.from('quick_links').insert(quickLinksData);
        console.log('Quick links seeded successfully');
      }

      // Check if homepage layout exists
      const { data: existingLayout } = await supabase
        .from('homepage_layout')
        .select('id')
        .limit(1);
      
      if (!existingLayout || existingLayout.length === 0) {
        console.log('Seeding homepage layout...');
        
        const layoutData = [
          { section_key: 'hero_banner', display_order: 1, is_visible: true },
          { section_key: 'hero_quick_links', display_order: 2, is_visible: true },
          { section_key: 'promo_banner', display_order: 3, is_visible: true },
          { section_key: 'product_section_novidades', display_order: 4, is_visible: true },
          { section_key: 'product_section_mais_vendidos', display_order: 5, is_visible: true },
          { section_key: 'specialized_services', display_order: 6, is_visible: true },
          { section_key: 'why_choose_us', display_order: 7, is_visible: true },
          { section_key: 'contact_help', display_order: 8, is_visible: true }
        ];

        await supabase.from('homepage_layout').insert(layoutData);
        console.log('Homepage layout seeded successfully');
      }

    } catch (error) {
      console.error('Error seeding data:', error);
    } finally {
      setIsSeeding(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      // Small delay to ensure auth is fully loaded
      const timer = setTimeout(seedInitialData, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAdmin]);

  return null; // This component doesn't render anything
};

export default DataSeeder;
