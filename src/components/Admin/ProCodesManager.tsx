
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProCodes, ProCode } from '@/hooks/useProCodes';
import { Loader2, Copy, Check, X, AlertCircle } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

const ProCodesManager = () => {
  const [durationMonths, setDurationMonths] = useState<string>("3");
  const [codes, setCodes] = useState<ProCode[]>([]);
  const [loadingCodes, setLoadingCodes] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { generateCode, listCodes, deactivateCode, generatingCode } = useProCodes();
  const { toast } = useToast();

  const handleGenerateCode = async () => {
    const newCode = await generateCode(parseInt(durationMonths));
    if (newCode) {
      setCodes(prev => [newCode, ...prev]);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    
    toast({
      title: "Código copiado!",
      description: "O código foi copiado para a área de transferência.",
    });
  };

  const handleDeactivateCode = async (id: string) => {
    const success = await deactivateCode(id);
    if (success) {
      setCodes(prev => prev.map(code => 
        code.id === id ? { ...code, is_active: false } : code
      ));
    }
  };

  const loadCodes = async () => {
    setLoadingCodes(true);
    const data = await listCodes();
    setCodes(data);
    setLoadingCodes(false);
  };

  // Carregar códigos ao montar o componente
  useEffect(() => {
    loadCodes();
  }, []);

  const columns: ColumnDef<ProCode>[] = [
    {
      accessorKey: "code",
      header: "Código",
      cell: ({ row }) => {
        const code = row.getValue("code") as string;
        return (
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm">{code}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => handleCopyCode(code)}
            >
              {copiedCode === code ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        );
      }
    },
    {
      accessorKey: "duration_months",
      header: "Duração",
      cell: ({ row }) => {
        const months = row.getValue("duration_months") as number;
        return <span>{months} {months === 1 ? 'mês' : 'meses'}</span>;
      }
    },
    {
      accessorKey: "created_at",
      header: "Criado em",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at") as string);
        return <span>{format(date, "dd/MM/yyyy", { locale: ptBR })}</span>;
      }
    },
    {
      accessorKey: "expires_at",
      header: "Expira em",
      cell: ({ row }) => {
        const expiresAt = row.getValue("expires_at") as string | null;
        if (!expiresAt) return <span className="text-gray-400">-</span>;
        const date = new Date(expiresAt);
        return <span>{format(date, "dd/MM/yyyy", { locale: ptBR })}</span>;
      }
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("is_active") as boolean;
        const usedBy = row.original.used_by;
        
        if (usedBy) {
          return (
            <Badge className="bg-green-600">Resgatado</Badge>
          );
        }
        
        if (!isActive) {
          return (
            <Badge variant="outline" className="text-gray-400 border-gray-400">Desativado</Badge>
          );
        }
        
        const expiresAt = row.original.expires_at;
        if (expiresAt && new Date(expiresAt) < new Date()) {
          return (
            <Badge variant="destructive">Expirado</Badge>
          );
        }
        
        return (
          <Badge className="bg-blue-600">Ativo</Badge>
        );
      }
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const isActive = row.getValue("is_active") as boolean;
        const usedBy = row.original.used_by;
        
        if (!isActive || usedBy) return null;
        
        return (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-red-500 hover:text-red-700 hover:bg-red-100"
            onClick={() => handleDeactivateCode(row.original.id)}
          >
            <X className="h-4 w-4 mr-1" />
            Desativar
          </Button>
        );
      }
    }
  ];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Gerar Código UTI PRO</CardTitle>
          <CardDescription>
            Crie códigos promocionais para assinaturas UTI PRO que podem ser resgatados pelos clientes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              value={durationMonths}
              onValueChange={setDurationMonths}
              disabled={generatingCode}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Duração" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 mês</SelectItem>
                <SelectItem value="3">3 meses</SelectItem>
                <SelectItem value="6">6 meses</SelectItem>
                <SelectItem value="12">12 meses</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={handleGenerateCode} 
              disabled={generatingCode}
              className="flex-1"
            >
              {generatingCode ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                'Gerar Novo Código'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Códigos UTI PRO</CardTitle>
          <CardDescription>
            Gerencie todos os códigos promocionais criados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingCodes ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : codes.length > 0 ? (
            <DataTable columns={columns} data={codes} searchKey="code" />
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Nenhum código encontrado</h3>
              <p className="text-muted-foreground mt-2">
                Gere novos códigos UTI PRO usando o formulário acima.
              </p>
            </div>
          )}
          
          <div className="mt-4 flex justify-end">
            <Button 
              variant="outline" 
              onClick={loadCodes}
              disabled={loadingCodes}
            >
              {loadingCodes ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Atualizar Lista'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProCodesManager;
