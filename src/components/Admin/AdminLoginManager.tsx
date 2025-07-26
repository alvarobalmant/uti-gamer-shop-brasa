import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Ban, Clock, Plus, Shield, Loader2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AdminLink {
  id: string;
  expires_at: string;
  created_at: string;
  used_at: string | null;
  is_active: boolean;
}

export const AdminLoginManager = () => {
  const [links, setLinks] = useState<AdminLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [duration, setDuration] = useState(60); // minutos
  const { toast } = useToast();

  const fetchLinks = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Não autenticado');

      const response = await supabase.functions.invoke('admin-link-manager', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) throw response.error;
      setLinks(response.data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar links",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createAdminLink = async () => {
    if (duration < 5 || duration > 1440) {
      toast({
        title: "Duração inválida",
        description: "A duração deve ser entre 5 e 1440 minutos (24 horas)",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Não autenticado');

      const response = await supabase.functions.invoke('admin-link-manager', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: { duration },
      });

      if (response.error) throw response.error;

      const result = response.data;
      if (result.success) {
        toast({
          title: "Link criado com sucesso!",
          description: `Link válido por ${duration} minutos`,
        });
        
        await fetchLinks();
        setDuration(60); // reset
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({
        title: "Erro ao criar link",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const deactivateLink = async (id: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Não autenticado');

      const response = await supabase.functions.invoke('admin-link-manager', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: { linkId: id },
      });

      if (response.error) throw response.error;

      toast({
        title: "Link desativado",
        description: "O link foi desativado com sucesso",
      });

      await fetchLinks();
    } catch (error: any) {
      toast({
        title: "Erro ao desativar link",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const getStatusBadge = (link: AdminLink) => {
    if (!link.is_active) {
      return <Badge variant="secondary">Desativado</Badge>;
    }
    if (isExpired(link.expires_at)) {
      return <Badge variant="destructive">Expirado</Badge>;
    }
    if (link.used_at) {
      return <Badge variant="outline">Usado</Badge>;
    }
    return <Badge variant="default" className="bg-green-600">Ativo</Badge>;
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <div className="text-muted-foreground">Carregando links...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Aviso de segurança */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-orange-800 mb-1">Sistema de Login Seguro</h3>
              <p className="text-sm text-orange-700">
                Os links são criados de forma segura e não expõem tokens no frontend. 
                Apenas você (admin logado) pode ver e gerenciar seus próprios links.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Criar novo link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Criar Link de Login Administrativo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="duration">Duração (minutos)</Label>
              <Input
                id="duration"
                type="number"
                min="5"
                max="1440"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
                className="w-32"
              />
            </div>
            <Button 
              onClick={createAdminLink}
              disabled={creating}
              className="flex items-center gap-2"
            >
              {creating && <Loader2 className="h-4 w-4 animate-spin" />}
              {creating ? "Criando..." : "Criar Link"}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Os links são criados com máxima segurança e validados no backend.
          </p>
        </CardContent>
      </Card>

      {/* Lista de links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Seus Links Administrativos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {links.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhum link administrativo criado ainda.
            </p>
          ) : (
            <div className="space-y-4">
              {links.map((link) => (
                <div
                  key={link.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(link)}
                      <span className="text-sm text-muted-foreground">
                        ID: {link.id.substring(0, 8)}...
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {link.is_active && !isExpired(link.expires_at) && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deactivateLink(link.id)}
                          className="flex items-center gap-1"
                        >
                          <Ban className="h-4 w-4" />
                          Desativar
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Criado:</strong>{' '}
                      {formatDistanceToNow(new Date(link.created_at), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </div>
                    <div>
                      <strong>Expira:</strong>{' '}
                      {isExpired(link.expires_at) ? (
                        <span className="text-red-600">Expirado</span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(link.expires_at), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </span>
                      )}
                    </div>
                    {link.used_at && (
                      <div className="col-span-2">
                        <strong>Usado em:</strong>{' '}
                        {formatDistanceToNow(new Date(link.used_at), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </div>
                    )}
                  </div>

                  {link.is_active && !isExpired(link.expires_at) && (
                    <div className="bg-green-50 border border-green-200 p-3 rounded">
                      <p className="text-sm text-green-700 font-medium">
                        ✅ Link ativo e seguro. O token está protegido no backend.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};