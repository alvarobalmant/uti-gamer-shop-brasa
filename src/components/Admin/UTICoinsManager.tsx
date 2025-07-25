import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Coins, 
  Settings, 
  Users, 
  Gift, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2,
  Save,
  X,
  DollarSign,
  Search,
  Power
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CodeVerifier from './CodeVerifier';

interface CoinRule {
  id: string;
  action: string;
  amount: number;
  description: string;
  max_per_day?: number;
  max_per_month?: number;
  is_active: boolean;
  cooldown_minutes: number;
}

interface CoinProduct {
  id: string;
  name: string;
  description?: string;
  cost: number;
  product_type: 'discount' | 'freebie' | 'exclusive_access' | 'physical_product';
  product_data: any;
  stock?: number;
  is_active: boolean;
  display_order: number;
  image_url?: string;
}

interface SystemConfig {
  setting_key: string;
  setting_value: any;
  description?: string;
}

interface UserCoins {
  user_id: string;
  balance: number;
  total_earned: number;
  total_spent: number;
  email?: string;
  name?: string;
}

const UTICoinsManager = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // States para cada aba
  const [rules, setRules] = useState<CoinRule[]>([]);
  const [products, setProducts] = useState<CoinProduct[]>([]);
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [users, setUsers] = useState<UserCoins[]>([]);
  
  // States para edição
  const [editingRule, setEditingRule] = useState<CoinRule | null>(null);
  const [editingProduct, setEditingProduct] = useState<CoinProduct | null>(null);
  const [showNewRule, setShowNewRule] = useState(false);
  const [showNewProduct, setShowNewProduct] = useState(false);
  
  // State para adicionar moedas manualmente
  const [manualCoins, setManualCoins] = useState({ userId: '', amount: 0, description: '' });

  // Carregar dados
  const loadRules = async () => {
    const { data, error } = await supabase
      .from('coin_rules')
      .select('*')
      .order('action');
    
    if (error) {
      toast({ title: 'Erro', description: 'Erro ao carregar regras', variant: 'destructive' });
    } else {
      setRules(data || []);
    }
  };

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from('coin_products')
      .select('*')
      .order('display_order');
    
    if (error) {
      toast({ title: 'Erro', description: 'Erro ao carregar produtos', variant: 'destructive' });
    } else {
      setProducts((data || []).map(p => ({
        ...p,
        product_type: p.product_type as 'discount' | 'freebie' | 'exclusive_access' | 'physical_product'
      })));
    }
  };

  const loadConfigs = async () => {
    try {
      // Carregar configurações do sistema UTI Coins
      const [systemConfigsResult, siteSettingsResult] = await Promise.all([
        supabase.from('coin_system_config').select('*').order('setting_key'),
        supabase.from('site_settings').select('*').eq('setting_key', 'uti_coins_settings')
      ]);
      
      const allConfigs = [
        ...(systemConfigsResult.data || []),
        ...(siteSettingsResult.data || [])
      ];
      
      setConfigs(allConfigs);
    } catch (error) {
      toast({ title: 'Erro', description: 'Erro ao carregar configurações', variant: 'destructive' });
      setConfigs([]);
    }
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('uti_coins')
        .select(`
          user_id,
          balance,
          total_earned,
          total_spent
        `)
        .order('total_earned', { ascending: false })
        .limit(100);
      
      if (error) throw error;

      if (data && data.length > 0) {
        // Buscar dados dos usuários separadamente
        const userIds = data.map(u => u.user_id);
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, email, name')
          .in('id', userIds);

        const formattedUsers = data.map(u => {
          const profile = profilesData?.find(p => p.id === u.user_id);
          return {
            user_id: u.user_id,
            balance: u.balance,
            total_earned: u.total_earned,
            total_spent: u.total_spent,
            email: profile?.email || 'Email não encontrado',
            name: profile?.name || 'Nome não encontrado'
          };
        });
        
        setUsers(formattedUsers);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast({ title: 'Erro', description: 'Erro ao carregar usuários', variant: 'destructive' });
      setUsers([]);
    }
  };

  useEffect(() => {
    loadRules();
    loadProducts();
    loadConfigs();
    loadUsers();
  }, []);

  // Funções para regras
  const saveRule = async (rule: CoinRule) => {
    setLoading(true);
    try {
      if (rule.id) {
        const { error } = await supabase
          .from('coin_rules')
          .update({
            action: rule.action,
            amount: rule.amount,
            description: rule.description,
            max_per_day: rule.max_per_day,
            max_per_month: rule.max_per_month,
            is_active: rule.is_active,
            cooldown_minutes: rule.cooldown_minutes
          })
          .eq('id', rule.id);
        
        if (error) throw error;
        toast({ title: 'Sucesso', description: 'Regra atualizada!' });
      } else {
        const { error } = await supabase
          .from('coin_rules')
          .insert({
            action: rule.action,
            amount: rule.amount,
            description: rule.description,
            max_per_day: rule.max_per_day,
            max_per_month: rule.max_per_month,
            is_active: rule.is_active,
            cooldown_minutes: rule.cooldown_minutes
          });
        
        if (error) throw error;
        toast({ title: 'Sucesso', description: 'Regra criada!' });
      }
      
      setEditingRule(null);
      setShowNewRule(false);
      loadRules();
    } catch (error) {
      toast({ title: 'Erro', description: 'Erro ao salvar regra', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const deleteRule = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta regra?')) return;
    
    const { error } = await supabase
      .from('coin_rules')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast({ title: 'Erro', description: 'Erro ao excluir regra', variant: 'destructive' });
    } else {
      toast({ title: 'Sucesso', description: 'Regra excluída!' });
      loadRules();
    }
  };

  // Funções para produtos
  const saveProduct = async (product: CoinProduct) => {
    setLoading(true);
    try {
      if (product.id) {
        const { error } = await supabase
          .from('coin_products')
          .update({
            name: product.name,
            description: product.description,
            cost: product.cost,
            product_type: product.product_type,
            product_data: product.product_data || {},
            stock: product.stock,
            is_active: product.is_active,
            display_order: product.display_order,
            image_url: product.image_url
          })
          .eq('id', product.id);
        
        if (error) throw error;
        toast({ title: 'Sucesso', description: 'Produto atualizado!' });
      } else {
        const { error } = await supabase
          .from('coin_products')
          .insert({
            name: product.name,
            description: product.description,
            cost: product.cost,
            product_type: product.product_type,
            product_data: product.product_data || {},
            stock: product.stock,
            is_active: product.is_active,
            display_order: product.display_order || 0,
            image_url: product.image_url
          });
        
        if (error) throw error;
        toast({ title: 'Sucesso', description: 'Produto criado!' });
      }
      
      setEditingProduct(null);
      setShowNewProduct(false);
      loadProducts();
    } catch (error) {
      toast({ title: 'Erro', description: 'Erro ao salvar produto', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    const { error } = await supabase
      .from('coin_products')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast({ title: 'Erro', description: 'Erro ao excluir produto', variant: 'destructive' });
    } else {
      toast({ title: 'Sucesso', description: 'Produto excluído!' });
      loadProducts();
    }
  };

  // Função para adicionar moedas manualmente
  const addManualCoins = async () => {
    if (!manualCoins.userId || manualCoins.amount <= 0) {
      toast({ title: 'Erro', description: 'Preencha todos os campos', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('earn_coins', {
        p_user_id: manualCoins.userId,
        p_action: 'admin_manual',
        p_amount: manualCoins.amount,
        p_description: manualCoins.description || 'Bônus manual do admin'
      });

      if (error) throw error;

      toast({ title: 'Sucesso', description: `${manualCoins.amount} moedas adicionadas!` });
      setManualCoins({ userId: '', amount: 0, description: '' });
      loadUsers();
    } catch (error) {
      toast({ title: 'Erro', description: 'Erro ao adicionar moedas', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Coins className="w-8 h-8 text-yellow-500" />
          UTI Coins - Gerenciamento
        </h1>
        <p className="text-muted-foreground">Gerencie o sistema de moedas e recompensas</p>
      </div>

      <Tabs defaultValue="rules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Sistema
          </TabsTrigger>
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Regras
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Gift className="w-4 h-4" />
            Produtos
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="verifier" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Verificador
          </TabsTrigger>
        </TabsList>

        {/* Aba de Regras */}
        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Regras de Ganho de Moedas</CardTitle>
                <Button onClick={() => {
                  setEditingRule({
                    id: '',
                    action: '',
                    amount: 0,
                    description: '',
                    is_active: true,
                    cooldown_minutes: 0
                  });
                  setShowNewRule(true);
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Regra
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ação</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Limite Diário</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-mono">{rule.action}</TableCell>
                      <TableCell>{rule.amount} coins</TableCell>
                      <TableCell>{rule.description}</TableCell>
                      <TableCell>{rule.max_per_day || 'Ilimitado'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          rule.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {rule.is_active ? 'Ativo' : 'Inativo'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setEditingRule(rule)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => deleteRule(rule.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Produtos */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Produtos Resgatáveis</CardTitle>
                <Button onClick={() => {
                  setEditingProduct({
                    id: '',
                    name: '',
                    description: '',
                    cost: 0,
                    product_type: 'discount',
                    product_data: {},
                    is_active: true,
                    display_order: 0,
                    image_url: ''
                  });
                  setShowNewProduct(true);
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Produto
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Custo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estoque</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.cost} coins</TableCell>
                      <TableCell className="capitalize">{product.product_type.replace('_', ' ')}</TableCell>
                      <TableCell>{product.stock || 'Ilimitado'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.is_active ? 'Ativo' : 'Inativo'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setEditingProduct(product)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => deleteProduct(product.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Usuários */}
        <TabsContent value="users">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de usuários */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Ranking de Usuários</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Saldo</TableHead>
                        <TableHead>Total Ganho</TableHead>
                        <TableHead>Total Gasto</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.user_id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{user.name || 'Sem nome'}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>{user.balance} coins</TableCell>
                          <TableCell>{user.total_earned} coins</TableCell>
                          <TableCell>{user.total_spent} coins</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Adicionar moedas manualmente */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Adicionar Moedas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="userId">ID do Usuário</Label>
                    <Input
                      id="userId"
                      value={manualCoins.userId}
                      onChange={(e) => setManualCoins(prev => ({ ...prev, userId: e.target.value }))}
                      placeholder="UUID do usuário"
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Quantidade</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={manualCoins.amount}
                      onChange={(e) => setManualCoins(prev => ({ ...prev, amount: parseInt(e.target.value) }))}
                      placeholder="Quantidade de moedas"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={manualCoins.description}
                      onChange={(e) => setManualCoins(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Motivo do bônus"
                    />
                  </div>
                  <Button 
                    onClick={addManualCoins} 
                    disabled={loading}
                    className="w-full"
                  >
                    Adicionar Moedas
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Aba de Configurações */}
        <TabsContent value="config">
          <div className="space-y-6">
            {/* Sistema On/Off */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Power className="w-5 h-5" />
                  Controle do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Sistema UTI Coins</h3>
                    <p className="text-sm text-muted-foreground">
                      Ativar ou desativar completamente o sistema de moedas
                    </p>
                  </div>
                  <Switch
                    checked={configs.find(c => c.setting_key === 'uti_coins_settings')?.setting_value?.enabled || false}
                    onCheckedChange={async (checked) => {
                       console.log('[ADMIN UTI COINS] Tentando atualizar:', { checked });
                        try {
                         const { data, error } = await supabase
                           .from('site_settings')
                           .update({ 
                             setting_value: { enabled: checked }
                           })
                           .eq('setting_key', 'uti_coins_settings')
                           .select();
                         
                         console.log('[ADMIN UTI COINS] Resultado da query:', { data, error });
                         
                         if (error) throw error;
                         
                         setConfigs(prev => prev.map(c => 
                           c.setting_key === 'uti_coins_settings' 
                             ? { ...c, setting_value: { enabled: checked } }
                             : c
                         ));
                         
                         console.log('[ADMIN UTI COINS] Configuração atualizada com sucesso');
                         
                         toast({ 
                           title: 'Sucesso', 
                           description: `Sistema UTI Coins ${checked ? 'ativado' : 'desativado'}!` 
                         });
                       } catch (error) {
                         console.error('[ADMIN UTI COINS] Erro:', error);
                         toast({ 
                           title: 'Erro', 
                           description: 'Erro ao atualizar configuração', 
                           variant: 'destructive' 
                         });
                       }
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Outras Configurações */}
            <Card>
              <CardHeader>
                <CardTitle>Configurações Avançadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {configs.filter(c => c.setting_key !== 'system_enabled').map((config) => (
                    <div key={config.setting_key} className="border rounded-lg p-4">
                      <Label className="font-medium capitalize">{config.setting_key.replace('_', ' ')}</Label>
                      <Input
                        value={config.setting_value}
                        onChange={async (e) => {
                          try {
                            const { error } = await supabase
                              .from('coin_system_config')
                              .update({ setting_value: e.target.value })
                              .eq('setting_key', config.setting_key);
                            
                            if (error) throw error;
                            
                            // Atualizar configuração localmente
                            setConfigs(prev => prev.map(c => 
                              c.setting_key === config.setting_key 
                                ? { ...c, setting_value: e.target.value }
                                : c
                            ));
                            
                            toast({ title: 'Sucesso', description: 'Configuração salva!' });
                          } catch (error) {
                            toast({ 
                              title: 'Erro', 
                              description: 'Erro ao salvar configuração', 
                              variant: 'destructive' 
                            });
                          }
                        }}
                        className="mt-2"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        {config.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Aba do Verificador de Códigos */}
        <TabsContent value="verifier">
          <CodeVerifier />
        </TabsContent>
      </Tabs>

      {/* Modal para editar/criar regra */}
      {(editingRule || showNewRule) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>
                {editingRule ? 'Editar Regra' : 'Nova Regra'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Ação</Label>
                <Input
                  value={editingRule?.action || ''}
                  onChange={(e) => setEditingRule(prev => ({ 
                    ...prev!, 
                    action: e.target.value,
                    amount: prev?.amount || 0,
                    description: prev?.description || '',
                    is_active: prev?.is_active !== undefined ? prev.is_active : true,
                    cooldown_minutes: prev?.cooldown_minutes || 0
                  }))}
                  placeholder="nome_da_acao"
                />
              </div>
              <div>
                <Label>Quantidade de Moedas</Label>
                <Input
                  type="number"
                  value={editingRule?.amount || 0}
                  onChange={(e) => setEditingRule(prev => ({ ...prev!, amount: parseInt(e.target.value) }))}
                />
              </div>
              <div>
                <Label>Descrição</Label>
                <Input
                  value={editingRule?.description || ''}
                  onChange={(e) => setEditingRule(prev => ({ ...prev!, description: e.target.value }))}
                />
              </div>
              <div>
                <Label>Limite Diário</Label>
                <Input
                  type="number"
                  value={editingRule?.max_per_day || ''}
                  onChange={(e) => setEditingRule(prev => ({ ...prev!, max_per_day: e.target.value ? parseInt(e.target.value) : undefined }))}
                  placeholder="Deixe vazio para ilimitado"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={editingRule?.is_active || false}
                  onCheckedChange={(checked) => setEditingRule(prev => ({ ...prev!, is_active: checked }))}
                />
                <Label>Ativo</Label>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => saveRule(editingRule!)}
                  disabled={loading}
                  className="flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setEditingRule(null);
                    setShowNewRule(false);
                  }}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal para editar/criar produto */}
      {(editingProduct || showNewProduct) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Nome</Label>
                <Input
                  value={editingProduct?.name || ''}
                  onChange={(e) => setEditingProduct(prev => ({ ...prev!, name: e.target.value }))}
                />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea
                  value={editingProduct?.description || ''}
                  onChange={(e) => setEditingProduct(prev => ({ ...prev!, description: e.target.value }))}
                />
              </div>
              <div>
                <Label>Custo (moedas)</Label>
                <Input
                  type="number"
                  value={editingProduct?.cost || 0}
                  onChange={(e) => setEditingProduct(prev => ({ ...prev!, cost: parseInt(e.target.value) }))}
                />
              </div>
              <div>
                <Label>Tipo</Label>
                <Select
                  value={editingProduct?.product_type || 'discount'}
                  onValueChange={(value) => setEditingProduct(prev => ({ ...prev!, product_type: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discount">Desconto</SelectItem>
                    <SelectItem value="freebie">Brinde</SelectItem>
                    <SelectItem value="exclusive_access">Acesso Exclusivo</SelectItem>
                    <SelectItem value="physical_product">Produto Físico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Estoque</Label>
                <Input
                  type="number"
                  value={editingProduct?.stock || ''}
                  onChange={(e) => setEditingProduct(prev => ({ ...prev!, stock: e.target.value ? parseInt(e.target.value) : undefined }))}
                  placeholder="Deixe vazio para ilimitado"
                />
              </div>
              <div>
                <Label>URL da Imagem</Label>
                <Input
                  value={editingProduct?.image_url || ''}
                  onChange={(e) => setEditingProduct(prev => ({ ...prev!, image_url: e.target.value }))}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={editingProduct?.is_active || false}
                  onCheckedChange={(checked) => setEditingProduct(prev => ({ ...prev!, is_active: checked }))}
                />
                <Label>Ativo</Label>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => saveProduct(editingProduct!)}
                  disabled={loading}
                  className="flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setEditingProduct(null);
                    setShowNewProduct(false);
                  }}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UTICoinsManager;