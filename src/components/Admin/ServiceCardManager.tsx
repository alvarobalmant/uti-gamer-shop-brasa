
import { useState } from 'react';
import { useServiceCards, ServiceCard } from '@/hooks/useServiceCards';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Settings, Info } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';

export const ServiceCardManager = () => {
  const { serviceCards, loading, addServiceCard, updateServiceCard, deleteServiceCard } = useServiceCards();
  const [editingCard, setEditingCard] = useState<ServiceCard | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    link_url: '',
    position: 1,
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      link_url: '',
      position: (serviceCards.length + 1),
      is_active: true,
    });
    setEditingCard(null);
  };

  const handleEdit = (card: ServiceCard) => {
    setEditingCard(card);
    setFormData({
      title: card.title,
      description: card.description,
      image_url: card.image_url,
      link_url: card.link_url,
      position: card.position,
      is_active: card.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.image_url || !formData.link_url) {
      alert('Todos os campos são obrigatórios.');
      return;
    }

    try {
      if (editingCard) {
        await updateServiceCard(editingCard.id, formData);
      } else {
        await addServiceCard(formData);
      }
      
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este card de serviço?')) {
      await deleteServiceCard(id);
    }
  };

  return (
    <Card className="bg-white border-2 border-red-200">
      <CardHeader>
        <CardTitle className="text-xl text-red-600 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Gerenciar Cards de Serviços
        </CardTitle>
        
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Tamanho recomendado:</strong> 400x300px (proporção 4:3)<br />
            <strong>Formatos:</strong> JPG, PNG, WebP<br />
            <strong>Cards padrão:</strong> Consoles, Assistência Técnica, Avaliação, Serviços Gerais<br />
            <strong>Upload:</strong> Arraste e solte ou clique para selecionar
          </AlertDescription>
        </Alert>
      </CardHeader>
      
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            {serviceCards.length} cards de serviços
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Card
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl text-red-600">
                  {editingCard ? 'Editar Card de Serviço' : 'Novo Card de Serviço'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ex: Consoles"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="position">Posição</Label>
                    <Input
                      id="position"
                      type="number"
                      min="1"
                      value={formData.position}
                      onChange={(e) => setFormData(prev => ({ ...prev, position: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Ex: PlayStation, Xbox, Nintendo e mais"
                    rows={2}
                    required
                  />
                </div>

                <ImageUpload
                  onImageUploaded={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                  currentImage={formData.image_url}
                  label="Imagem do Card *"
                  folder="service-cards"
                />

                <div className="space-y-2">
                  <Label htmlFor="link_url">Link de Destino *</Label>
                  <Input
                    id="link_url"
                    value={formData.link_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value }))}
                    placeholder="Ex: /categoria/consoles"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    {editingCard ? 'Atualizar' : 'Criar'} Card
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              Carregando cards de serviços...
            </div>
          ) : serviceCards.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              Nenhum card de serviço criado ainda.
            </div>
          ) : (
            serviceCards.map((card) => (
              <Card key={card.id} className="border-2 border-gray-200">
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <img
                      src={card.image_url}
                      alt={card.title}
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop';
                      }}
                    />
                    <Badge 
                      className={`absolute top-2 right-2 ${card.is_active ? "bg-green-600" : "bg-gray-600"}`}
                    >
                      {card.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  
                  <h3 className="font-bold text-gray-800 mb-2">{card.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{card.description}</p>
                  
                  <div className="space-y-1 text-xs text-gray-500 mb-4">
                    <div><strong>Posição:</strong> {card.position}</div>
                    <div><strong>Link:</strong> {card.link_url}</div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(card)}
                      size="sm"
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    
                    <Button
                      onClick={() => handleDelete(card.id)}
                      size="sm"
                      variant="destructive"
                      className="flex-1"
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
      </CardContent>
    </Card>
  );
};
