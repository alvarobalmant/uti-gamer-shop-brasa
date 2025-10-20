import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useMetaTags } from '@/hooks/useMetaTags';

const FAQ: React.FC = () => {
  useMetaTags({
    title: 'Perguntas Frequentes - UTI DOS GAMES',
    description: 'Tire suas dúvidas sobre compras, entregas, UTI Coins, UTI PRO e muito mais.',
  });

  const faqSections = [
    {
      title: 'Sobre Compras',
      items: [
        {
          question: 'Como faço meu primeiro pedido?',
          answer: 'Navegue pelo site, adicione produtos ao carrinho e clique em "Finalizar Compra". Você será direcionado para criar uma conta ou fazer login, depois preencha os dados de entrega e pagamento.',
        },
        {
          question: 'Quais formas de pagamento são aceitas?',
          answer: 'Aceitamos cartões de crédito (Visa, Mastercard, Elo, American Express), PIX, e boleto bancário. Você também pode usar seus UTI Coins para pagar parte ou todo o valor da compra.',
        },
        {
          question: 'Posso parcelar minhas compras?',
          answer: 'Sim! Parcele em até 10x sem juros no cartão de crédito para compras acima de R$ 100. Membros UTI PRO têm parcelamento em até 12x sem juros.',
        },
        {
          question: 'Como acompanho meu pedido?',
          answer: 'Acesse "Meus Pedidos" na sua conta. Você receberá emails com atualizações e o código de rastreamento após o envio.',
        },
        {
          question: 'Vocês vendem produtos importados?',
          answer: 'Sim, trabalhamos com produtos nacionais e importados. Os produtos importados são identificados com um selo especial e podem ter prazo de entrega diferenciado.',
        },
      ],
    },
    {
      title: 'Entrega',
      items: [
        {
          question: 'Qual o prazo de entrega?',
          answer: 'O prazo varia conforme sua região e o produto escolhido. Para o Espírito Santo, geralmente é de 2 a 5 dias úteis. Para outras regiões, de 5 a 15 dias úteis. O prazo exato é informado no carrinho.',
        },
        {
          question: 'Como calcular o frete?',
          answer: 'Adicione produtos ao carrinho e insira seu CEP. O valor e prazo serão calculados automaticamente antes de finalizar a compra.',
        },
        {
          question: 'Vocês entregam em todo o Brasil?',
          answer: 'Sim, entregamos para todo o território nacional através de parceiros como Correios, Jadlog e transportadoras regionais.',
        },
        {
          question: 'O que fazer se meu pedido não chegou no prazo?',
          answer: 'Entre em contato conosco através do WhatsApp ou email com o número do pedido. Vamos verificar junto à transportadora e resolver o problema o mais rápido possível.',
        },
      ],
    },
    {
      title: 'UTI Coins',
      items: [
        {
          question: 'O que são UTI Coins?',
          answer: 'UTI Coins é nosso programa de cashback. A cada compra, você acumula coins que podem ser usados como desconto em futuras compras. 100 coins = R$ 1,00.',
        },
        {
          question: 'Como ganhar UTI Coins?',
          answer: 'Você ganha coins em toda compra aprovada. A porcentagem varia por produto (geralmente 2% a 5%). Membros UTI PRO ganham o dobro de coins. Os coins são creditados após a entrega do pedido.',
        },
        {
          question: 'Como usar meus coins?',
          answer: 'No checkout, você verá a opção "Usar UTI Coins". Escolha quantos coins quer usar (mínimo 500 coins = R$ 5). Você pode usar até 50% do valor da compra com coins.',
        },
        {
          question: 'UTI Coins têm validade?',
          answer: 'Sim, os coins expiram após 12 meses da data em que foram creditados. Você pode acompanhar a validade dos seus coins na aba "Meus Coins".',
        },
        {
          question: 'Posso transferir coins para outra pessoa?',
          answer: 'Não, os UTI Coins são pessoais e intransferíveis. Cada conta tem seu próprio saldo de coins.',
        },
      ],
    },
    {
      title: 'UTI PRO',
      items: [
        {
          question: 'O que é o UTI PRO?',
          answer: 'UTI PRO é nosso programa de assinatura mensal que oferece benefícios exclusivos como frete grátis ilimitado, cashback em dobro, descontos especiais e acesso antecipado a lançamentos.',
        },
        {
          question: 'Quais os benefícios?',
          answer: '• Frete grátis em todo Brasil\n• Cashback em dobro (até 10%)\n• Descontos exclusivos de até 15%\n• Acesso antecipado a lançamentos\n• Parcelamento em até 12x sem juros\n• Suporte prioritário',
        },
        {
          question: 'Como cancelar minha assinatura?',
          answer: 'Você pode cancelar a qualquer momento em "Minha Conta > UTI PRO > Cancelar Assinatura". O acesso aos benefícios continua até o fim do período pago.',
        },
        {
          question: 'O desconto vale para tudo?',
          answer: 'Os descontos exclusivos são válidos para produtos selecionados, marcados com o selo "UTI PRO". Frete grátis e cashback em dobro valem para todos os produtos.',
        },
      ],
    },
    {
      title: 'Produtos',
      items: [
        {
          question: 'Os jogos são originais?',
          answer: 'Sim, trabalhamos apenas com produtos 100% originais de distribuidores autorizados. Todos os jogos têm garantia e selo de autenticidade.',
        },
        {
          question: 'Vocês trabalham com jogos digitais?',
          answer: 'Sim, vendemos gift cards e códigos digitais para PlayStation, Xbox e Nintendo. Após a compra aprovada, você recebe o código por email em até 2 horas.',
        },
        {
          question: 'Posso reservar lançamentos?',
          answer: 'Sim! Lançamentos podem ser pré-encomendados. Você paga apenas quando o jogo for despachado, e garantimos a entrega no dia do lançamento ou próximo a ele.',
        },
        {
          question: 'Fazem manutenção de consoles?',
          answer: 'No momento não oferecemos serviço de manutenção, apenas vendemos consoles, jogos e acessórios novos.',
        },
      ],
    },
    {
      title: 'Garantia e Trocas',
      items: [
        {
          question: 'Qual o prazo de garantia?',
          answer: 'Todos os produtos têm garantia de 3 meses (legal) + 9 meses (fabricante) = 12 meses. Consoles e acessórios podem ter garantia estendida oferecida pelos fabricantes.',
        },
        {
          question: 'Como solicitar troca?',
          answer: 'Acesse "Política de Trocas" no rodapé do site ou entre em contato pelo email trocas@utidosgames.com.br informando o número do pedido e motivo da troca.',
        },
        {
          question: 'Produto com defeito, o que fazer?',
          answer: 'Entre em contato imediatamente pelo WhatsApp ou email com fotos/vídeo do defeito. Analisaremos e providenciaremos a troca ou reparo dentro do prazo legal (até 30 dias).',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-0 lg:pt-[72px]">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/20 via-background to-background py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Perguntas Frequentes</h1>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto">
              Encontre respostas rápidas para as dúvidas mais comuns. Não encontrou o que procura? Entre em contato conosco!
            </p>
          </div>
        </section>

        {/* FAQ Sections */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            {faqSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-primary">{section.title}</h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <AccordionItem 
                      key={itemIndex} 
                      value={`${sectionIndex}-${itemIndex}`}
                      className="bg-card border rounded-lg px-6"
                    >
                      <AccordionTrigger className="hover:no-underline">
                        <span className="text-left font-semibold">{item.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground whitespace-pre-line">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
