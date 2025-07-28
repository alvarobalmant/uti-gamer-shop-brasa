import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Copy, Check, Clock, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AdminLink {
  id: string;
  token: string;
  expires_at: string;
  created_at: string;
  used_at: string | null;
  used_by_ip: string | null;
  is_active: boolean;
}

export const AdminLoginManager = () => {
  const [links, setLinks] = useState<AdminLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [duration, setDuration] = useState(60); // minutos
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_login_links')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLinks(data || []);
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
      const { data, error } = await supabase.rpc('create_admin_link', {
        duration_minutes: duration
      });

      if (error) throw error;

      const result = data as any; // Type assertion para o retorno da função
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
      const { error } = await supabase
        .from('admin_login_links')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

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

  const copyToClipboard = async (token: string) => {
    const fullUrl = `${window.location.origin}/admin-login/${token}`;
    
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedToken(token);
      toast({
        title: "Link copiado!",
        description: "O link foi copiado para a área de transferência",
      });
      
      setTimeout(() => setCopiedToken(null), 2000);
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o link",
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
        <div className="text-muted-foreground">Carregando links...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
              {creating ? "Criando..." : "Criar Link"}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Qualquer pessoa que acessar este link será automaticamente logada como administrador.
            Use com extrema cautela e apenas para situações específicas.
          </p>
        </CardContent>
      </Card>

      {/* Lista de links */}
      <Card>
        <CardHeader>
          <CardTitle>Links Administrativos</CardTitle>
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
                        Token: {link.token.substring(0, 8)}...
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(link.token)}
                        disabled={!link.is_active || isExpired(link.expires_at)}
                        className="flex items-center gap-1"
                      >
                        {copiedToken === link.token ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        {copiedToken === link.token ? "Copiado" : "Copiar"}
                      </Button>
                      {link.is_active && !isExpired(link.expires_at) && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deactivateLink(link.id)}
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="h-4 w-4" />
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
                      <>
                        <div>
                          <strong>Usado em:</strong>{' '}
                          {formatDistanceToNow(new Date(link.used_at), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </div>
                        <div>
                          <strong>IP:</strong> {link.used_by_ip || 'Desconhecido'}
                        </div>
                      </>
                    )}
                  </div>

                  {link.is_active && !isExpired(link.expires_at) && (
                    <div className="bg-muted p-2 rounded text-sm font-mono break-all">
                      {window.location.origin}/admin-login/{link.token}
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