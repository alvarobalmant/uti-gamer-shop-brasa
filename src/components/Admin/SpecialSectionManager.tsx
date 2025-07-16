import React, { useState } from 'react';
import { useSpecialSections } from '@/hooks/useSpecialSections';
import { SpecialSection, SpecialSectionCreateInput, SpecialSectionUpdateInput } from '@/types/specialSections';
import SpecialSectionsList from './SpecialSections/SpecialSectionsList';
import SpecialSectionEditor from './SpecialSections/SpecialSectionEditor';

const SpecialSectionManager = () => {
  const { specialSections, loading, addSpecialSection, updateSpecialSection, deleteSpecialSection } = useSpecialSections();
  const [showEditor, setShowEditor] = useState(false);
  const [editingSection, setEditingSection] = useState<SpecialSection | null>(null);

  const handleCreate = () => {
    setEditingSection(null);
    setShowEditor(true);
  };

  const handleEdit = (section: SpecialSection) => {
    setEditingSection(section);
    setShowEditor(true);
  };

  const handleEditorSubmit = async (formData: SpecialSectionCreateInput | SpecialSectionUpdateInput) => {
    if (editingSection) {
      await updateSpecialSection(editingSection.id, formData as SpecialSectionUpdateInput);
    } else {
      await addSpecialSection(formData as SpecialSectionCreateInput);
    }
    setShowEditor(false);
    setEditingSection(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta seção especial? Esta ação não pode ser desfeita.')) {
      await deleteSpecialSection(id);
    }
  };

  const handleCancelEditor = () => {
    setShowEditor(false);
    setEditingSection(null);
  };

  if (showEditor) {
    return (
      <SpecialSectionEditor
        section={editingSection}
        onSubmit={handleEditorSubmit}
        onCancel={handleCancelEditor}
      />
    );
  }

  return (
    <div className="space-y-6">
      <SpecialSectionsList
        sections={specialSections}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreateNew={handleCreate}
        loading={loading}
      />
    </div>
  );
};

export default SpecialSectionManager;
