import React from 'react';
import { ShieldCheck, Clock, AlertCircle, Mail } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useMetaTags } from '@/hooks/useMetaTags';

const PoliticaTrocas: React.FC = () => {
  useMetaTags({
    title: 'Política de Trocas e Devoluções - UTI DOS GAMES',
    description: 'Conheça nossa política de trocas, devoluções e garantia. Seus direitos garantidos pelo Código de Defesa do Consumidor.',
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-0 lg:pt-[72px]">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/20 via-background to-background py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Política de Trocas e Devoluções</h1>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto">
              Seus direitos garantidos pelo Código de Defesa do Consumidor
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-card border rounded-lg p-6 text-center">
                <Clock className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-bold mb-2">7 Dias</h3>
                <p className="text-sm text-muted-foreground">Direito de arrependimento</p>
              </div>
              <div className="bg-card border rounded-lg p-6 text-center">
                <ShieldCheck className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-bold mb-2">12 Meses</h3>
                <p className="text-sm text-muted-foreground">Garantia total</p>
              </div>
              <div className="bg-card border rounded-lg p-6 text-center">
                <Mail className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-bold mb-2">Suporte</h3>
                <p className="text-sm text-muted-foreground">trocas@utidosgames.com.br</p>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-8">
              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-primary">1. Direito de Arrependimento (7 dias)</h2>
                <p className="text-muted-foreground mb-4">
                  Conforme o Código de Defesa do Consumidor (Art. 49), você tem o direito de desistir da compra em até 7 dias corridos após o recebimento do produto, sem necessidade de justificativa.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>O produto deve estar em sua embalagem original, lacrado e sem sinais de uso</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Todos os acessórios, manuais e brindes devem estar inclusos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>O frete de devolução fica por conta do cliente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>O reembolso será feito em até 2 ciclos de faturamento (cartão) ou 5 dias úteis (PIX)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-primary">2. Produtos com Defeito</h2>
                <p className="text-muted-foreground mb-4">
                  Se o produto apresentar defeito de fabricação ou dano no transporte, você tem os seguintes prazos:
                </p>
                <ul className="space-y-2 text-muted-foreground mb-4">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>30 dias</strong> para produtos não duráveis (jogos, acessórios simples)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>90 dias</strong> para produtos duráveis (consoles, headsets, cadeiras gamer)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>12 meses</strong> de garantia total (3 meses legal + 9 meses do fabricante)</span>
                  </li>
                </ul>
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm">
                    <strong>Atenção:</strong> Para defeitos identificados no recebimento, abra a solicitação imediatamente. 
                    Tire fotos ou grave vídeo do produto com defeito e da embalagem.
                  </p>
                </div>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-primary">3. Produtos que NÃO podem ser trocados</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                    <span><strong>Jogos digitais e códigos:</strong> Após o envio do código por email, a troca não é possível (produto consumível)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                    <span><strong>Produtos lacrados abertos:</strong> Jogos, acessórios e consoles com lacre rompido (exceto em caso de defeito)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                    <span><strong>Produtos de higiene pessoal usados:</strong> Fones de ouvido, headsets, mousepads (exceto defeito)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                    <span><strong>Produtos personalizados:</strong> Itens feitos sob encomenda conforme especificação do cliente</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-primary">4. Como Solicitar Troca ou Devolução</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Passo 1: Entre em contato</h3>
                    <p className="text-muted-foreground">
                      Envie um email para <strong>trocas@utidosgames.com.br</strong> ou WhatsApp <strong>(27) 99999-9999</strong> informando:
                    </p>
                    <ul className="mt-2 ml-6 space-y-1 text-muted-foreground text-sm">
                      <li>• Número do pedido</li>
                      <li>• Nome completo</li>
                      <li>• CPF</li>
                      <li>• Motivo da troca/devolução</li>
                      <li>• Fotos do produto (se houver defeito)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Passo 2: Aguarde análise</h3>
                    <p className="text-muted-foreground">
                      Nossa equipe analisará sua solicitação em até <strong>5 dias úteis</strong> e enviará as instruções de devolução.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Passo 3: Envie o produto</h3>
                    <p className="text-muted-foreground">
                      Embale bem o produto com a nota fiscal e envie para o endereço que forneceremos. 
                      Guarde o código de rastreamento.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Passo 4: Receba reembolso ou produto novo</h3>
                    <p className="text-muted-foreground">
                      Após recebermos e analisarmos o produto (até 5 dias úteis), você receberá:
                    </p>
                    <ul className="mt-2 ml-6 space-y-1 text-muted-foreground text-sm">
                      <li>• <strong>Reembolso:</strong> Em até 2 ciclos de faturamento (cartão) ou 5 dias úteis (PIX)</li>
                      <li>• <strong>Troca:</strong> Envio imediato de produto novo (frete grátis)</li>
                      <li>• <strong>Crédito na loja:</strong> Valor disponível imediatamente na sua conta</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-primary">5. Reembolso</h2>
                <p className="text-muted-foreground mb-4">
                  Você pode escolher a forma de reembolso:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Estorno no Cartão</h3>
                    <p className="text-sm text-muted-foreground">Até 2 ciclos de faturamento</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">PIX</h3>
                    <p className="text-sm text-muted-foreground">Até 5 dias úteis</p>
                  </div>
                  <div className="border rounded-lg p-4 border-primary">
                    <h3 className="font-semibold mb-2">Crédito na Loja</h3>
                    <p className="text-sm text-muted-foreground">Imediato + 5% bônus</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-primary">6. Contato</h2>
                <p className="text-muted-foreground mb-4">
                  Para dúvidas ou solicitações de troca/devolução:
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Email:</strong> trocas@utidosgames.com.br</p>
                  <p><strong>WhatsApp:</strong> (27) 99999-9999</p>
                  <p><strong>Telefone:</strong> (27) 3722-0000</p>
                  <p><strong>Horário:</strong> Segunda a Sexta: 9h às 18h | Sábado: 9h às 13h</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PoliticaTrocas;
