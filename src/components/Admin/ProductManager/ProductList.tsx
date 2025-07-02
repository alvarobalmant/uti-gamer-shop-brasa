
import React from 'react';
import { Product } from '@/hooks/useProducts';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit, Trash2, Settings, Eye } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onConfigure?: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ 
  products, 
  loading, 
  onEdit, 
  onDelete,
  onConfigure 
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="bg-[#343A40] border-[#6C757D]">
            <CardContent className="p-4">
              <Skeleton className="h-32 w-full mb-4 bg-[#6C757D]" />
              <Skeleton className="h-4 w-3/4 mb-2 bg-[#6C757D]" />
              <Skeleton className="h-4 w-1/2 mb-4 bg-[#6C757D]" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-16 bg-[#6C757D]" />
                <Skeleton className="h-8 w-16 bg-[#6C757D]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-4">Nenhum produto encontrado</div>
        <p className="text-gray-500">Tente ajustar os filtros ou adicionar um novo produto.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <Card key={product.id} className="bg-[#343A40] border-[#6C757D] hover:border-[#007BFF] transition-colors">
          <CardContent className="p-4">
            {/* Imagem do produto */}
            <div className="aspect-square bg-[#2C2C44] rounded-lg overflow-hidden mb-3">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <Eye className="w-8 h-8" />
                </div>
              )}
            </div>

            {/* Informações do produto */}
            <div className="space-y-2">
              <h3 className="font-semibold text-white text-sm line-clamp-2">
                {product.name}
              </h3>
              
              <div className="flex items-center justify-between">
                <span className="text-[#28A745] font-bold">
                  R$ {product.price.toFixed(2)}
                </span>
                <div className="flex gap-1">
                  {product.is_featured && (
                    <Badge className="bg-[#FFC107] text-black text-xs">
                      Destaque
                    </Badge>
                  )}
                  {!product.is_active && (
                    <Badge variant="destructive" className="text-xs">
                      Inativo
                    </Badge>
                  )}
                </div>
              </div>

              {product.stock !== undefined && (
                <p className="text-gray-400 text-xs">
                  Estoque: {product.stock} unidades
                </p>
              )}

              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {product.tags.slice(0, 2).map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="text-xs bg-[#007BFF] bg-opacity-20 text-[#007BFF] border-[#007BFF]"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                  {product.tags.length > 2 && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-gray-600 text-gray-300"
                    >
                      +{product.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Ações */}
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(product)}
                className="flex-1 border-[#6C757D] text-white hover:bg-[#007BFF] hover:border-[#007BFF]"
              >
                <Edit className="w-3 h-3 mr-1" />
                Editar
              </Button>
              
              {onConfigure && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onConfigure(product)}
                  className="border-[#6C757D] text-white hover:bg-[#28A745] hover:border-[#28A745]"
                  title="Configurar página do produto"
                >
                  <Settings className="w-3 h-3" />
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(product.id)}
                className="border-[#6C757D] text-white hover:bg-red-600 hover:border-red-600"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductList;
