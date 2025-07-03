import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import useSKUs from '@/hooks/useSKUs';
import { useProducts } from '@/hooks/useProducts';
import { MasterProduct, Product } from '@/hooks/useProducts/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Package, Settings, Eye, EyeOff } from 'lucide-react';
import SKUManager from './SKUManager';

const MasterProductManager: React.FC = () => {
  const { toast } = useToast();
  const { createMasterProduct, fetchSKUsForMaster } = useSKUs();
  const { products, fetchProducts } = useProducts();
  
  const [masterProducts, setMasterProducts] = useState<MasterProduct[]>([]);
  const [selectedMaster, setSelectedMaster] = useState<MasterProduct | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('list');

  // Form state para criação de produto mestre
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    category_id: '',
    is_active: true,
    is_featured: false,
    available_variants: {
      platforms: [] as string[]
    }
  });

  // Carregar produtos mestre quando o componente montar
  useEffect(() => {
    loadMasterProducts();
  }, []);

  const loadMasterProducts = async () => {
    try {
      await fetchProducts();
      // Filtrar apenas produtos mestre
      const masters = products.filter(p => p.product_type === 'master') as MasterProduct[];
      setMasterProducts(masters);
    } catch (error) {
      console.error('Erro ao carregar produtos mestre:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image: '',
      category_id: '',
      is_active: true,
      is_featured: false,
      available_variants: {
        platforms: []
      }
    });
  };

  const handleCreateMaster = async () => {
    try {
      const masterData: Partial<MasterProduct> = {
        name: formData.name,
        description: formData.description,
        image: formData.image,
        category_id: formData.category_id || undefined,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
        available_variants: formData.available_variants,
        price: 0, // Preço será definido pelos SKUs
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const newMasterId = await createMasterProduct(masterData);
      if (newMasterId) {
        await loadMasterProducts();
        setShowCreateDialog(false);
        resetForm();
        
        // Selecionar o produto criado para adicionar SKUs
        const newMaster = masterProducts.find(m => m.id === newMasterId);
        if (newMaster) {
          setSelectedMaster(newMaster);
          setActiveTab('skus');
        }
      }
    } catch (error) {
      console.error('Erro ao criar produto mestre:', error);
    }
  };

  const handleSelectMaster = (master: MasterProduct) => {
    setSelectedMaster(master);
    setActiveTab('skus');
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="list">Produtos Mestre</TabsTrigger>
            <TabsTrigger value="skus" disabled={!selectedMaster}>
              SKUs {selectedMaster && `- ${selectedMaster.name}`}
            </TabsTrigger>
          </TabsList>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Produto Mestre
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Criar Produto Mestre</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Produto *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: Forza Horizon 5"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Descrição do produto que será compartilhada entre todas as plataformas"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="image">URL da Imagem Principal</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={formData.category_id} onValueChange={(value) => setFormData({...formData, category_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jogos">Jogos</SelectItem>
                      <SelectItem value="consoles">Consoles</SelectItem>
                      <SelectItem value="acessorios">Acessórios</SelectItem>
                      <SelectItem value="retro">Retro Gaming</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                      className="rounded"
                    />
                    <Label htmlFor="is_active">Produto Ativo</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                      className="rounded"
                    />
                    <Label htmlFor="is_featured">Produto em Destaque</Label>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateMaster} disabled={!formData.name}>
                    Criar Produto Mestre
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="list" className="space-y-4">
          <div className="grid gap-4">
            {masterProducts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Nenhum produto mestre criado ainda</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Produtos mestre permitem criar múltiplas variações (SKUs) para diferentes plataformas
                  </p>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Produto Mestre
                  </Button>
                </CardContent>
              </Card>
            ) : (
              masterProducts.map((master) => (
                <Card key={master.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {master.image && (
                          <img
                            src={master.image}
                            alt={master.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{master.name}</h3>
                            {master.is_active ? (
                              <Badge className="bg-green-500">
                                <Eye className="w-3 h-3 mr-1" />
                                Ativo
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <EyeOff className="w-3 h-3 mr-1" />
                                Inativo
                              </Badge>
                            )}
                            {master.is_featured && (
                              <Badge className="bg-yellow-500">
                                Destaque
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-2">
                            {master.description?.substring(0, 100)}
                            {master.description && master.description.length > 100 && '...'}
                          </p>
                          
                          <div className="text-xs text-gray-500">
                            ID: {master.id}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleSelectMaster(master)}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Gerenciar SKUs
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="skus">
          <SKUManager 
            masterProduct={selectedMaster || undefined}
            onClose={() => {
              setSelectedMaster(null);
              setActiveTab('list');
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MasterProductManager;

