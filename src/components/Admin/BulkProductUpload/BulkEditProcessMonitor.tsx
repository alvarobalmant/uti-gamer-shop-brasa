import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, AlertTriangle, Clock, Tag, Database } from 'lucide-react';

interface ProcessLog {
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: string;
  details?: string;
}

interface BulkEditProcessMonitorProps {
  isProcessing: boolean;
  progress: number;
  currentStep: string;
  logs: ProcessLog[];
  stats: {
    total: number;
    processed: number;
    updated: number;
    skipped: number;
    errors: number;
    tagsProcessed: number;
    tagsCreated: number;
  };
}

export const BulkEditProcessMonitor: React.FC<BulkEditProcessMonitorProps> = ({
  isProcessing,
  progress,
  currentStep,
  logs,
  stats
}) => {
  const getLogIcon = (type: ProcessLog['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-blue-400" />;
    }
  };

  const getLogColor = (type: ProcessLog['type']) => {
    switch (type) {
      case 'success': return 'text-green-300';
      case 'warning': return 'text-yellow-300';
      case 'error': return 'text-red-300';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="space-y-4">
      {/* Progress Section */}
      {isProcessing && (
        <Alert className="bg-blue-950/30 border-blue-500/30">
          <Clock className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-200">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span><strong>Em processamento:</strong> {currentStep}</span>
                <span className="text-sm">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full h-2" />
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <Database className="w-5 h-5 mx-auto mb-1 text-blue-400" />
          <div className="text-lg font-bold text-white">{stats.total}</div>
          <div className="text-xs text-gray-400">Total</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <Clock className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
          <div className="text-lg font-bold text-white">{stats.processed}</div>
          <div className="text-xs text-gray-400">Processados</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <CheckCircle className="w-5 h-5 mx-auto mb-1 text-green-400" />
          <div className="text-lg font-bold text-white">{stats.updated}</div>
          <div className="text-xs text-gray-400">Atualizados</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
          <div className="text-lg font-bold text-white">{stats.skipped}</div>
          <div className="text-xs text-gray-400">Ignorados</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-red-400" />
          <div className="text-lg font-bold text-white">{stats.errors}</div>
          <div className="text-xs text-gray-400">Erros</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <Tag className="w-5 h-5 mx-auto mb-1 text-purple-400" />
          <div className="text-lg font-bold text-white">{stats.tagsProcessed}</div>
          <div className="text-xs text-gray-400">Tags Proc.</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <Tag className="w-5 h-5 mx-auto mb-1 text-green-400" />
          <div className="text-lg font-bold text-white">{stats.tagsCreated}</div>
          <div className="text-xs text-gray-400">Tags Criadas</div>
        </div>
      </div>

      {/* Logs Section */}
      {logs.length > 0 && (
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-3 border-b border-gray-700">
            <h4 className="font-medium text-white flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Log do Processamento ({logs.length} entradas)
            </h4>
          </div>
          
          <ScrollArea className="h-48 p-3">
            <div className="space-y-2">
              {logs.map((log, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  {getLogIcon(log.type)}
                  <div className="flex-1 min-w-0">
                    <div className={`${getLogColor(log.type)} break-words`}>
                      <span className="text-gray-500 text-xs mr-2">{log.timestamp}</span>
                      {log.message}
                    </div>
                    {log.details && (
                      <div className="text-xs text-gray-500 mt-1 pl-2 border-l border-gray-600">
                        {log.details}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};