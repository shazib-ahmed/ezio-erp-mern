import React, { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

import { Loader2, Plus, Trash2, Settings2 } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/shared/ui/select';
import { Checkbox } from '@/shared/ui/checkbox';

interface IndustryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  isSubmitting?: boolean;
}

const IndustryFormModal: React.FC<IndustryFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    attributes: [] as any[]
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ 
        name: initialData.name,
        attributes: initialData.attributes || []
      });
    } else {
      setFormData({
        name: '',
        attributes: []
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addAttribute = () => {
    setFormData(prev => ({
      ...prev,
      attributes: [...prev.attributes, { name: '', type: 'text', required: false, options: [] }]
    }));
  };

  const removeAttribute = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index)
    }));
  };

  const updateAttribute = (index: number, field: string, value: any) => {
    const newAttributes = [...formData.attributes];
    newAttributes[index] = { ...newAttributes[index], [field]: value };
    setFormData(prev => ({ ...prev, attributes: newAttributes }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && !open && onClose()}>
      <DialogContent className="md:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            {initialData ? 'Edit Industry' : 'Add New Industry'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Industry Name</Label>
            <Input 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="e.g. Manufacturing" 
              required 
              disabled={isSubmitting}
              className="bg-background border-border h-11"
            />
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-base font-bold">Dynamic Product Fields</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addAttribute}
                className="h-8 gap-1"
                disabled={isSubmitting}
              >
                <Plus className="h-3.5 w-3.5" /> Add Field
              </Button>
            </div>

            <div className="space-y-4">
              {formData.attributes.map((attr: any, index: number) => (
                <div key={index} className="p-4 bg-muted/30 rounded-lg border border-border space-y-3 relative group">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeAttribute(index)}
                    className="absolute top-2 right-2 h-7 w-7 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={isSubmitting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Field Name</Label>
                      <Input 
                        value={attr.name}
                        onChange={(e) => updateAttribute(index, 'name', e.target.value)}
                        placeholder="e.g. Color, Style, Expiry"
                        className="h-9 bg-background"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Field Type</Label>
                      <Select 
                        value={attr.type} 
                        onValueChange={(val) => updateAttribute(index, 'type', val)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger className="h-9 bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="select">Dropdown (Select)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {attr.type === 'select' && (
                    <div className="space-y-1.5">
                      <Label className="text-xs">Options (comma separated)</Label>
                      <Input 
                        value={attr.options?.join(', ') || ''}
                        onChange={(e) => updateAttribute(index, 'options', e.target.value.split(',').map(s => s.trim()))}
                        placeholder="Small, Medium, Large"
                        className="h-9 bg-background"
                        disabled={isSubmitting}
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`req-${index}`} 
                      checked={attr.required}
                      onCheckedChange={(val) => updateAttribute(index, 'required', val)}
                      disabled={isSubmitting}
                    />
                    <label 
                      htmlFor={`req-${index}`}
                      className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Mandatory Field
                    </label>
                  </div>
                </div>
              ))}

              {formData.attributes.length === 0 && (
                <div className="text-center py-8 bg-muted/20 rounded-lg border border-dashed border-border text-muted-foreground text-sm">
                  No dynamic fields defined. Products will only have default fields.
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="h-11" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" className="h-11 min-w-[120px]" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {initialData ? 'Saving...' : 'Creating...'}
                </>
              ) : (
                initialData ? 'Save Changes' : 'Add Industry'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { IndustryFormModal };
