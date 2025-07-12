import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette } from 'lucide-react';

interface SiteAppearanceSettingsProps {
  siteName: string;
  setSiteName: (name: string) => void;
  siteSubtitle: string;
  setSiteSubtitle: (subtitle: string) => void;
  browserTitle: string;
  setBrowserTitle: (title: string) => void;
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  logoUrl: string;
  setLogoUrl: (url: string) => void;
}

const fonts = [
  { value: 'Inter', label: 'Inter (Padrão)' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Oswald', label: 'Oswald' },
];

export const SiteAppearanceSettings: React.FC<SiteAppearanceSettingsProps> = ({
  siteName,
  setSiteName,
  siteSubtitle,
  setSiteSubtitle,
  browserTitle,
  setBrowserTitle,
  selectedFont,
  setSelectedFont,
  logoUrl,
  setLogoUrl
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Aparência do Site
        </CardTitle>
        <CardDescription>
          Configure a aparência e identidade visual
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="site-name">Nome do Site</Label>
          <Input
            id="site-name"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            placeholder="UTI dos Games"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="site-subtitle">Subtítulo</Label>
          <Input
            id="site-subtitle"
            value={siteSubtitle}
            onChange={(e) => setSiteSubtitle(e.target.value)}
            placeholder="Sua loja de games favorita"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="browser-title">Título do Navegador</Label>
          <Input
            id="browser-title"
            value={browserTitle}
            onChange={(e) => setBrowserTitle(e.target.value)}
            placeholder="UTI dos Games - Sua loja de games favorita"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="font-family">Fonte do Site</Label>
          <Select value={selectedFont} onValueChange={setSelectedFont}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma fonte" />
            </SelectTrigger>
            <SelectContent>
              {fonts.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="logo-url">URL do Logo</Label>
          <Input
            id="logo-url"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="/lovable-uploads/..."
          />
          {logoUrl && (
            <div className="flex items-center gap-2">
              <img 
                src={logoUrl} 
                alt="Preview do logo" 
                className="h-10 w-auto rounded border"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="text-sm text-muted-foreground">Preview</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};