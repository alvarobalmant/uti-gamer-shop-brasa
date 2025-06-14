
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
  news?: NewsItem;
  item?: NewsItem;
  index: number;
  className?: string;
}

const NewsCard = ({ news, item, index, className }: NewsCardProps) => {
  // Use news prop if provided, otherwise fall back to item prop
  const newsData = news || item;
  
  if (!newsData) {
    return null;
  }

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
        rotateY: 0.5,
        boxShadow: "0 0 20px -5px rgba(16, 124, 16, 0.5), 0 0 10px -8px rgba(16, 124, 16, 0.3)",
        borderColor: "#107C10",
        transition: { 
          duration: 0.15, 
          ease: "easeOut" 
        }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      className={cn(
        "group relative bg-black rounded-xl overflow-visible border border-transparent cursor-pointer transform-gpu will-change-transform",
        "active:scale-95 md:active:scale-100",
        "w-[220px] md:w-full max-w-[220px] md:max-w-none",
        "flex-shrink-0 snap-start",
        className
      )}
      style={{
        transformOrigin: "center center",
        transformStyle: "preserve-3d",
        perspective: "800px",
        zIndex: 1
      }}
    >
      <div className="relative aspect-video overflow-hidden rounded-t-xl">
        <motion.img 
          src={newsData.imageUrl} 
          alt={newsData.title}
          className="w-full h-full object-cover"
          whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.2, ease: "easeOut" }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
        
        {newsData.type === 'trailer' && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            whileHover={{ 
              scale: 1.1,
              transition: { duration: 0.15, ease: "easeOut" }
            }}
          >
            <motion.div 
              className="w-8 h-8 rounded-full bg-[#107C10]/80 flex items-center justify-center md:w-16 md:h-16"
              whileHover={{
                backgroundColor: "rgba(16, 124, 16, 1)",
                boxShadow: "0 0 20px rgba(16, 124, 16, 0.8)",
                transition: { duration: 0.15 }
              }}
            >
              <Play className="w-4 h-4 text-white ml-0.5 md:w-8 md:h-8 md:ml-1" />
            </motion.div>
          </motion.div>
        )}
        
        <div className="absolute top-2 left-2 z-10 md:top-3 md:left-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.15 }}
          >
            <Badge className={cn(
              "text-xs font-bold px-2 py-0.5 rounded-full shadow-md md:px-3 md:py-1",
              newsData.type === 'trailer' ? "bg-[#107C10] text-white" : 
              newsData.type === 'news' ? "bg-yellow-500 text-black" : 
              "bg-blue-500 text-white"
            )}>
              {newsData.type === 'trailer' ? 'TRAILER' : 
               newsData.type === 'news' ? 'NOVIDADE' : 'EVENTO'}
            </Badge>
          </motion.div>
        </div>
      </div>
      
      <div className="p-2 md:p-5">
        <motion.h3 
          className="font-bold text-xs mb-1 transition-colors duration-150 leading-tight md:text-lg md:mb-2 max-w-[90%]"
          whileHover={{ 
            color: "#107C10",
            transition: { duration: 0.15 }
          }}
        >
          {newsData.title}
        </motion.h3>
        
        <p className="text-xs text-gray-400 mb-2 line-clamp-2 leading-normal md:text-sm md:mb-4 max-w-[95%]">
          {newsData.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500 flex items-center">
            <Clock className="w-3 h-3 mr-0.5" />
            {newsData.date}
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <Button 
              variant="ghost" 
              size="sm"
              className="text-[#107C10] hover:text-white hover:bg-[#107C10] transition-colors duration-150 hover:shadow-[0_0_15px_rgba(16,124,16,0.5)] text-xs px-2 py-1 h-6 md:text-sm md:px-4 md:py-2 md:h-9"
            >
              {newsData.type === 'trailer' ? 'Assistir' : 'Ler mais'}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsCard;
