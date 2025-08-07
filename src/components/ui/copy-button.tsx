import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
  successMessage?: string;
  errorMessage?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  className,
  variant = 'outline',
  size = 'default',
  children,
  successMessage,
  errorMessage,
  ...props
}) => {
  const { copyToClipboard, isCopied, isLoading } = useCopyToClipboard({
    successMessage,
    errorMessage
  });

  const handleCopy = () => {
    copyToClipboard(text);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      disabled={isLoading}
      className={cn(
        'transition-all duration-200',
        isCopied && 'bg-green-100 border-green-200 text-green-700 hover:bg-green-100',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-muted-foreground border-t-transparent" />
      ) : isCopied ? (
        <Check className="h-4 w-4" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      {children && <span className="ml-2">{children}</span>}
    </Button>
  );
};