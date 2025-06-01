import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useTopDeals, TopDealSection, TopDealSectionInput } from "@/hooks/useTopDeals";
import { useProducts, Product } from "@/hooks/useProducts";
import { PlusCircle, Trash2, Save, X, Image, DollarSign, Tag } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TopDealsManager = () => {
  const { sections, loading, createSection, updateSection, deleteSection } = useTopDeals();
  const { products, loading: productsLoading } = useProducts();
  const { toast } = useToast();
  const [selectedSection, setSelectedSection] = useState<TopDealSection | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Array<{product_id: string; deal_label: string}>>([]);
  
  // Form state
  const [formData, setFormData] = useState<TopDealSectionInput>({
    title: "",
    subtitle: "",
    view_all_link: "/categoria/ofertas",
    banner_title: "",
    banner_subtitle: "",
    banner_image_url: "",
    banner_button_text: "Shop Now",
    banner_button_link: "",
    is_pro_exclusive: false,
    items: []
  });

  // Deal label options
  const dealLabelOptions = [
    { value: "RIG DEAL", color: "bg-red-600" },
    { value: "PRE-OWNED BUNDLE DEAL", color: "bg-green-600" },
    { value: "EMPLOYEE FAVORITES", color: "bg-blue-600" },
    { value: "SPECIAL OFFER", color: "bg-orange-600" },
    { value: "LIMITED TIME", color: "bg-purple-600" }
  ];

  // Reset form to create new section
  const handleCreateNew = () => {
    setFormData({
      title: "Top Deals",
      subtitle: "Save Big On Stuff You Love",
      view_all_link: "/categoria/ofertas",
      banner_title: "Save $20",
      banner_subtitle: "on select Nintendo Switch games.",
      banner_image_url: "",
      banner_button_text: "Shop Now",
      banner_button_link: "/categoria/nintendo",
      is_pro_exclusive: false,
      items: []
    });
    setSelectedProducts([]);
    setIsCreating(true);
    setSelectedSection(null);
    setFormOpen(true);
  };

  // Load section data for editing
  const handleEditSection = (section: TopDealSection) => {
    setFormData({
      id: section.id,
      title: section.title,
      subtitle: section.subtitle || "",
      view_all_link: section.view_all_link || "/categoria/ofertas",
      banner_title: section.banner_title || "",
      banner_subtitle: section.banner_subtitle || "",
      banner_image_url: section.banner_image_url || "",
      banner_button_text: section.banner_button_text || "Shop Now",
      banner_button_link: section.banner_button_link || "",
      is_pro_exclusive: section.is_pro_exclusive || false,
      items: []
    });
    
    // Map section items to selected products
    const mappedItems = section.items?.map(item => ({
      product_id: item.product_id,
      deal_label: item.deal_label
    })) || [];
    
    setSelectedProducts(mappedItems);
    setIsCreating(false);
    setSelectedSection(section);
    setFormOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle switch toggle
  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_pro_exclusive: checked }));
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add product to selection
  const handleAddProduct = (product: Product, dealLabel: string) => {
    if (selectedProducts.some(p => p.product_id === product.id)) {
      toast({
        title: "Produto já adicionado",
        description: "Este produto já está na lista de ofertas.",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedProducts(prev => [...prev, { 
      product_id: product.id,
      deal_label: dealLabel
    }]);
  };

  // Remove product from selection
  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.product_id !== productId));
  };

  // Update deal label for a product
  const handleUpdateDealLabel = (productId: string, newLabel: string) => {
    setSelectedProducts(prev => prev.map(p => 
      p.product_id === productId ? { ...p, deal_label: newLabel } : p
    ));
  };

  // Save section (create or update)
  const handleSaveSection = async () => {
    // Validate form
    if (!formData.title) {
      toast({
        title: "Erro de validação",
        description: "O título da seção é obrigatório.",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedProducts.length === 0) {
      toast({
        title: "Erro de validação",
        description: "Adicione pelo menos um produto à seção.",
        variant: "destructive"
      });
      return;
    }
    
    // Prepare data for saving
    const sectionToSave: TopDealSectionInput = {
      ...formData,
      items: selectedProducts
    };
    
    try {
      if (isCreating) {
        await createSection(sectionToSave);
        toast({
          title: "Sucesso",
          description: "Seção de ofertas especiais criada com sucesso."
        });
      } else {
        await updateSection(sectionToSave);
        toast({
          title: "Sucesso",
          description: "Seção de ofertas especiais atualizada com sucesso."
        });
      }
      setFormOpen(false);
    } catch (error) {
      console.error("Error saving section:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a seção.",
        variant: "destructive"
      });
    }
  };

  // Delete section
  const handleDeleteSection = async () => {
    if (!selectedSection?.id) return;
    
    try {
      await deleteSection(selectedSection.id);
      toast({
        title: "Sucesso",
        description: "Seção de ofertas especiais removida com sucesso."
      });
      setFormOpen(false);
    } catch (error) {
      console.error("Error deleting section:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao remover a seção.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gerenciar Seções de Ofertas Especiais</h2>
          <p className="text-muted-foreground">
            Crie e gerencie seções de ofertas especiais para a página inicial.
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Seção
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <p>Carregando seções...</p>
        </div>
      ) : sections.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <h3 className="text-lg font-medium mb-2">Nenhuma seção encontrada</h3>
              <p className="text-muted-foreground mb-4">
                Crie sua primeira seção de ofertas especiais para a página inicial.
              </p>
              <Button onClick={handleCreateNew}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Criar Seção
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((section) => (
            <Card key={section.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle>{section.title}</CardTitle>
                <CardDescription>{section.subtitle || "Seção de ofertas especiais"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{section.items?.length || 0} produtos</span>
                  </div>
                  {section.banner_title && (
                    <div className="flex items-center text-sm">
                      <Image className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Banner: {section.banner_title}</span>
                    </div>
                  )}
                  {section.is_pro_exclusive && (
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                      Pro Exclusive
                    </Badge>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => handleEditSection(section)}
                >
                  Editar Seção
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {isCreating ? "Criar Nova Seção de Ofertas" : "Editar Seção de Ofertas"}
            </DialogTitle>
            <DialogDescription>
              Configure a seção e adicione produtos com etiquetas de oferta.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="details" className="h-full flex flex-col">
              <TabsList className="mx-auto">
                <TabsTrigger value="details">Detalhes da Seção</TabsTrigger>
                <TabsTrigger value="banner">Banner Promocional</TabsTrigger>
                <TabsTrigger value="products">Produtos ({selectedProducts.length})</TabsTrigger>
              </TabsList>
              
              <div className="flex-1 overflow-auto mt-4">
                <TabsContent value="details" className="h-full">
                  <div className="space-y-4 px-1">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Título da Seção</Label>
                        <Input
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="Ex: Top Deals"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="subtitle">Subtítulo</Label>
                        <Input
                          id="subtitle"
                          name="subtitle"
                          value={formData.subtitle || ""}
                          onChange={handleInputChange}
                          placeholder="Ex: Save Big On Stuff You Love"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="view_all_link">Link do Botão "Ver Todos"</Label>
                        <Input
                          id="view_all_link"
                          name="view_all_link"
                          value={formData.view_all_link || ""}
                          onChange={handleInputChange}
                          placeholder="Ex: /categoria/ofertas"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_pro_exclusive"
                          checked={formData.is_pro_exclusive || false}
                          onCheckedChange={handleSwitchChange}
                        />
                        <Label htmlFor="is_pro_exclusive">Banner Exclusivo para Membros Pro</Label>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="banner" className="h-full">
                  <div className="space-y-4 px-1">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="banner_title">Título do Banner</Label>
                        <Input
                          id="banner_title"
                          name="banner_title"
                          value={formData.banner_title || ""}
                          onChange={handleInputChange}
                          placeholder="Ex: Save $20"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="banner_subtitle">Subtítulo do Banner</Label>
                        <Textarea
                          id="banner_subtitle"
                          name="banner_subtitle"
                          value={formData.banner_subtitle || ""}
                          onChange={handleInputChange}
                          placeholder="Ex: on select Nintendo Switch games."
                          rows={2}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="banner_image_url">URL da Imagem do Banner</Label>
                        <Input
                          id="banner_image_url"
                          name="banner_image_url"
                          value={formData.banner_image_url || ""}
                          onChange={handleInputChange}
                          placeholder="Ex: https://example.com/banner.jpg"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="banner_button_text">Texto do Botão</Label>
                        <Input
                          id="banner_button_text"
                          name="banner_button_text"
                          value={formData.banner_button_text || ""}
                          onChange={handleInputChange}
                          placeholder="Ex: Shop Now"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="banner_button_link">Link do Botão</Label>
                        <Input
                          id="banner_button_link"
                          name="banner_button_link"
                          value={formData.banner_button_link || ""}
                          onChange={handleInputChange}
                          placeholder="Ex: /categoria/nintendo"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="products" className="h-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                    {/* Product Search */}
                    <div className="border rounded-md p-4 h-full flex flex-col">
                      <h3 className="font-medium mb-2">Adicionar Produtos</h3>
                      <div className="mb-4">
                        <Input
                          placeholder="Buscar produtos por nome ou SKU..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="mb-2"
                        />
                      </div>
                      
                      <ScrollArea className="flex-1 h-[300px]">
                        {productsLoading ? (
                          <p className="text-center py-4">Carregando produtos...</p>
                        ) : filteredProducts.length === 0 ? (
                          <p className="text-center py-4">Nenhum produto encontrado</p>
                        ) : (
                          <div className="space-y-2">
                            {filteredProducts.map((product) => (
                              <div key={product.id} className="flex items-center p-2 border rounded-md">
                                <div className="w-10 h-10 mr-3 flex-shrink-0">
                                  <img
                                    src={product.image_url || "/placeholder.svg"}
                                    alt={product.name}
                                    className="w-full h-full object-cover rounded-sm"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{product.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    R${product.price.toFixed(2)}
                                  </p>
                                </div>
                                <div className="ml-2">
                                  <Select onValueChange={(value) => handleAddProduct(product, value)}>
                                    <SelectTrigger className="w-[130px]">
                                      <SelectValue placeholder="Adicionar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {dealLabelOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                          <span className="flex items-center">
                                            <span className={`w-2 h-2 rounded-full ${option.color} mr-2`}></span>
                                            {option.value}
                                          </span>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                    </div>
                    
                    {/* Selected Products */}
                    <div className="border rounded-md p-4 h-full flex flex-col">
                      <h3 className="font-medium mb-2">Produtos Selecionados</h3>
                      
                      <ScrollArea className="flex-1 h-[300px]">
                        {selectedProducts.length === 0 ? (
                          <p className="text-center py-4">Nenhum produto selecionado</p>
                        ) : (
                          <div className="space-y-2">
                            {selectedProducts.map((item) => {
                              const product = products.find(p => p.id === item.product_id);
                              if (!product) return null;
                              
                              const dealLabelOption = dealLabelOptions.find(
                                option => option.value === item.deal_label
                              ) || dealLabelOptions[0];
                              
                              return (
                                <div key={item.product_id} className="flex items-center p-2 border rounded-md">
                                  <div className="w-10 h-10 mr-3 flex-shrink-0">
                                    <img
                                      src={product.image_url || "/placeholder.svg"}
                                      alt={product.name}
                                      className="w-full h-full object-cover rounded-sm"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{product.name}</p>
                                    <div className="flex items-center mt-1">
                                      <span className={`inline-block w-2 h-2 rounded-full ${dealLabelOption.color} mr-1`}></span>
                                      <Select 
                                        value={item.deal_label} 
                                        onValueChange={(value) => handleUpdateDealLabel(item.product_id, value)}
                                      >
                                        <SelectTrigger className="h-6 text-xs border-none p-0 pl-1 w-[120px]">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {dealLabelOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                              <span className="flex items-center">
                                                <span className={`w-2 h-2 rounded-full ${option.color} mr-2`}></span>
                                                {option.value}
                                              </span>
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveProduct(item.product_id)}
                                    className="h-8 w-8"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </ScrollArea>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
          
          <DialogFooter className="flex justify-between items-center">
            <div>
              {!isCreating && (
                <Button variant="destructive" onClick={handleDeleteSection}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir Seção
                </Button>
              )}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setFormOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveSection}>
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TopDealsManager;
