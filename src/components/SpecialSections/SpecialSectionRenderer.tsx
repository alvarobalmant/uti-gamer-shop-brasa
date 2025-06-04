
import React from 'react';
import { SpecialSection } from '@/types/specialSections';
import { cn } from '@/lib/utils';

interface SpecialSectionRendererProps {
  section: SpecialSection;
}

export const SpecialSectionRenderer: React.FC<SpecialSectionRendererProps> = ({
  section,
}) => {
  if (!section.is_active) {
    return null;
  }

  const getSectionStyle = () => {
    const style: React.CSSProperties = {
      paddingTop: `${section.padding_top || 40}px`,
      paddingBottom: `${section.padding_bottom || 40}px`,
      paddingLeft: `${section.padding_left || 20}px`,
      paddingRight: `${section.padding_right || 20}px`,
      marginTop: `${section.margin_top || 50}px`,
      marginBottom: `${section.margin_bottom || 50}px`,
      borderRadius: `${section.border_radius || 0}px`,
    };

    switch (section.background_type) {
      case 'color':
        style.backgroundColor = section.background_color || '#FFFFFF';
        break;
      case 'image':
        if (section.background_image_url) {
          style.backgroundImage = `url(${section.background_image_url})`;
          style.backgroundSize = 'cover';
          style.backgroundPosition = 'center';
          style.backgroundRepeat = 'no-repeat';
        }
        break;
      case 'gradient':
        if (section.background_gradient) {
          style.background = section.background_gradient;
        }
        break;
    }

    return style;
  };

  return (
    <section
      className={cn(
        'w-full',
        section.background_type === 'image' && 'relative'
      )}
      style={getSectionStyle()}
    >
      <div className="container mx-auto">
        {section.title && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">{section.title}</h2>
            {section.description && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {section.description}
              </p>
            )}
          </div>
        )}

        {/* Elements will be rendered here once we implement the element components */}
        {section.elements && section.elements.length > 0 && (
          <div className="grid gap-6">
            {section.elements
              .filter(element => element.is_active)
              .sort((a, b) => a.display_order - b.display_order)
              .map((element) => (
                <div key={element.id} className="w-full">
                  {/* Element renderer will be implemented in the next step */}
                  <div className="p-4 border rounded-lg bg-white/80">
                    <h3 className="font-semibold">{element.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Tipo: {element.element_type}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </section>
  );
};
