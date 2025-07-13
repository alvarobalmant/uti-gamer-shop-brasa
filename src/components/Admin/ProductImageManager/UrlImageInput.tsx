
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'lucide-react';

interface UrlImageInputProps {
  onUrlAdd: (url: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const UrlImageInput: React.FC<UrlImageInputProps> = ({
  onUrlAdd,
  disabled = false,
  placeholder = "URL da imagem..."
}) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onUrlAdd(url.trim());
      setUrl('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1"
      />
      <Button
        type="submit"
        size="sm"
        disabled={disabled || !url.trim()}
        variant="outline"
      >
        <Link className="w-4 h-4" />
      </Button>
    </form>
  );
};

export default UrlImageInput;
