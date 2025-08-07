import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SpecialSectionForm } from '../forms/SpecialSectionForm';

interface SpecialSectionEditorProps {
  open: boolean;
  onClose: () => void;
  section: any;
  onSectionUpdated?: (section: any) => void;
}

export const SpecialSectionEditor: React.FC<SpecialSectionEditorProps> = ({
  open,
  onClose,
  section,
  onSectionUpdated
}) => {
  // Convert PrimePageLayoutItem to SpecialSection format for editing
  const sectionData = section ? {
    id: section.id,
    title: section.section_config?.title || section.section_config?.name || '',
    type: section.section_type,
    visibility: section.is_visible ? 'active' : 'inactive',
    config: {
      ...section.section_config
    },
    section_key: section.section_key
  } : null;

  const handleSectionSave = async (updatedData: any) => {
    // Convert back to PrimePageLayoutItem format
    const updatedSection = {
      ...section,
      section_type: updatedData.type,
      section_key: updatedData.section_key,
      is_visible: updatedData.visibility === 'active',
      section_config: {
        ...updatedData.config,
        name: updatedData.title,
        title: updatedData.title
      }
    };

    if (onSectionUpdated) {
      onSectionUpdated(updatedSection);
    }
    onClose();
  };

  if (!section || !sectionData) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Seção Especial</DialogTitle>
        </DialogHeader>
        <SpecialSectionForm
          section={sectionData}
          onSave={handleSectionSave}
          onCancel={onClose}
          mode="edit"
        />
      </DialogContent>
    </Dialog>
  );
};