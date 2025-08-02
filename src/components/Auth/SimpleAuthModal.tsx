import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LogIn, UserPlus, X } from 'lucide-react';

interface SimpleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SimpleAuthModal = ({ isOpen, onClose }: SimpleAuthModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();

  // Auto-close when user logs in
  useEffect(() => {
    if (user && isOpen) {
      console.log('[AUTH MODAL] User detected, auto-closing modal');
      onClose();
    }
  }, [user, isOpen, onClose]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signIn(email, password);
      setEmail('');
      setPassword('');
      onClose();
    } catch (error) {
      console.error('[AUTH MODAL] Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signUp(email, password, name);
      setEmail('');
      setPassword('');
      setName('');
      onClose();
    } catch (error) {
      console.error('[AUTH MODAL] Signup failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border text-foreground max-w-md shadow-2xl">
        <DialogHeader className="text-center relative">
          <Button
            variant="ghost"
            onClick={onClose}
            className="absolute -right-2 -top-2 text-muted-foreground hover:text-primary w-8 h-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="/lovable-uploads/a514a032-d79a-4bc4-a10e-3c9f0f9cde73.png" 
              alt="UTI DOS GAMES" 
              className="w-16 h-16 object-contain"
            />
            <div>
              <DialogTitle className="text-2xl font-bold text-primary">
                UTI DOS GAMES
              </DialogTitle>
              <p className="text-sm text-muted-foreground">Faça login em sua conta</p>
            </div>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted rounded-lg p-1">
            <TabsTrigger 
              value="login" 
              className="text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium rounded-md transition-all duration-200"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Entrar
            </TabsTrigger>
            <TabsTrigger 
              value="signup" 
              className="text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium rounded-md transition-all duration-200"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Cadastrar
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="mt-6">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-foreground font-medium">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-border focus:border-primary rounded-lg h-12"
                  placeholder="seu@email.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-foreground font-medium">Senha</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-border focus:border-primary rounded-lg h-12"
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 h-12 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup" className="mt-6">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-foreground font-medium">Nome completo</Label>
                <Input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-border focus:border-primary rounded-lg h-12"
                  placeholder="Seu nome completo"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-foreground font-medium">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-border focus:border-primary rounded-lg h-12"
                  placeholder="seu@email.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-foreground font-medium">Senha</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-border focus:border-primary rounded-lg h-12"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 h-12 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
              >
                {loading ? "Criando conta..." : "Criar conta"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        
        <div className="text-center text-sm text-muted-foreground mt-4 pt-4 border-t border-border">
          <p>Ao fazer login, você concorda com nossos termos de uso.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};