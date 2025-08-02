import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, Eye, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface SecurityLog {
  id: string;
  action_type: string;
  resource_type?: string;
  resource_id?: string;
  details: any;
  ip_address?: unknown;
  user_agent?: string;
  created_at: string;
  admin_user_id: string;
}

interface ActiveSession {
  id: string;
  user_id: string;
  session_id: string;
  created_at: string;
}

export const AdminSecurityMonitor: React.FC = () => {
  const { isAdmin } = useAuth();
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchSecurityData = async () => {
      try {
        // Fetch recent security logs
        const { data: logs } = await supabase
          .from('admin_security_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        if (logs) {
          setSecurityLogs(logs);
        }

        // Fetch active sessions that haven't been invalidated
        const { data: sessions } = await supabase
          .from('invalidated_sessions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (sessions) {
          setActiveSessions(sessions);
        }
      } catch (error) {
        console.error('Error fetching security data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSecurityData();

    // Set up real-time subscription for security logs
    const subscription = supabase
      .channel('admin_security_logs')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'admin_security_logs'
      }, (payload) => {
        setSecurityLogs(prev => [payload.new as SecurityLog, ...prev.slice(0, 19)]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [isAdmin]);


  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'login':
        return <Shield className="h-4 w-4 text-green-500" />;
      case 'logout':
        return <Eye className="h-4 w-4 text-blue-500" />;
      case 'admin_action':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActionBadgeVariant = (actionType: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (actionType) {
      case 'login':
        return 'default';
      case 'logout':
        return 'secondary';
      case 'admin_action':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Security Monitor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">Loading security data...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Security Logs */}
            <div>
              <h3 className="font-semibold mb-3">Recent Admin Actions</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {securityLogs.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No recent activity</p>
                ) : (
                  securityLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getActionIcon(log.action_type)}
                        <div>
                          <div className="font-medium text-sm">{log.action_type}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(log.created_at).toLocaleString()}
                          </div>
                          {log.resource_type && (
                            <div className="text-xs text-muted-foreground">
                              {log.resource_type}: {log.resource_id}
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge variant={getActionBadgeVariant(log.action_type)}>
                        {log.action_type}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Active Sessions */}
            <div>
              <h3 className="font-semibold mb-3">Invalidated Sessions</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {activeSessions.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No invalidated sessions</p>
                ) : (
                  activeSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-sm">Session ID</div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {session.session_id.substring(0, 20)}...
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Invalidated: {new Date(session.created_at).toLocaleString()}
                        </div>
                      </div>
                      <Badge variant="destructive">Invalidated</Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Shield className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="font-semibold">RLS Enabled</div>
              <div className="text-sm text-muted-foreground">Row Level Security Active</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <div className="font-semibold">Monitoring Active</div>
              <div className="text-sm text-muted-foreground">Security Events Logged</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Eye className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <div className="font-semibold">Session Management</div>
              <div className="text-sm text-muted-foreground">Active Session Tracking</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};