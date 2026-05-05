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
import { Loader2, Tag, Upload } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface BrandFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  initialData?: any;
  isSubmitting?: boolean;
}

const BrandFormModal: React.FC<BrandFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
      });
      setPreviewUrl(initialData.logo || '');
    } else {
      setFormData({
        name: '',
      });
      setPreviewUrl('');
    }
    setSelectedFile(null);
    setErrors({});
  }, [initialData, isOpen]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ name: e.target.value });
    if (errors.name) {
      setErrors(prev => {
        const next = { ...prev };
        delete next.name;
        return next;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Custom Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Brand name is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    if (selectedFile) {
      data.append('logo', selectedFile);
    }

    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Tag className="h-5 w-5 text-primary" />
            {initialData ? 'Edit Brand' : 'Add New Brand'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="brand-name" className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Brand Name</Label>
            <Input
              id="brand-name"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="e.g. Samsung, Apple, Nike"
              className={cn("bg-background border-border h-12 font-bold text-lg focus:ring-primary/20 transition-all", errors.name && "border-destructive")}
              disabled={isSubmitting}
            />
            {errors.name && <p className="text-[12px] text-destructive font-medium">{errors.name}</p>}
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Brand Logo</Label>
            <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed border-border rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer relative group">
              <input
                type="file"
                id="brand-logo"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                disabled={isSubmitting}
              />
              {previewUrl ? (
                <div className="relative h-32 w-32 rounded-lg border border-border bg-white p-2 shadow-sm">
                  <img src={previewUrl} alt="Preview" className="h-full w-full object-contain" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                    <p className="text-white text-xs font-bold">Change Image</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-4">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-foreground">Click to upload logo</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 2MB</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" className="h-11" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="h-11 min-w-[120px]" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {initialData ? 'Saving...' : 'Creating...'}
                </>
              ) : (
                initialData ? 'Save Changes' : 'Create Brand'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { BrandFormModal };
