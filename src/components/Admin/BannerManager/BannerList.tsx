
import React from 'react';
import { Banner } from '@/hooks/useBanners';
import { BannerCard } from './BannerCard';

interface BannerListProps {
  banners: Banner[];
  loading: boolean;
  onEdit: (banner: Banner) => void;
  onDelete: (id: string) => void;
}

export const BannerList: React.FC<BannerListProps> = ({
  banners,
  loading,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="col-span-full text-center py-8 text-gray-500">
        Carregando banners...
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="col-span-full text-center py-8 text-gray-500">
        Nenhum banner criado ainda.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {banners.map((banner) => (
        <BannerCard
          key={banner.id}
          banner={banner}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
