import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Crown, Calendar, X, Plus, User, Search, Settings, CalendarMinus, UserPlus } from 'lucide-react';

interface Usuario {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  avatar_url?: string;
  updated_at: string;
}

interface SubscriptionPlan {
  id: string;
  subscription_type: string;
  price?: number;
  duration_months?: number;
  discount_percentage?: number;
}

const UserSubscriptionManagement = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      console.log('Carregando usuários...');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar usuários:', error);
        throw error;
      }

      console.log('Usuários carregados:', data?.length);
      setUsuarios(data || []);
      setFilteredUsuarios(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar usuários:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = (search: string) => {
    setSearchTerm(search);
    if (!search.trim()) {
      setFilteredUsuarios(usuarios);
      return;
    }

    const filtered = usuarios.filter(user =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsuarios(filtered);
  };

  const openUserModal = (user: Usuario) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (usuario: Usuario) => {
    // For now, just show basic user info since we're rebuilding
    return <Badge variant="secondary">Usuário ativo</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Usuários</CardTitle>
          <CardDescription>
            Gerencie todos os usuários cadastrados (sistema de autenticação em reconstrução)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Barra de Pesquisa */}
          <div className="mb-6">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => filterUsers(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total de Usuários</p>
                    <p className="text-xl font-bold">{usuarios.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Sistema em Reconstrução</p>
                    <p className="text-xl font-bold">🔧</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Nova Autenticação</p>
                    <p className="text-xl font-bold">✨</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabela de Usuários */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cadastro</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsuarios.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell className="font-medium">
                      {usuario.name || 'Nome não informado'}
                    </TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>
                      <Badge variant={usuario.role === 'admin' ? 'default' : 'secondary'}>
                        {usuario.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(usuario)}
                    </TableCell>
                    <TableCell>
                      {formatDate(usuario.created_at)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openUserModal(usuario)}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsuarios.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'Nenhum usuário encontrado para a busca.' : 'Nenhum usuário encontrado.'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Usuário */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Informações do Usuário</DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nome</label>
                <p className="text-lg">{selectedUser.name || 'Não informado'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="text-lg">{selectedUser.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Role</label>
                <p className="text-lg">{selectedUser.role}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Data de Cadastro</label>
                <p className="text-lg">{formatDate(selectedUser.created_at)}</p>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Sistema de assinaturas em reconstrução. Funcionalidades de gerenciamento 
                  serão disponibilizadas em breve.
                </p>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={closeUserModal}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserSubscriptionManagement;