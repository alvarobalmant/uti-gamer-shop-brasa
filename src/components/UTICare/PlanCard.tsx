import React from 'react';
import { motion } from 'framer-motion';
import { Check, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  icon: LucideIcon;
  popular: boolean;
  color: string;
}

interface PlanCardProps {
  plan: Plan;
  onSelect: () => void;
  delay?: number;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onSelect, delay = 0 }) => {
  const Icon = plan.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={cn(
        "relative p-6 rounded-2xl bg-card border transition-all duration-300 hover:scale-105",
        plan.popular 
          ? "border-primary shadow-lg shadow-primary/20" 
          : "border-border hover:border-primary/50"
      )}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
            Mais Popular
          </span>
        </div>
      )}

      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br",
        plan.color
      )}>
        <Icon className="w-6 h-6 text-white" />
      </div>

      <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
      <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

      <div className="mb-6">
        <span className="text-4xl font-bold">
          R$ {plan.price.toFixed(2).replace('.', ',')}
        </span>
        <span className="text-muted-foreground">/mês</span>
      </div>

      <ul className="space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button 
        className="w-full" 
        variant={plan.popular ? "default" : "outline"}
        onClick={onSelect}
      >
        Selecionar Plano
      </Button>
    </motion.div>
  );
};

export default PlanCard;
