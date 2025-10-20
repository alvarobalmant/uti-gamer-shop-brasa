import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useMetaTags } from '@/hooks/useMetaTags';

const contactSchema = z.object({
  name: z.string().trim().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100),
  email: z.string().trim().email('Email inválido').max(255),
  subject: z.string().min(1, 'Selecione um assunto'),
  message: z.string().trim().min(10, 'Mensagem deve ter pelo menos 10 caracteres').max(1000),
});

type ContactFormData = z.infer<typeof contactSchema>;

const FaleConosco: React.FC = () => {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  useMetaTags({
    title: 'Fale Conosco - UTI DOS GAMES',
    description: 'Entre em contato conosco. Estamos prontos para ajudar você com dúvidas, sugestões ou problemas.',
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Aqui integraria com edge function para enviar email
      console.log('Formulário enviado:', data);
      toast({
        title: 'Mensagem enviada!',
        description: 'Entraremos em contato em breve.',
      });
      reset();
    } catch (error) {
      toast({
        title: 'Erro ao enviar',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    }
  };

  const whatsappNumber = '5527999999999';
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-0 lg:pt-[72px]">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/20 via-background to-background py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Fale Conosco</h1>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto">
              Estamos aqui para ajudar! Entre em contato através de um dos nossos canais ou preencha o formulário abaixo.
            </p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors">
                <MessageSquare className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">WhatsApp</h3>
                <p className="text-sm text-muted-foreground">(27) 99999-9999</p>
              </a>
              
              <div className="bg-card border rounded-lg p-6">
                <Mail className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-sm text-muted-foreground">contato@utidosgames.com.br</p>
              </div>
              
              <div className="bg-card border rounded-lg p-6">
                <Phone className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Telefone</h3>
                <p className="text-sm text-muted-foreground">(27) 3722-0000</p>
              </div>
              
              <div className="bg-card border rounded-lg p-6">
                <Clock className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Horário</h3>
                <p className="text-sm text-muted-foreground">Seg-Sex: 9h-18h</p>
                <p className="text-sm text-muted-foreground">Sáb: 9h-13h</p>
              </div>
            </div>

            {/* Address */}
            <div className="bg-card border rounded-lg p-6 mb-12">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Endereço</h3>
                  <p className="text-sm text-muted-foreground">
                    R. Alexandre Calmon, 314 - Centro<br />
                    Colatina - ES, 29700-040
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-card border rounded-lg p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6">Envie sua mensagem</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome completo</label>
                    <Input {...register('name')} placeholder="Seu nome" />
                    {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input {...register('email')} type="email" placeholder="seu@email.com" />
                    {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Assunto</label>
                    <Select onValueChange={(value) => setValue('subject', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o assunto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="duvida">Dúvida sobre produto</SelectItem>
                        <SelectItem value="pedido">Problema com pedido</SelectItem>
                        <SelectItem value="sugestao">Sugestão</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.subject && <p className="text-destructive text-sm mt-1">{errors.subject.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Mensagem</label>
                    <Textarea {...register('message')} placeholder="Escreva sua mensagem aqui..." rows={6} />
                    {errors.message && <p className="text-destructive text-sm mt-1">{errors.message.message}</p>}
                  </div>

                  <Button type="submit" className="w-full">Enviar mensagem</Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FaleConosco;
