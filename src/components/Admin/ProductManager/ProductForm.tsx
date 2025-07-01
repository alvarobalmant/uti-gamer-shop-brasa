import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageUpload } from '@/components/ui/image-upload';
import { ArrowLeft, Plus, Trash2, Package, DollarSign, Star, Settings, Truck, Search, Eye, Info } from 'lucide-react';
import { Product } from '@/hooks/useProducts';
import { Tag } from '@/hooks/useTags';
import { TagSelector } from './TagSelector';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProductFormProps {
  product?: Product | null;
  tags: Tag[];
  onSubmit: (productData: any) => Promise<void>;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  tags,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    // 1. INFORMAÇÕES BÁSICAS
    name: '',
    description: '',
    price: '',
    stock: '',
    image: '',
    additional_images: [] as string[],
    sizes: [] as string[],
    colors: [] as string[],
    tagIds: [] as string[],
    
    // 2. BADGE PERSONALIZADO
    badge_text: '',
    badge_color: '#22c55e',
    badge_visible: false,
    
    // 3. PREÇOS AVANÇADOS
    promotional_price: '',
    discount_percentage: '',
    pix_discount_percentage: '5',
    uti_pro_price: '',
    installment_options: '12',
    
    // 4. SISTEMA DE AVALIAÇÕES
    rating_average: '0',
    rating_count: '0',
    reviews_enabled: true,
    
    // 5. ESPECIFICAÇÕES TÉCNICAS (JSONB)
    technical_specs: {
      basic_info: {
        platform: '',
        genre: '',
        developer: '',
        publisher: '',
        release_date: ''
      },
      technical_requirements: {
        storage: '',
        players: '',
        online: '',
        controller: '',
        resolution: ''
      },
      additional_info: {
        age_rating: '',
        languages: '',
        subtitles: '',
        audio: '',
        region: ''
      }
    },
    
    // 6. CARACTERÍSTICAS DO PRODUTO (JSONB)
    product_features: [] as Array<{text: string, icon: string, order: number}>,
    
    // 7. INFORMAÇÕES DE ENTREGA
    shipping_weight: '',
    shipping_dimensions: {
      height: '',
      width: '',
      depth: ''
    },
    free_shipping: false,
    shipping_time_min: '1',
    shipping_time_max: '3',
    store_pickup_available: true,
    
    // 8. PRODUTOS RELACIONADOS
    related_products: [] as string[],
    related_products_auto: true,
    
    // 9. SEO E METADADOS
    meta_title: '',
    meta_description: '',
    slug: '',
    
    // 10. CONTROLES DE VISIBILIDADE
    is_active: true,
    is_featured: false,
    show_stock: true,
    show_rating: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newFeature, setNewFeature] = useState({ text: '', icon: 'check' });
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');

  useEffect(() => {
    if (product) {
      console.log('Carregando produto para edição:', product);
      setFormData({
        // Campos básicos
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        stock: product.stock?.toString() || '',
        image: product.image || '',
        additional_images: product.additional_images || [],
        sizes: product.sizes || [],
        colors: product.colors || [],
        tagIds: product.tagIds || [],
        
        // Badge
        badge_text: product.badge_text || '',
        badge_color: product.badge_color || '#22c55e',
        badge_visible: product.badge_visible || false,
        
        // Preços avançados
        promotional_price: product.promotional_price?.toString() || '',
        discount_percentage: product.discount_percentage?.toString() || '',
        pix_discount_percentage: product.pix_discount_percentage?.toString() || '5',
        uti_pro_price: product.uti_pro_price?.toString() || '',
        installment_options: product.installment_options?.toString() || '12',
        
        // Avaliações
        rating_average: product.rating_average?.toString() || '0',
        rating_count: product.rating_count?.toString() || '0',
        reviews_enabled: product.reviews_enabled ?? true,
        
        // Especificações técnicas
        technical_specs: product.technical_specs || {
          basic_info: {},
          technical_requirements: {},
          additional_info: {}
        },
        
        // Características do produto
        product_features: product.product_features || [],
        
        // Informações de entrega
        shipping_weight: product.shipping_weight?.toString() || '',
        shipping_dimensions: product.shipping_dimensions || { height: '', width: '', depth: '' },
        free_shipping: product.free_shipping || false,
        shipping_time_min: product.shipping_time_min?.toString() || '1',
        shipping_time_max: product.shipping_time_max?.toString() || '3',
        store_pickup_available: product.store_pickup_available ?? true,
        
        // Produtos relacionados
        related_products: product.related_products || [],
        related_products_auto: product.related_products_auto ?? true,
        
        // SEO
        meta_title: product.meta_title || '',
        meta_description: product.meta_description || '',
        slug: product.slug || '',
        
        // Controles
        is_active: product.is_active ?? true,
        is_featured: product.is_featured || false,
        show_stock: product.show_stock ?? true,
        show_rating: product.show_rating ?? true,
      });
    }
  }, [product]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleTechnicalSpecChange = (category: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      technical_specs: {
        ...prev.technical_specs,
        [category]: {
          ...prev.technical_specs[category as keyof typeof prev.technical_specs],
          [field]: value
        }
      }
    }));
  };

  const addFeature = () => {
    if (newFeature.text.trim()) {
      const feature = {
        text: newFeature.text,
        icon: newFeature.icon,
        order: formData.product_features.length + 1
      };
      setFormData(prev => ({
        ...prev,
        product_features: [...prev.product_features, feature]
      }));
      setNewFeature({ text: '', icon: 'check' });
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      product_features: prev.product_features.filter((_, i) => i !== index)
    }));
  };

  const addSize = () => {
    if (newSize.trim() && !formData.sizes.includes(newSize)) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, newSize]
      }));
      setNewSize('');
    }
  };

  const removeSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(s => s !== size)
    }));
  };

  const addColor = () => {
    if (newColor.trim() && !formData.colors.includes(newColor)) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, newColor]
      }));
      setNewColor('');
    }
  };

  const removeColor = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== color)
    }));
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    handleInputChange('slug', slug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        stock: parseInt(formData.stock) || 0,
        promotional_price: formData.promotional_price ? parseFloat(formData.promotional_price) : null,
        discount_percentage: formData.discount_percentage ? parseInt(formData.discount_percentage) : null,
        pix_discount_percentage: parseInt(formData.pix_discount_percentage) || 5,
        uti_pro_price: formData.uti_pro_price ? parseFloat(formData.uti_pro_price) : null,
        installment_options: parseInt(formData.installment_options) || 12,
        rating_average: parseFloat(formData.rating_average) || 0,
        rating_count: parseInt(formData.rating_count) || 0,
        shipping_weight: formData.shipping_weight ? parseFloat(formData.shipping_weight) : null,
        shipping_time_min: parseInt(formData.shipping_time_min) || 1,
        shipping_time_max: parseInt(formData.shipping_time_max) || 3,
      };

      await onSubmit(productData);
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">
          {product ? 'Editar Produto' : 'Novo Produto'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. INFORMAÇÕES BÁSICAS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Informações Básicas
            </CardTitle>
            <CardDescription>
              Dados principais do produto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome do Produto *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex: The Last of Us Parte I - PS4"
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Preço Base (R$) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="199.90"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descrição detalhada do produto..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stock">Estoque</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', e.target.value)}
                  placeholder="10"
                />
              </div>
              <div>
                <Label htmlFor="image">Imagem Principal (URL)</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
            </div>

            <div>
              <Label>Tags</Label>
              <TagSelector
                tags={tags}
                selectedTagIds={formData.tagIds}
                onTagsChange={(tagIds) => handleInputChange('tagIds', tagIds)}
              />
            </div>

            {/* Tamanhos e Cores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Tamanhos</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    placeholder="Ex: P, M, G"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                  />
                  <Button type="button" onClick={addSize} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.sizes.map((size) => (
                    <Badge key={size} variant="secondary" className="cursor-pointer" onClick={() => removeSize(size)}>
                      {size} <Trash2 className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Cores</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="Ex: Azul, Vermelho"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                  />
                  <Button type="button" onClick={addColor} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.colors.map((color) => (
                    <Badge key={color} variant="secondary" className="cursor-pointer" onClick={() => removeColor(color)}>
                      {color} <Trash2 className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. PREÇOS AVANÇADOS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Preços Avançados
            </CardTitle>
            <CardDescription>
              Configure preços promocionais e estratégias comerciais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="promotional_price">Preço Promocional (R$)</Label>
                <Input
                  id="promotional_price"
                  type="number"
                  step="0.01"
                  value={formData.promotional_price}
                  onChange={(e) => handleInputChange('promotional_price', e.target.value)}
                  placeholder="189.90"
                />
              </div>
              <div>
                <Label htmlFor="discount_percentage">Desconto (%)</Label>
                <Input
                  id="discount_percentage"
                  type="number"
                  value={formData.discount_percentage}
                  onChange={(e) => handleInputChange('discount_percentage', e.target.value)}
                  placeholder="5"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pix_discount_percentage">Desconto PIX (%)</Label>
                <Input
                  id="pix_discount_percentage"
                  type="number"
                  value={formData.pix_discount_percentage}
                  onChange={(e) => handleInputChange('pix_discount_percentage', e.target.value)}
                  placeholder="5"
                />
              </div>
              <div>
                <Label htmlFor="uti_pro_price">Preço UTI PRO (R$)</Label>
                <Input
                  id="uti_pro_price"
                  type="number"
                  step="0.01"
                  value={formData.uti_pro_price}
                  onChange={(e) => handleInputChange('uti_pro_price', e.target.value)}
                  placeholder="179.90"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="installment_options">Opções de Parcelamento</Label>
              <Select value={formData.installment_options} onValueChange={(value) => handleInputChange('installment_options', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">À vista</SelectItem>
                  <SelectItem value="3">3x sem juros</SelectItem>
                  <SelectItem value="6">6x sem juros</SelectItem>
                  <SelectItem value="12">12x sem juros</SelectItem>
                  <SelectItem value="24">24x com juros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 3. SISTEMA DE AVALIAÇÕES */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Sistema de Avaliações
            </CardTitle>
            <CardDescription>
              Configure as avaliações e reviews do produto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="rating_average">Média de Avaliações (0-5)</Label>
                <Input
                  id="rating_average"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating_average}
                  onChange={(e) => handleInputChange('rating_average', e.target.value)}
                  placeholder="4.5"
                />
              </div>
              <div>
                <Label htmlFor="rating_count">Quantidade de Avaliações</Label>
                <Input
                  id="rating_count"
                  type="number"
                  value={formData.rating_count}
                  onChange={(e) => handleInputChange('rating_count', e.target.value)}
                  placeholder="127"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="reviews_enabled"
                  checked={formData.reviews_enabled}
                  onCheckedChange={(checked) => handleInputChange('reviews_enabled', checked)}
                />
                <Label htmlFor="reviews_enabled">Exibir Avaliações</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. ESPECIFICAÇÕES TÉCNICAS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Especificações Técnicas
            </CardTitle>
            <CardDescription>
              Informações técnicas detalhadas do produto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Informações Básicas */}
            <div>
              <h4 className="font-semibold mb-3">Informações Básicas</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Plataforma</Label>
                  <Input
                    value={formData.technical_specs.basic_info.platform || ''}
                    onChange={(e) => handleTechnicalSpecChange('basic_info', 'platform', e.target.value)}
                    placeholder="PlayStation 4"
                  />
                </div>
                <div>
                  <Label>Gênero</Label>
                  <Input
                    value={formData.technical_specs.basic_info.genre || ''}
                    onChange={(e) => handleTechnicalSpecChange('basic_info', 'genre', e.target.value)}
                    placeholder="Action/Adventure"
                  />
                </div>
                <div>
                  <Label>Desenvolvedor</Label>
                  <Input
                    value={formData.technical_specs.basic_info.developer || ''}
                    onChange={(e) => handleTechnicalSpecChange('basic_info', 'developer', e.target.value)}
                    placeholder="Naughty Dog"
                  />
                </div>
                <div>
                  <Label>Publicadora</Label>
                  <Input
                    value={formData.technical_specs.basic_info.publisher || ''}
                    onChange={(e) => handleTechnicalSpecChange('basic_info', 'publisher', e.target.value)}
                    placeholder="Sony Interactive Entertainment"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Requisitos Técnicos */}
            <div>
              <h4 className="font-semibold mb-3">Requisitos Técnicos</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Armazenamento</Label>
                  <Input
                    value={formData.technical_specs.technical_requirements.storage || ''}
                    onChange={(e) => handleTechnicalSpecChange('technical_requirements', 'storage', e.target.value)}
                    placeholder="50 GB"
                  />
                </div>
                <div>
                  <Label>Jogadores</Label>
                  <Input
                    value={formData.technical_specs.technical_requirements.players || ''}
                    onChange={(e) => handleTechnicalSpecChange('technical_requirements', 'players', e.target.value)}
                    placeholder="1 jogador"
                  />
                </div>
                <div>
                  <Label>Online</Label>
                  <Input
                    value={formData.technical_specs.technical_requirements.online || ''}
                    onChange={(e) => handleTechnicalSpecChange('technical_requirements', 'online', e.target.value)}
                    placeholder="Não obrigatório"
                  />
                </div>
                <div>
                  <Label>Controle</Label>
                  <Input
                    value={formData.technical_specs.technical_requirements.controller || ''}
                    onChange={(e) => handleTechnicalSpecChange('technical_requirements', 'controller', e.target.value)}
                    placeholder="DualShock 4"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Informações Adicionais */}
            <div>
              <h4 className="font-semibold mb-3">Informações Adicionais</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Classificação Etária</Label>
                  <Input
                    value={formData.technical_specs.additional_info.age_rating || ''}
                    onChange={(e) => handleTechnicalSpecChange('additional_info', 'age_rating', e.target.value)}
                    placeholder="18 anos"
                  />
                </div>
                <div>
                  <Label>Idiomas</Label>
                  <Input
                    value={formData.technical_specs.additional_info.languages || ''}
                    onChange={(e) => handleTechnicalSpecChange('additional_info', 'languages', e.target.value)}
                    placeholder="Português, Inglês, Espanhol"
                  />
                </div>
                <div>
                  <Label>Legendas</Label>
                  <Input
                    value={formData.technical_specs.additional_info.subtitles || ''}
                    onChange={(e) => handleTechnicalSpecChange('additional_info', 'subtitles', e.target.value)}
                    placeholder="Sim"
                  />
                </div>
                <div>
                  <Label>Áudio</Label>
                  <Input
                    value={formData.technical_specs.additional_info.audio || ''}
                    onChange={(e) => handleTechnicalSpecChange('additional_info', 'audio', e.target.value)}
                    placeholder="Português (Brasil)"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 5. CARACTERÍSTICAS DO PRODUTO */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Características do Produto
            </CardTitle>
            <CardDescription>
              Lista de características e diferenciais do produto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newFeature.text}
                onChange={(e) => setNewFeature(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Ex: Produto original e lacrado"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <Select value={newFeature.icon} onValueChange={(value) => setNewFeature(prev => ({ ...prev, icon: value }))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="check">✓ Check</SelectItem>
                  <SelectItem value="shield-check">🛡️ Shield</SelectItem>
                  <SelectItem value="award">🏆 Award</SelectItem>
                  <SelectItem value="star">⭐ Star</SelectItem>
                  <SelectItem value="truck">🚚 Truck</SelectItem>
                </SelectContent>
              </Select>
              <Button type="button" onClick={addFeature} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {formData.product_features.map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{feature.icon === 'check' ? '✓' : feature.icon === 'shield-check' ? '🛡️' : feature.icon === 'award' ? '🏆' : feature.icon === 'star' ? '⭐' : '🚚'}</span>
                    <span>{feature.text}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFeature(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 6. INFORMAÇÕES DE ENTREGA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Informações de Entrega
            </CardTitle>
            <CardDescription>
              Configure dados de logística e entrega
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shipping_weight">Peso (kg)</Label>
                <Input
                  id="shipping_weight"
                  type="number"
                  step="0.001"
                  value={formData.shipping_weight}
                  onChange={(e) => handleInputChange('shipping_weight', e.target.value)}
                  placeholder="0.150"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="free_shipping"
                  checked={formData.free_shipping}
                  onCheckedChange={(checked) => handleInputChange('free_shipping', checked)}
                />
                <Label htmlFor="free_shipping">Frete Grátis</Label>
              </div>
            </div>

            <div>
              <Label>Dimensões (cm)</Label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  value={formData.shipping_dimensions.height}
                  onChange={(e) => handleNestedInputChange('shipping_dimensions', 'height', e.target.value)}
                  placeholder="Altura"
                />
                <Input
                  value={formData.shipping_dimensions.width}
                  onChange={(e) => handleNestedInputChange('shipping_dimensions', 'width', e.target.value)}
                  placeholder="Largura"
                />
                <Input
                  value={formData.shipping_dimensions.depth}
                  onChange={(e) => handleNestedInputChange('shipping_dimensions', 'depth', e.target.value)}
                  placeholder="Profundidade"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shipping_time_min">Prazo Mínimo (dias úteis)</Label>
                <Input
                  id="shipping_time_min"
                  type="number"
                  value={formData.shipping_time_min}
                  onChange={(e) => handleInputChange('shipping_time_min', e.target.value)}
                  placeholder="1"
                />
              </div>
              <div>
                <Label htmlFor="shipping_time_max">Prazo Máximo (dias úteis)</Label>
                <Input
                  id="shipping_time_max"
                  type="number"
                  value={formData.shipping_time_max}
                  onChange={(e) => handleInputChange('shipping_time_max', e.target.value)}
                  placeholder="3"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="store_pickup_available"
                checked={formData.store_pickup_available}
                onCheckedChange={(checked) => handleInputChange('store_pickup_available', checked)}
              />
              <Label htmlFor="store_pickup_available">Retirada na Loja Disponível</Label>
            </div>
          </CardContent>
        </Card>

        {/* 7. SEO E METADADOS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              SEO e Metadados
            </CardTitle>
            <CardDescription>
              Otimização para motores de busca
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="meta_title">Título SEO</Label>
              <Input
                id="meta_title"
                value={formData.meta_title}
                onChange={(e) => handleInputChange('meta_title', e.target.value)}
                placeholder="The Last of Us Parte I PS4 - UTI dos Games"
              />
            </div>

            <div>
              <Label htmlFor="meta_description">Descrição SEO</Label>
              <Textarea
                id="meta_description"
                value={formData.meta_description}
                onChange={(e) => handleInputChange('meta_description', e.target.value)}
                placeholder="Compre The Last of Us Parte I para PS4 na UTI dos Games..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug da URL</Label>
              <div className="flex gap-2">
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="the-last-of-us-parte-i-ps4"
                />
                <Button type="button" onClick={generateSlug} variant="outline">
                  Gerar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 8. CONTROLES DE VISIBILIDADE */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Controles de Visibilidade
            </CardTitle>
            <CardDescription>
              Configure a exibição e status do produto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                />
                <Label htmlFor="is_active">Produto Ativo</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => handleInputChange('is_featured', checked)}
                />
                <Label htmlFor="is_featured">Produto em Destaque</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="show_stock"
                  checked={formData.show_stock}
                  onCheckedChange={(checked) => handleInputChange('show_stock', checked)}
                />
                <Label htmlFor="show_stock">Exibir Estoque</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="show_rating"
                  checked={formData.show_rating}
                  onCheckedChange={(checked) => handleInputChange('show_rating', checked)}
                />
                <Label htmlFor="show_rating">Exibir Avaliações</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 9. BADGE PERSONALIZADO */}
        <Card>
          <CardHeader>
            <CardTitle>Badge Personalizado</CardTitle>
            <CardDescription>
              Configure um badge especial para o produto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Switch
                id="badge_visible"
                checked={formData.badge_visible}
                onCheckedChange={(checked) => handleInputChange('badge_visible', checked)}
              />
              <Label htmlFor="badge_visible">Exibir Badge</Label>
            </div>

            {formData.badge_visible && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="badge_text">Texto do Badge</Label>
                  <Input
                    id="badge_text"
                    value={formData.badge_text}
                    onChange={(e) => handleInputChange('badge_text', e.target.value)}
                    placeholder="LANÇAMENTO"
                  />
                </div>
                <div>
                  <Label htmlFor="badge_color">Cor do Badge</Label>
                  <Input
                    id="badge_color"
                    type="color"
                    value={formData.badge_color}
                    onChange={(e) => handleInputChange('badge_color', e.target.value)}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* BOTÕES DE AÇÃO */}
        <div className="flex justify-end gap-4 pt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar Produto'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;

