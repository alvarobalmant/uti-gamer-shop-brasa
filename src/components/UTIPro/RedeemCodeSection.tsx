
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useProCodes } from '@/hooks/useProCodes';
import { useAuth } from '@/hooks/useAuth';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { openWhatsApp } from '@/utils/whatsapp';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const RedeemCodeSection = () => {
  const [code, setCode] = useState('');
  const [redeemStatus, setRedeemStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { redeemCode, redeemingCode } = useProCodes();
  const { user } = useAuth();
  const { refetch } = useSubscriptions();

  const handleRedeem = async () => {
    if (!code.trim()) return;
    
    const success = await redeemCode(code.trim());
    setRedeemStatus(success ? 'success' : 'error');
    
    if (success) {
      // Atualizar dados da assinatura
      await refetch();
      
      // Reset após 5 segundos
      setTimeout(() => {
        setRedeemStatus('idle');
        setCode('');
      }, 5000);
    }
  };

  const handleWhatsAppRedirect = () => {
    openWhatsApp({
      phone: "5511999999999", // Substitua pelo número real
      message: "Olá! Gostaria de adquirir um código UTI PRO."
    });
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-uti-dark to-black">
      <div className="container-professional px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-8 items-center"
        >
          {/* Comprar Código */}
          <Card className="bg-gray-800/60 border-gray-700 shadow-xl h-full">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl text-white">Adquira seu código UTI PRO</CardTitle>
              <CardDescription className="text-white/70">
                Entre em contato via WhatsApp para adquirir seu código de assinatura UTI PRO.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/80 text-sm">
                Ao clicar no botão abaixo, você será redirecionado para o WhatsApp da UTI DOS GAMES para finalizar sua compra.
              </p>
              <p className="text-white/80 text-sm">
                Após o pagamento, você receberá um código exclusivo para ativar sua assinatura UTI PRO.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleWhatsAppRedirect}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 md:py-3"
                aria-label="Comprar código UTI PRO via WhatsApp"
              >
                Comprar via WhatsApp
              </Button>
            </CardFooter>
          </Card>

          {/* Resgatar Código */}
          <Card className="bg-gray-800/60 border-gray-700 shadow-xl h-full">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl text-white">Resgate seu código</CardTitle>
              <CardDescription className="text-white/70">
                Já possui um código UTI PRO? Resgate-o aqui para ativar sua assinatura.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="pro-code" className="sr-only">Código UTI PRO</label>
                <Input
                  id="pro-code"
                  placeholder="Digite seu código (ex: UTI-XXXX-XXXX-XXXX)"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 h-12"
                  disabled={redeemingCode || redeemStatus === 'success' || !user}
                  aria-describedby={!user ? "login-required-message" : undefined}
                />
                {!user && (
                  <p id="login-required-message" className="text-amber-400 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" aria-hidden="true" />
                    Você precisa estar logado para resgatar um código
                  </p>
                )}
              </div>

              {redeemStatus === 'success' && (
                <div className="bg-green-600/20 border border-green-500/30 rounded-md p-3 flex items-center gap-2" role="alert">
                  <Check className="text-green-500 w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  <p className="text-green-100 text-sm">Código resgatado com sucesso! Sua assinatura UTI PRO está ativa.</p>
                </div>
              )}

              {redeemStatus === 'error' && (
                <div className="bg-red-600/20 border border-red-500/30 rounded-md p-3 flex items-center gap-2" role="alert">
                  <AlertCircle className="text-red-500 w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  <p className="text-red-100 text-sm">Código inválido ou já utilizado. Verifique e tente novamente.</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleRedeem}
                disabled={!code.trim() || redeemingCode || redeemStatus === 'success' || !user}
                className="w-full bg-uti-red hover:bg-uti-red/90 text-white font-bold py-6 md:py-3"
                aria-label="Resgatar código UTI PRO"
              >
                {redeemingCode ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                    <span>Verificando...</span>
                  </>
                ) : (
                  'Resgatar Código'
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default RedeemCodeSection;
