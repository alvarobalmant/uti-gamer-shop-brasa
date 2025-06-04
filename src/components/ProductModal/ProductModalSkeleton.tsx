
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ProductModalSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-6 h-full overflow-y-auto">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4 rounded" />
        <Skeleton className="h-6 w-1/4 rounded" />
        <Skeleton className="h-10 w-1/2 rounded" />
        <Skeleton className="h-12 w-full rounded" />
        <Skeleton className="h-10 w-full rounded" />
      </div>
    </div>
  );
};

export default ProductModalSkeleton;
