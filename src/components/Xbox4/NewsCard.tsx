
import React from 'react';
import { motion } from 'framer-motion';
import { Play, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface NewsItem {
  id: number;
  type: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
}

interface NewsCardProps {
  item: NewsItem;
  index: number;
}

const NewsCard = ({ item, index }: NewsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -15, scale: 0.98 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.05, 
        ease: "easeOut" 
      }}
      whileHover={{ 
        scale: 1.02,
        rotateY: 1,
        boxShadow: "0 0 25px -5px rgba(16, 124, 16, 0.7), 0 0 12px -8px rgba(16, 124, 16, 0.5)",
        borderColor: "#107C10",
        transition: { 
          duration: 0.15, 
          ease: "easeOut" 
        }
      }}
      className="group relative bg-black rounded-xl overflow-hidden border border-transparent cursor-pointer transform-gpu will-change-transform"
      style={{
        transformStyle: "preserve-3d",
        perspective: "800px"
      }}
    >
      <div className="relative aspect-video overflow-hidden">
        <motion.img 
          src={item.imageUrl} 
          alt={item.title}
          className="w-full h-full object-cover"
          whileHover={{ 
            scale: 1.06,
            transition: { duration: 0.2, ease: "easeOut" }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
        
        {item.type === 'trailer' && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            whileHover={{ 
              scale: 1.15,
              transition: { duration: 0.15, ease: "easeOut" }
            }}
          >
            <motion.div 
              className="w-16 h-16 rounded-full bg-[#107C10]/80 flex items-center justify-center"
              whileHover={{
                backgroundColor: "rgba(16, 124, 16, 1)",
                boxShadow: "0 0 20px rgba(16, 124, 16, 0.8)",
                transition: { duration: 0.15 }
              }}
            >
              <Play className="w-8 h-8 text-white ml-1" />
            </motion.div>
          </motion.div>
        )}
        
        <div className="absolute top-3 left-3 z-10">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.15 }}
          >
            <Badge className={cn(
              "text-xs font-bold px-3 py-1 rounded-full shadow-md",
              item.type === 'trailer' ? "bg-[#107C10] text-white" : 
              item.type === 'news' ? "bg-yellow-500 text-black" : 
              "bg-blue-500 text-white"
            )}>
              {item.type === 'trailer' ? 'TRAILER' : 
               item.type === 'news' ? 'NOVIDADE' : 'EVENTO'}
            </Badge>
          </motion.div>
        </div>
      </div>
      
      <div className="p-5">
        <motion.h3 
          className="font-bold text-lg mb-2 transition-colors duration-150"
          whileHover={{ 
            color: "#107C10",
            transition: { duration: 0.15 }
          }}
        >
          {item.title}
        </motion.h3>
        
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
          {item.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {item.date}
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <Button 
              variant="ghost" 
              size="sm"
              className="text-[#107C10] hover:text-white hover:bg-[#107C10] transition-colors duration-150 hover:shadow-[0_0_15px_rgba(16,124,16,0.5)]"
            >
              {item.type === 'trailer' ? 'Assistir' : 'Ler mais'}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsCard;
