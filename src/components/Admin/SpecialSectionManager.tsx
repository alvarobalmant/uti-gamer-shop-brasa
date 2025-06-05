import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useSpecialSections } from '@/hooks/useSpecialSections';
import SpecialSectionList from './SpecialSectionManager/SpecialSectionList'; // Import the list component
import SpecialSectionForm from './SpecialSectionManager/SpecialSectionForm'; // Import the form component
import { SpecialSection, SpecialSectionCreateInput, SpecialSectionUpdateInput } from '@/types/specialSections';

const SpecialSectionManager = () => {
  const { specialSections, loading, addSpecialSection, updateSpecialSection, deleteSpecialSection, refetch } = useSpecialSections();
  const [showForm, setShowForm] = React.useState(false);
  const [editingSection, setEditingSection] = React.useState<SpecialSection | null>(null);

  const handleCreate = () => {
    setEditingSection(null);
    setShowForm(true);
  };

  const handleEdit = (section: SpecialSection) => {
    setEditingSection(section);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData: SpecialSectionCreateInput | SpecialSectionUpdateInput) => {
    try {
      if (editingSection) {
        // Ensure we only pass fields that exist in SpecialSectionUpdateInput
        // The form should ideally return the correct type
        await updateSpecialSection(editingSection.id, formData as SpecialSectionUpdateInput);
      } else {
        await addSpecialSection(formData as SpecialSectionCreateInput);
      }
      setShowForm(false);
      setEditingSection(null);
      // refetch(); // The hook already refetches on success
    } catch (error) {
      // Error is already handled by the hook's toast message
      console.error("Failed to save special section:", error);
    }
  };

  const handleDelete = async (id: string) => {
    // TODO: Add a nicer confirmation dialog (e.g., shadcn/ui AlertDialog)
    if (window.confirm('Tem certeza que deseja excluir esta seção especial? Esta ação não pode ser desfeita.')) {
      try {
        await deleteSpecialSection(id);
        // refetch(); // Hook refetches on success
      } catch (error) {
        console.error("Failed to delete special section:", error);
      }
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingSection(null);
  }

  if (showForm) {
    return (
      <SpecialSectionForm
        section={editingSection}
        onSubmit={handleFormSubmit}
        onCancel={handleCancelForm}
      />
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700 text-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Gerenciamento de Seções Especiais</CardTitle>
            <CardDescription className="text-gray-400">
              Crie e gerencie seções personalizadas com layouts complexos.
            </CardDescription>
          </div>
          <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nova Seção Especial
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <SpecialSectionList
          sections={specialSections}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </CardContent>
    </Card>
  );
};

export default SpecialSectionManager;
