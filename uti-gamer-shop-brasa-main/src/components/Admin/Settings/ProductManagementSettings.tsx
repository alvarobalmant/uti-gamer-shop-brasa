import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Product } from '@/hooks/useProducts/types';

interface ProductManagementSettingsProps {
  products: Product[];
  selectedProducts: string[];
  setSelectedProducts: (products: string[]) => void;
  isDeleting: boolean;
  handleDeleteAllProducts: () => void;
  handleDeleteSelectedProducts: () => void;
  handleProductSelection: (productId: string, checked: boolean) => void;
  selectAllProducts: () => void;
  deselectAllProducts: () => void;
}

export const ProductManagementSettings: React.FC<ProductManagementSettingsProps> = ({
  products,
  selectedProducts,
  setSelectedProducts,
  isDeleting,
  handleDeleteAllProducts,
  handleDeleteSelectedProducts,
  handleProductSelection,
  selectAllProducts,
  deselectAllProducts
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trash2 className="w-5 h-5" />
          Gerenciamento de Produtos
        </CardTitle>
        <CardDescription>
          Deletar produtos em massa ou individualmente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Deletar todos os produtos */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-destructive">Zona de Perigo</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  disabled={isDeleting || products.length === 0}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Deletar Todos os Produtos ({products.length})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Deletar todos os produtos?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Todos os {products.length} produtos serão permanentemente removidos do banco de dados.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAllProducts} className="bg-destructive hover:bg-destructive/90">
                    {isDeleting ? 'Deletando...' : 'Deletar Todos'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <Separator />

        {/* Seleção de produtos para deletar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Deletar Produtos Selecionados</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAllProducts}>
                Selecionar Todos
              </Button>
              <Button variant="outline" size="sm" onClick={deselectAllProducts}>
                Limpar Seleção
              </Button>
            </div>
          </div>

          {selectedProducts.length > 0 && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {selectedProducts.length} produto(s) selecionado(s)
              </span>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" disabled={isDeleting}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Deletar Selecionados
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Deletar produtos selecionados?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. {selectedProducts.length} produto(s) serão permanentemente removidos.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteSelectedProducts} className="bg-destructive hover:bg-destructive/90">
                      {isDeleting ? 'Deletando...' : 'Deletar Selecionados'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}

          {/* Lista de produtos */}
          <div className="max-h-64 overflow-y-auto space-y-2 border rounded-lg p-4">
            {products.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Nenhum produto encontrado</p>
            ) : (
              products.map((product) => (
                <div key={product.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`product-${product.id}`}
                    checked={selectedProducts.includes(product.id)}
                    onChange={(e) => handleProductSelection(product.id, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label
                    htmlFor={`product-${product.id}`}
                    className="flex-1 text-sm cursor-pointer hover:text-primary"
                  >
                    {product.name} - R$ {product.price}
                  </label>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};