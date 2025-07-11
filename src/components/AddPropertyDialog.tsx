
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PropertyFormFields from "@/components/property/PropertyFormFields";
import { useAddProperty } from "@/hooks/useAddProperty";

interface AddPropertyDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddPropertyDialog = ({ isOpen, onClose }: AddPropertyDialogProps) => {
  const { formData, handleInputChange, validateAndSubmit, isLoading } = useAddProperty(onClose);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateAndSubmit();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Property</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <PropertyFormFields 
            formData={formData} 
            onInputChange={handleInputChange} 
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Adding..." : "Add Property"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPropertyDialog;
