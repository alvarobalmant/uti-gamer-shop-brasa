import React, { useState, useEffect } from 'react';
import { Clock, Truck, MapPin } from 'lucide-react';

interface DynamicDeliveryMobileProps {
  productPrice: number;
}

const DynamicDeliveryMobile: React.FC<DynamicDeliveryMobileProps> = ({ 
  productPrice 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeMessage, setTimeMessage] = useState('');
  const [deliveryMessage, setDeliveryMessage] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [isEligible, setIsEligible] = useState(false);

  // Atualizar horário a cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    setCurrentTime(new Date());
    return () => clearInterval(timer);
  }, []);

  // Calcular mensagens baseadas no horário de Colatina-ES
  useEffect(() => {
    const colatinaTime = new Date();
    const hours = colatinaTime.getHours();
    const minutes = colatinaTime.getMinutes();
    const dayOfWeek = colatinaTime.getDay(); // 0 = Domingo, 1 = Segunda, ..., 5 = Sexta, 6 = Sábado
    
    // Verificar se é elegível para frete grátis
    const eligible = productPrice >= 150;
    setIsEligible(eligible);

    // Calcular tempo até 16h
    const cutoffHour = 16;
    const cutoffMinute = 0;
    
    let hoursLeft = cutoffHour - hours;
    let minutesLeft = cutoffMinute - minutes;
    
    if (minutesLeft < 0) {
      hoursLeft -= 1;
      minutesLeft += 60;
    }

    // Calcular datas de entrega
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    // Calcular segunda-feira para sexta após 16h
    const monday = new Date(today);
    const daysUntilMonday = (8 - today.getDay()) % 7 || 7; // Se hoje é domingo, será 1, se é segunda será 7
    monday.setDate(today.getDate() + daysUntilMonday);
    
    const formatDate = (date: Date) => {
      const day = date.getDate();
      const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 
                     'jul', 'ago', 'set', 'out', 'nov', 'dez'];
      const month = months[date.getMonth()];
      return `${day}/${month}`;
    };

    // Determinar mensagem de entrega e tempo baseado no dia da semana
    if (hours >= cutoffHour) {
      // Após 16h
      if (dayOfWeek === 5) {
        // Sexta-feira após 16h - entrega segunda-feira
        setDeliveryMessage('Chegará grátis na segunda-feira');
        setDeliveryDate(`${formatDate(monday)}`);
        setTimeMessage('');
      } else {
        // Outros dias após 16h - entrega amanhã
        setDeliveryMessage('Chegará grátis amanhã');
        setDeliveryDate(`${formatDate(tomorrow)}`);
        setTimeMessage('');
      }
    } else {
      // Antes das 16h - entrega hoje
      setDeliveryMessage('Chegará grátis hoje');
      setDeliveryDate(`${formatDate(today)}`);
      
      // Calcular mensagem de tempo
      const totalMinutesLeft = hoursLeft * 60 + minutesLeft;
      
      if (totalMinutesLeft > 60) {
        setTimeMessage(`Comprando em ${hoursLeft} ${hoursLeft === 1 ? 'hora' : 'horas'}`);
      } else if (totalMinutesLeft > 10) {
        const roundedMinutes = Math.ceil(totalMinutesLeft / 10) * 10;
        setTimeMessage(`Comprando em ${roundedMinutes} minutos`);
      } else if (totalMinutesLeft > 0) {
        setTimeMessage(`Comprando em ${totalMinutesLeft} ${totalMinutesLeft === 1 ? 'minuto' : 'minutos'}`);
      } else {
        setTimeMessage('');
      }
    }
  }, [currentTime, productPrice]);

  if (!isEligible) {
    // Determinar se entrega é hoje, amanhã ou segunda baseado no horário e dia
    const currentHour = new Date().getHours();
    const currentDay = new Date().getDay();
    const cutoffHour = 16;
    
    let deliveryTimeMessage = '';
    
    if (currentHour >= cutoffHour) {
      // Após 16h
      if (currentDay === 5) {
        // Sexta-feira após 16h
        deliveryTimeMessage = 'Entrega segunda-feira para Colatina-ES';
      } else {
        // Outros dias após 16h
        deliveryTimeMessage = 'Entrega amanhã para Colatina-ES';
      }
    } else {
      // Antes das 16h
      deliveryTimeMessage = 'Entrega hoje para Colatina-ES';
    }
    
    return (
      <div className="border border-gray-200 rounded-lg p-4 mb-3">
        <div className="flex items-center gap-2 text-orange-600 mb-2">
          <Truck className="w-4 h-4" />
          <span className="text-sm font-medium">Frete grátis acima de R$ 150</span>
        </div>
        <div className="text-sm text-gray-700 mb-1">
          Adicione mais R$ {(150 - productPrice).toFixed(2).replace('.', ',')} para frete grátis
        </div>
        <div className="text-sm text-gray-600 mb-2 flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {deliveryTimeMessage}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-3">
      <div className="flex items-center gap-2 text-green-700 mb-2">
        <Truck className="w-4 h-4" />
        <span className="text-sm font-medium">{deliveryMessage}</span>
      </div>
      
      {timeMessage && (
        <div className="text-sm text-orange-600 mb-1 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {timeMessage}
        </div>
      )}
      
      <div className="text-sm text-gray-600 mb-2 flex items-center gap-1">
        <MapPin className="w-3 h-3" />
        Colatina-ES • Pedidos até 16h
      </div>
    </div>
  );
};

export default DynamicDeliveryMobile;

