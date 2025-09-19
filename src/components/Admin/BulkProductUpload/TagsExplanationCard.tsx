import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tag, Info, CheckCircle, AlertTriangle, FileText } from 'lucide-react';

export const TagsExplanationCard: React.FC = () => {
  return (
    <Card className="bg-gray-800 border-gray-700 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-400">
          <Tag className="w-5 h-5" />
          Como Usar Tags na Edição em Massa
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Formato das Tags */}
        <Alert className="bg-blue-950/30 border-blue-500/30">
          <Info className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-200">
            <strong className="text-blue-300">Formatos Suportados:</strong>
            <br />
            • <code className="bg-blue-900/50 px-1 rounded">tagname</code> - Tag simples
            <br />
            • <code className="bg-blue-900/50 px-1 rounded">tagname:peso</code> - Tag com peso (1-5)
            <br />
            • <code className="bg-blue-900/50 px-1 rounded">tagname:peso:categoria</code> - Tag com peso e categoria
            <br />
            <span className="text-sm mt-1 block">Exemplo: <code className="bg-blue-900/50 px-1 rounded">acao:5:genre;ps4:4:platform;aventura</code></span>
          </AlertDescription>
        </Alert>

        {/* Exemplos Práticos */}
        <div className="space-y-3">
          <h4 className="font-semibold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-green-400" />
            Exemplos Práticos
          </h4>
          
          <div className="bg-gray-900 rounded-lg p-3 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <Badge variant="outline" className="text-green-400 border-green-400 mb-2">
                  Tags Simples
                </Badge>
                <p className="text-gray-300">fifa;esporte;ea sports</p>
              </div>
              <div>
                <Badge variant="outline" className="text-blue-400 border-blue-400 mb-2">
                  Com Pesos
                </Badge>
                <p className="text-gray-300">acao:5;aventura:3;ps4:4</p>
              </div>
              <div>
                <Badge variant="outline" className="text-purple-400 border-purple-400 mb-2">
                  Com Categoria
                </Badge>
                <p className="text-gray-300">acao:5:genre;ps4:4:platform;sony:3:brand</p>
              </div>
            </div>
          </div>
        </div>

        {/* Regras e Validações */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h5 className="font-medium text-green-400 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Permitido
            </h5>
            <ul className="text-sm text-gray-300 space-y-1">
            <li>• Letras e números</li>
            <li>• Acentos (ação, coração)</li>
            <li>• Espaços (far cry, god of war)</li>
            <li>• Hífens (call-of-duty)</li>
            <li>• Até 50 caracteres por tag</li>
            <li>• Pesos de 1 a 5</li>
            <li>• Categorias: genre, platform, brand, etc.</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h5 className="font-medium text-red-400 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              Não Permitido
            </h5>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Caracteres especiais: &lt; &gt; { } [ ] \ /</li>
              <li>• Tags vazias ou apenas espaços</li>
              <li>• Tags com mais de 50 caracteres</li>
              <li>• Ponto e vírgula dentro do nome</li>
            </ul>
          </div>
        </div>

        {/* Processo Automático */}
        <Alert className="bg-green-950/30 border-green-500/30">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-200">
            <strong className="text-green-300">Processo Automático:</strong>
            <br />
            1. Tags novas são criadas automaticamente se não existirem
            <br />
            2. Busca é case-insensitive (Xbox = xbox = XBOX)
            <br />
            3. Tags antigas do produto são substituídas pelas novas
            <br />
            4. Peso/categoria informados atualizam a tag globalmente
            <br />
            5. Padrões: peso = 1, categoria = "generic"
          </AlertDescription>
        </Alert>

        {/* Sistema de Categorias e Pesos */}
        <div className="bg-purple-950/20 border border-purple-500/30 rounded-lg p-4">
          <h5 className="font-medium text-purple-400 mb-4 flex items-center gap-2">
            <Badge variant="outline" className="text-purple-400 border-purple-400">Sistema Ponderado</Badge>
            📋 Categorias e Pesos Disponíveis
          </h5>
          
          <div className="grid lg:grid-cols-2 gap-4 text-sm">
            {/* Categorias de Alta Prioridade */}
            <div className="space-y-3">
              <div className="bg-red-900/30 rounded-lg p-3">
                <div className="text-red-300 font-medium mb-2 flex items-center gap-2">
                  🏆 ALTA PRIORIDADE
                  <Badge variant="outline" className="text-red-300 border-red-400 text-xs">Peso 4-5</Badge>
                </div>
                <div className="text-red-200 text-xs space-y-1.5">
                  <div>• <code className="bg-red-900/50 px-1 rounded">platform</code> <span className="text-red-300 font-medium">(Peso: 5)</span></div>
                  <div className="text-red-200 ml-2">xbox, ps4, ps5, ps3, nintendo, pc, switch</div>
                  <div>• <code className="bg-red-900/50 px-1 rounded">product_type</code> <span className="text-red-300 font-medium">(Peso: 4)</span></div>
                  <div className="text-red-200 ml-2">jogo, console, controle, acessorio</div>
                  <div>• <code className="bg-red-900/50 px-1 rounded">game_title</code> <span className="text-red-300 font-medium">(Peso: 4)</span></div>
                  <div className="text-red-200 ml-2">minecraft, fifa, gta, callofduty</div>
                </div>
              </div>

              <div className="bg-blue-900/30 rounded-lg p-3">
                <div className="text-blue-300 font-medium mb-2 flex items-center gap-2">
                  🎯 MÉDIA PRIORIDADE  
                  <Badge variant="outline" className="text-blue-300 border-blue-400 text-xs">Peso 2-3</Badge>
                </div>
                <div className="text-blue-200 text-xs space-y-1.5">
                  <div>• <code className="bg-blue-900/50 px-1 rounded">brand</code> <span className="text-blue-300 font-medium">(Peso: 3)</span></div>
                  <div className="text-blue-200 ml-2">sony, microsoft, nintendo, ubisoft</div>
                  <div>• <code className="bg-blue-900/50 px-1 rounded">genre</code> <span className="text-blue-300 font-medium">(Peso: 2)</span></div>
                  <div className="text-blue-200 ml-2">acao, aventura, rpg, fps, corrida</div>
                </div>
              </div>
            </div>

            {/* Categorias de Baixa Prioridade e Exemplos */}
            <div className="space-y-3">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-300 font-medium mb-2 flex items-center gap-2">
                  📝 BAIXA PRIORIDADE
                  <Badge variant="outline" className="text-gray-300 border-gray-400 text-xs">Peso 1</Badge>
                </div>
                <div className="text-gray-200 text-xs space-y-1.5">
                  <div>• <code className="bg-gray-700/50 px-1 rounded">physical_attribute</code> <span className="text-gray-300 font-medium">(Peso: 1)</span></div>
                  <div className="text-gray-200 ml-2">30cm, verde, azul, pequeno</div>
                  <div>• <code className="bg-gray-700/50 px-1 rounded">condition</code> <span className="text-gray-300 font-medium">(Peso: 1)</span></div>
                  <div className="text-gray-200 ml-2">novo, usado, promocao, oficial</div>
                  <div>• <code className="bg-gray-700/50 px-1 rounded">generic</code> <span className="text-gray-300 font-medium">(Peso: 1)</span></div>
                  <div className="text-gray-200 ml-2">outros termos não categorizados</div>
                </div>
              </div>

              <div className="bg-green-900/30 rounded-lg p-3">
                <div className="text-green-300 font-medium mb-2">✨ EXEMPLOS PRÁTICOS</div>
                <div className="text-green-200 text-xs space-y-1.5">
                  <div><strong>Básico:</strong> <code className="bg-green-900/50 px-1 rounded">fifa:4:game_title</code></div>
                  <div><strong>Múltiplas:</strong> <code className="bg-green-900/50 px-1 rounded">fifa:4:game_title;ps5:5:platform;ea:3:brand</code></div>
                  <div><strong>Misto:</strong> <code className="bg-green-900/50 px-1 rounded">acao:2:genre;aventura;xbox:5:platform</code></div>
                  <div><strong>Case insensitive:</strong> PS5 = ps5 = Ps5</div>
                </div>
              </div>
            </div>
          </div>

          <Alert className="mt-4 bg-yellow-950/30 border-yellow-500/30">
            <Info className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-200">
              <strong className="text-yellow-300">🚀 Sistema de Busca Inteligente:</strong>
              <br />
              • Quanto maior o peso, mais relevante na busca
              <br />
              • Produtos com plataforma específica têm boost 2x quando busca inclui plataforma
              <br />
              • Busca por "minecraft ps4" priorizará Minecraft para PS4 sobre versões genéricas
              <br />
              • Sistema automaticamente categoriza tags conhecidas se você não especificar categoria
            </AlertDescription>
          </Alert>
        </div>

        {/* Dicas Importantes */}
        <div className="bg-yellow-950/20 border border-yellow-500/30 rounded-lg p-3">
          <h5 className="font-medium text-yellow-400 mb-2">💡 Dicas Importantes</h5>
          <ul className="text-sm text-yellow-200 space-y-1">
            <li>• Mantenha consistência nos nomes (sempre use "ps4" ou "PlayStation 4")</li>
            <li>• Use pesos estratégicos baseados na tabela acima</li>
            <li>• Se uma tag falhar, as outras continuam sendo processadas</li>
            <li>• Peso/categoria informados atualizam a tag para todos os produtos</li>
            <li>• Verifique o log final para ver quais tags foram aplicadas</li>
            <li>• <strong>Backup agora inclui pesos e categorias das tags existentes</strong></li>
          </ul>
        </div>

      </CardContent>
    </Card>
  );
};