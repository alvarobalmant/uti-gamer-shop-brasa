import { useState } from 'react';
import { useProducts, Product } from '@/hooks/useProducts';
import { useTags } from '@/hooks/useTags';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Edit, Plus, LogOut, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TagManager } from './TagManager';
import { BannerManager } from './BannerManager';
import { ServiceCardManager } from './ServiceCardManager';

export const AdminPanel = () => {
  const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts();
  const { tags } = useTags();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('products');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    additional_images: '',
    sizes: '',
    colors: '',
    stock: '',
    tagIds: [] as string[],
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      additional_images: '',
      sizes: '',
      colors: '',
      stock: '',
      tagIds: [],
    });
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      image: product.image,
      additional_images: product.additional_images?.join(', ') || '',
      sizes: product.sizes?.join(', ') || '',
      colors: product.colors?.join(', ') || '',
      stock: product.stock?.toString() || '0',
      tagIds: product.tags?.map(tag => tag.id) || [],
    });
    setIsDialogOpen(true);
  };

  const handleTagChange = (tagId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        tagIds: [...prev.tagIds, tagId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        tagIds: prev.tagIds.filter(id => id !== tagId)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.tagIds.length === 0) {
      alert('Selecione pelo menos uma tag para o produto.');
      return;
    }

    const productData = {
      name: formData.name,
      description: formData.description || undefined,
      price: parseFloat(formData.price),
      image: formData.image,
      additional_images: formData.additional_images ? 
        formData.additional_images.split(',').map(s => s.trim()).filter(s => s) : [],
      sizes: formData.sizes ? 
        formData.sizes.split(',').map(s => s.trim()).filter(s => s) : [],
      colors: formData.colors ? 
        formData.colors.split(',').map(c => c.trim()).filter(c => c) : [],
      stock: parseInt(formData.stock) || 0,
      tagIds: formData.tagIds,
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await addProduct(productData);
      }
      
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      // Error handled in useProducts
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      await deleteProduct(id);
    }
  };

  const tabs = [
    { id: 'products', label: 'Produtos' },
    { id: 'banners', label: 'Banners' },
    { id: 'services', label: 'Cards de Serviços' },
    { id: 'tags', label: 'Tags' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Administrativo */}
      <header className="bg-white shadow-lg border-b-4 border-red-600">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                size="sm"
                className="border-red-300 text-red-600 hover:bg-red-600 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar à Loja
              </Button>
              
              <div className="flex items-center space-x-3">
                <img 
                  src="/lovable-uploads/a514a032-d79a-4bc4-a10e-3c9f0f9cde73.png" 
                  alt="UTI DOS GAMES" 
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-red-600">
                    Painel Administrativo
                  </h1>
                  <p className="text-xs lg:text-sm text-gray-600">Bem-vindo, {user?.email}</p>
                </div>
              </div>
            </div>
            
            <Button
              onClick={signOut}
              variant="outline"
              size="sm"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border-2 border-red-200">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg lg:text-xl">{products.length}</span>
                </div>
                <div>
                  <h3 className="text-sm lg:text-lg font-bold text-gray-800">Total de Produtos</h3>
                  <p className="text-xs lg:text-sm text-gray-600">Produtos cadastrados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-2 border-red-200">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center space-x-3">
                <img 
                  src="/lovable-uploads/1415b5a0-5865-4967-bb92-9f2c3915e2c0.png" 
                  alt="Mascote Trabalhando" 
                  className="w-10 h-10 lg:w-12 lg:h-12 object-contain"
                />
                <div>
                  <h3 className="text-sm lg:text-lg font-bold text-gray-800">Status</h3>
                  <p className="text-xs lg:text-sm text-green-600 font-medium">Sistema Online</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-2 border-red-200">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center space-x-3">
                <img 
                  src="/lovable-uploads/fc4c04c0-1f46-4893-9dad-eb37ceaa1c62.png" 
                  alt="Mascote Técnico" 
                  className="w-10 h-10 lg:w-12 lg:h-12 object-contain"
                />
                <div>
                  <h3 className="text-sm lg:text-lg font-bold text-gray-800">Gerenciamento</h3>
                  <p className="text-xs lg:text-sm text-gray-600">Sistema Completo</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg border-2 border-red-200 mb-8">
          <div className="flex flex-wrap gap-2 p-4 border-b border-gray-200">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant={activeTab === tab.id ? "default" : "outline"}
                className={activeTab === tab.id ? 
                  "bg-red-600 hover:bg-red-700 text-white" : 
                  "border-red-300 text-red-600 hover:bg-red-50"
                }
              >
                {tab.label}
              </Button>
            ))}
          </div>

          <div className="p-6">
            {/* Tab Content */}
            {activeTab === 'banners' && <BannerManager />}
            {activeTab === 'services' && <ServiceCardManager />}
            {activeTab === 'tags' && <TagManager />}
            
            {activeTab === 'products' && (
              <>
                {/* Botão de Adicionar Produto */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-red-600">Gerenciar Produtos</h3>
                  
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => {
                          resetForm();
                          setIsDialogOpen(true);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-all duration-300"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Adicionar Produto
                      </Button>
                    </DialogTrigger>
                    
                    <DialogContent className="bg-white border-2 border-red-200 text-gray-800 max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl lg:text-2xl font-bold text-red-600">
                          {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                        </DialogTitle>
                      </DialogHeader>
                      
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="font-medium text-gray-700">
                              Nome do Produto *
                            </Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                              className="border-2 border-gray-200 focus:border-red-500 rounded-lg"
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="price" className="font-medium text-gray-700">
                              Preço (R$) *
                            </Label>
                            <Input
                              id="price"
                              type="number"
                              step="0.01"
                              value={formData.price}
                              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                              className="border-2 border-gray-200 focus:border-red-500 rounded-lg"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="image" className="font-medium text-gray-700">
                            Imagem de Capa *
                          </Label>
                          <Input
                            id="image"
                            value={formData.image}
                            onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                            className="border-2 border-gray-200 focus:border-red-500 rounded-lg"
                            placeholder="https://..."
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="font-medium text-gray-700">Tags *</Label>
                          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-3 border-2 border-gray-200 rounded-lg">
                            {tags.map((tag) => (
                              <div key={tag.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`tag-${tag.id}`}
                                  checked={formData.tagIds.includes(tag.id)}
                                  onCheckedChange={(checked) => handleTagChange(tag.id, checked as boolean)}
                                />
                                <Label htmlFor={`tag-${tag.id}`} className="text-sm font-medium">
                                  {tag.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description" className="font-medium text-gray-700">
                            Descrição
                          </Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="border-2 border-gray-200 focus:border-red-500 rounded-lg"
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="additional_images" className="font-medium text-gray-700">
                            Fotos Adicionais
                          </Label>
                          <Textarea
                            id="additional_images"
                            value={formData.additional_images}
                            onChange={(e) => setFormData(prev => ({ ...prev, additional_images: e.target.value }))}
                            className="border-2 border-gray-200 focus:border-red-500 rounded-lg"
                            placeholder="URLs separadas por vírgula"
                            rows={2}
                          />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="sizes" className="font-medium text-gray-700">
                              Tamanhos
                            </Label>
                            <Input
                              id="sizes"
                              value={formData.sizes}
                              onChange={(e) => setFormData(prev => ({ ...prev, sizes: e.target.value }))}
                              className="border-2 border-gray-200 focus:border-red-500 rounded-lg"
                              placeholder="Físico, Digital"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="colors" className="font-medium text-gray-700">
                              Cores
                            </Label>
                            <Input
                              id="colors"
                              value={formData.colors}
                              onChange={(e) => setFormData(prev => ({ ...prev, colors: e.target.value }))}
                              className="border-2 border-gray-200 focus:border-red-500 rounded-lg"
                              placeholder="Preto, Branco"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="stock" className="font-medium text-gray-700">
                              Estoque
                            </Label>
                            <Input
                              id="stock"
                              type="number"
                              value={formData.stock}
                              onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                              className="border-2 border-gray-200 focus:border-red-500 rounded-lg"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                          <Button
                            type="submit"
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg"
                          >
                            {editingProduct ? 'Atualizar' : 'Adicionar'}
                          </Button>
                          
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100 font-bold py-3 rounded-lg"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Lista de Produtos */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {loading ? (
                    <div className="col-span-full text-center text-gray-400 py-12">
                      <img 
                        src="/lovable-uploads/8cf1f59f-91ee-4e94-b333-02445409df1a.png" 
                        alt="Carregando" 
                        className="w-16 h-16 mx-auto mb-4 opacity-50"
                      />
                      <p>Carregando produtos...</p>
                    </div>
                  ) : products.length === 0 ? (
                    <div className="col-span-full text-center text-gray-400 py-12">
                      <img 
                        src="/lovable-uploads/ad940e09-b6fc-44a8-98a5-3247986d6f98.png" 
                        alt="Nenhum produto" 
                        className="w-16 h-16 mx-auto mb-4 opacity-50"
                      />
                      <p>Nenhum produto cadastrado ainda.</p>
                    </div>
                  ) : (
                    products.map((product) => (
                      <Card key={product.id} className="bg-white border-2 border-gray-200 hover:border-red-300 transition-all duration-300 hover:shadow-lg">
                        <CardContent className="p-4">
                          <div className="relative mb-4">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-48 object-cover rounded-lg"
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop';
                              }}
                            />
                            <div className="absolute top-2 right-2 flex flex-wrap gap-1">
                              {product.tags?.slice(0, 2).map((tag) => (
                                <Badge key={tag.id} className="bg-red-600 text-white font-bold text-xs">
                                  {tag.name}
                                </Badge>
                              ))}
                              {(product.tags?.length || 0) > 2 && (
                                <Badge className="bg-gray-600 text-white font-bold text-xs">
                                  +{(product.tags?.length || 0) - 2}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
                          {product.description && (
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                          )}
                          
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-xl font-bold text-red-600">
                              R$ {product.price.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              Estoque: {product.stock || 0}
                            </span>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                              onClick={() => handleEdit(product)}
                              size="sm"
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Editar
                            </Button>
                            
                            <Button
                              onClick={() => handleDelete(product.id)}
                              size="sm"
                              variant="destructive"
                              className="flex-1 bg-red-600 hover:bg-red-700 font-medium"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Excluir
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
