
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogClose } from "@/components/ui/dialog";
import { AlertCircle } from 'lucide-react';

const ProductModalNotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6 h-full">
      <AlertCircle className="w-16 h-16 text-destructive mb-4" />
      <h2 className="text-2xl font-bold text-foreground mb-2">Produto Não Encontrado</h2>
      <p className="text-muted-foreground mb-6">Não conseguimos encontrar os detalhes deste produto.</p>
      <DialogClose asChild>
         <Button variant="outline">Fechar</Button>
      </DialogClose>
    </div>
  );
};

export default ProductModalNotFound;
