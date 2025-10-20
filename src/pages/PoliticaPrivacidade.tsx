import React from 'react';
import { Shield, Lock, Eye, UserCheck, Database, FileText } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useMetaTags } from '@/hooks/useMetaTags';

const PoliticaPrivacidade: React.FC = () => {
  useMetaTags({
    title: 'Política de Privacidade - UTI DOS GAMES',
    description: 'Conheça como protegemos seus dados pessoais. Política em conformidade com a LGPD (Lei Geral de Proteção de Dados).',
  });

  const updateDate = '15 de Janeiro de 2025';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/20 via-background to-background py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Política de Privacidade</h1>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto">
              Seu compromisso conosco é importante. Veja como protegemos seus dados pessoais.
            </p>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Última atualização: {updateDate}
            </p>
          </div>
        </section>

        {/* Key Points */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-card border rounded-lg p-6 text-center">
                <Lock className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-bold mb-2">Dados Criptografados</h3>
                <p className="text-sm text-muted-foreground">SSL/TLS em todas as transações</p>
              </div>
              <div className="bg-card border rounded-lg p-6 text-center">
                <Shield className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-bold mb-2">LGPD</h3>
                <p className="text-sm text-muted-foreground">100% em conformidade</p>
              </div>
              <div className="bg-card border rounded-lg p-6 text-center">
                <Eye className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-bold mb-2">Transparência</h3>
                <p className="text-sm text-muted-foreground">Nunca vendemos seus dados</p>
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-8">
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h2 className="text-2xl font-bold text-primary">1. Introdução</h2>
                  </div>
                </div>
                <p className="text-muted-foreground mb-3">
                  A <strong>UTI DOS GAMES LTDA</strong> (CNPJ: 16.811.173/0001-20), com sede na R. Alexandre Calmon, 314 - Centro, Colatina - ES, 
                  é a controladora dos dados pessoais coletados através do site utidosgames.com.br.
                </p>
                <p className="text-muted-foreground">
                  Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais, 
                  em total conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018)</strong>.
                </p>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Database className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h2 className="text-2xl font-bold text-primary">2. Dados Coletados</h2>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">2.1. Dados de Cadastro</h3>
                    <ul className="space-y-1 text-muted-foreground text-sm ml-6">
                      <li>• Nome completo</li>
                      <li>• CPF</li>
                      <li>• Email</li>
                      <li>• Telefone/Celular</li>
                      <li>• Data de nascimento</li>
                      <li>• Gênero (opcional)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">2.2. Dados de Entrega</h3>
                    <ul className="space-y-1 text-muted-foreground text-sm ml-6">
                      <li>• Endereço completo (rua, número, complemento, bairro, cidade, estado, CEP)</li>
                      <li>• Ponto de referência (opcional)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">2.3. Dados de Pagamento</h3>
                    <ul className="space-y-1 text-muted-foreground text-sm ml-6">
                      <li>• Informações de cartão de crédito (criptografadas por nossos parceiros de pagamento)</li>
                      <li>• Histórico de compras e transações</li>
                      <li>• Nota: NÃO armazenamos dados completos de cartão em nossos servidores</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">2.4. Dados de Navegação</h3>
                    <ul className="space-y-1 text-muted-foreground text-sm ml-6">
                      <li>• Endereço IP</li>
                      <li>• Tipo de navegador e dispositivo</li>
                      <li>• Páginas visitadas e tempo de permanência</li>
                      <li>• Produtos visualizados e adicionados ao carrinho</li>
                      <li>• Cookies e tecnologias similares</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">2.5. Dados do Programa UTI Coins e UTI PRO</h3>
                    <ul className="space-y-1 text-muted-foreground text-sm ml-6">
                      <li>• Saldo de UTI Coins</li>
                      <li>• Histórico de acúmulo e uso de coins</li>
                      <li>• Status de assinatura UTI PRO</li>
                      <li>• Histórico de pagamentos da assinatura</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-primary">3. Finalidade do Uso dos Dados</h2>
                <p className="text-muted-foreground mb-3">Utilizamos seus dados pessoais para:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Processar e entregar seus pedidos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Comunicar sobre o status dos pedidos (confirmação, envio, entrega)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Enviar ofertas personalizadas e newsletters (você pode cancelar a qualquer momento)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Melhorar a experiência de navegação através de análise de comportamento</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Gerenciar o programa UTI Coins e assinatura UTI PRO</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Cumprir obrigações legais e fiscais (emissão de notas fiscais, declarações)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Prevenir fraudes e garantir a segurança das transações</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Prestar suporte ao cliente</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-primary">4. Compartilhamento de Dados</h2>
                <p className="text-muted-foreground mb-3">Seus dados podem ser compartilhados com:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Parceiros de pagamento:</strong> PagSeguro, Mercado Pago, operadoras de cartão (somente dados necessários para processamento)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Transportadoras:</strong> Correios, Jadlog e outras (somente nome e endereço de entrega)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Serviços de analytics:</strong> Google Analytics (dados anonimizados de navegação)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Autoridades competentes:</strong> Quando exigido por lei ou ordem judicial</span>
                  </li>
                </ul>
                <div className="mt-4 bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <p className="font-semibold text-sm">
                    <strong>IMPORTANTE:</strong> Nunca vendemos, alugamos ou comercializamos seus dados pessoais para terceiros com fins de marketing.
                  </p>
                </div>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <UserCheck className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h2 className="text-2xl font-bold text-primary">5. Seus Direitos (LGPD)</h2>
                  </div>
                </div>
                <p className="text-muted-foreground mb-3">Conforme a LGPD, você tem os seguintes direitos:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span><strong>Confirmação:</strong> Saber se tratamos seus dados pessoais</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span><strong>Acesso:</strong> Receber cópia de todos os dados que temos sobre você</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span><strong>Correção:</strong> Atualizar dados incompletos, incorretos ou desatualizados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span><strong>Anonimização:</strong> Solicitar que seus dados sejam anonimizados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span><strong>Bloqueio ou eliminação:</strong> Excluir dados desnecessários ou tratados incorretamente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span><strong>Portabilidade:</strong> Transferir seus dados para outro fornecedor</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span><strong>Revogação:</strong> Cancelar o consentimento a qualquer momento</span>
                  </li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  <strong>Como exercer seus direitos:</strong> Envie um email para <strong>privacidade@utidosgames.com.br</strong> 
                  com seu nome completo, CPF e solicitação detalhada. Responderemos em até 15 dias.
                </p>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Lock className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h2 className="text-2xl font-bold text-primary">6. Segurança dos Dados</h2>
                  </div>
                </div>
                <p className="text-muted-foreground mb-3">Implementamos as seguintes medidas de segurança:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">🔒</span>
                    <span>Criptografia SSL/TLS em todas as páginas e transações</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">🔒</span>
                    <span>Armazenamento em servidores seguros com firewall e proteção DDoS</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">🔒</span>
                    <span>Acesso restrito a dados pessoais apenas para colaboradores autorizados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">🔒</span>
                    <span>Senhas criptografadas com hash irreversível</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">🔒</span>
                    <span>Auditorias periódicas de segurança</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">🔒</span>
                    <span>Monitoramento contínuo de atividades suspeitas</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-primary">7. Cookies</h2>
                <p className="text-muted-foreground mb-3">Utilizamos cookies para melhorar sua experiência. Tipos de cookies:</p>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold mb-1">Cookies Essenciais</h3>
                    <p className="text-sm text-muted-foreground">Necessários para o funcionamento do site (carrinho de compras, login)</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Cookies de Desempenho</h3>
                    <p className="text-sm text-muted-foreground">Coletam informações sobre como você usa o site (Google Analytics)</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Cookies de Funcionalidade</h3>
                    <p className="text-sm text-muted-foreground">Lembram suas preferências (tema escuro/claro, idioma)</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Cookies de Marketing</h3>
                    <p className="text-sm text-muted-foreground">Rastreiam suas visitas para oferecer anúncios relevantes</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Você pode desabilitar cookies nas configurações do navegador, mas isso pode afetar a funcionalidade do site.
                </p>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-primary">8. Retenção de Dados</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Dados de cadastro e compras:</strong> Enquanto a conta estiver ativa + 5 anos (obrigações fiscais)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Dados de navegação:</strong> 12 meses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Cookies:</strong> Conforme configurado (geralmente 12 meses)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Você pode solicitar a exclusão de sua conta a qualquer momento em Minha Conta - Excluir Conta</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-primary">9. Alterações nesta Política</h2>
                <p className="text-muted-foreground">
                  Reservamos o direito de atualizar esta Política de Privacidade a qualquer momento. Mudanças relevantes serão 
                  comunicadas por email ou aviso no site. A data da última atualização sempre estará no topo desta página.
                </p>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-primary">10. Contato - Encarregado de Dados (DPO)</h2>
                <p className="text-muted-foreground mb-4">
                  Para dúvidas, solicitações ou exercício de direitos relacionados aos seus dados pessoais, entre em contato com nosso 
                  Encarregado de Proteção de Dados (DPO):
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Email:</strong> privacidade@utidosgames.com.br</p>
                  <p><strong>Endereço:</strong> R. Alexandre Calmon, 314 - Centro, Colatina - ES, 29700-040</p>
                  <p><strong>Prazo de resposta:</strong> Até 15 dias úteis</p>
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

export default PoliticaPrivacidade;
