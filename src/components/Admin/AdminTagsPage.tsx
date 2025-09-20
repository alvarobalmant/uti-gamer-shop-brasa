import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TagCategoryManager } from './TagCategoryManager';
// import { TagsTab } from './ProductEditor/Tabs/TagsTab';
import { useTags } from '@/hooks/useTags';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Tags, BarChart3 } from 'lucide-react';

export const AdminTagsPage = () => {
  const { tags, loading } = useTags();
  const [selectedProductTags, setSelectedProductTags] = useState<string[]>([]);

  const handleTagsChange = (field: string, value: string[]) => {
    setSelectedProductTags(value);
  };

  const tagStats = React.useMemo(() => {
    if (!tags.length) return null;
    
    const categoryStats = tags.reduce((acc, tag) => {
      const category = tag.category_enum || tag.category || 'generic';
      if (!acc[category]) {
        acc[category] = { count: 0, avgWeight: 0, totalWeight: 0 };
      }
      acc[category].count++;
      acc[category].totalWeight += tag.weight || 1;
      acc[category].avgWeight = acc[category].totalWeight / acc[category].count;
      return acc;
    }, {} as Record<string, { count: number; avgWeight: number; totalWeight: number }>);

    return {
      total: tags.length,
      categories: Object.keys(categoryStats).length,
      mostUsedCategory: Object.entries(categoryStats).sort((a, b) => b[1].count - a[1].count)[0],
      avgWeight: tags.reduce((sum, tag) => sum + (tag.weight || 1), 0) / tags.length
    };
  }, [tags]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Tags</h1>
          <p className="text-muted-foreground">
            Configure categorias, gerencie tags e otimize o sistema de busca
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {tagStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Tags</CardTitle>
              <Tags className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tagStats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categorias</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tagStats.categories}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categoria Mais Usada</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tagStats.mostUsedCategory[1].count}</div>
              <p className="text-xs text-muted-foreground">
                {tagStats.mostUsedCategory[0]}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Peso Médio</CardTitle>
              <Badge variant="outline">{tagStats.avgWeight.toFixed(1)}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Influência média das tags na busca
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">
            <Settings className="w-4 h-4 mr-2" />
            Categorias
          </TabsTrigger>
          <TabsTrigger value="tags">
            <Tags className="w-4 h-4 mr-2" />
            Tags
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="mt-6">
          <TagCategoryManager />
        </TabsContent>

        <TabsContent value="tags" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Navegador de Tags</CardTitle>
              <CardDescription>
                Visualize e filtre todas as tags por categoria, peso e uso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Total de tags: {tags.length}
                </div>
                <div className="grid gap-2">
                  {tags.map((tag) => (
                    <div key={tag.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{tag.name}</span>
                        <Badge variant="outline">{tag.category || tag.category_enum}</Badge>
                      </div>
                      <Badge variant="secondary">Peso {tag.weight || 1}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics do Sistema de Tags</CardTitle>
              <CardDescription>
                Métricas de performance e uso das tags no sistema de busca
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  🚧 Analytics em desenvolvimento - Em breve você poderá ver:
                </div>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Tags mais utilizadas em buscas</li>
                  <li>Taxa de conversão por categoria</li>
                  <li>Eficácia do sistema de pesos</li>
                  <li>Sugestões de otimização automática</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};