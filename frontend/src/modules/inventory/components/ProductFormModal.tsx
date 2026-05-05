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
import { 
  Loader2 
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/shared/ui/select';
import { cn } from '@/shared/lib/utils';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchCategories } from '../slice/categorySlice';
import { fetchBrands } from '../slice/brandSlice';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    brandId: '',
    attributes: {} as Record<string, any>
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { user } = useAppSelector((state) => state.auth);
  const industryAttributes = (user as any)?.industry?.attributes || [];

  const { categories } = useAppSelector((state) => state.category);
  const { brands } = useAppSelector((state) => state.brand);
  const { isSubmitting } = useAppSelector((state) => state.inventory);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchCategories());
      dispatch(fetchBrands());
    }
  }, [dispatch, isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        categoryId: initialData.categoryId?.toString() || '',
        brandId: initialData.brandId?.toString() || '',
        attributes: initialData.attributes || {}
      });
    } else {
      setFormData({
        name: '',
        categoryId: '',
        brandId: '',
        attributes: {}
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, categoryId: value }));
    if (errors.categoryId) {
      setErrors(prev => {
        const next = { ...prev };
        delete next.categoryId;
        return next;
      });
    }
  };

  const handleBrandChange = (value: string) => {
    setFormData(prev => ({ ...prev, brandId: value }));
  };

  const handleAttributeChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [name]: value
      }
    }));
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Custom Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';

    const brandAttr = industryAttributes.find((a: any) => a.name.toLowerCase() === 'brand');
    if (brandAttr?.required && !formData.brandId) {
      newErrors.brandId = 'Brand is required';
    }

    // Validate mandatory industry attributes
    industryAttributes.forEach((attr: any) => {
      // Skip brand as it's handled separately
      if (attr.name.toLowerCase() === 'brand') return;

      if (attr.required && !formData.attributes[attr.name]) {
        newErrors[attr.name] = `${attr.name} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Create a clean object for submission
    const { ...cleanData } = formData;

    onSubmit({
      ...cleanData,
      categoryId: parseInt(formData.categoryId),
      brandId: formData.brandId ? parseInt(formData.brandId) : null,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} noValidate className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="name">Product Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="e.g. Industrial Motor" 
                className={cn("bg-background border-border", errors.name && "border-destructive")}
              />
              {errors.name && <p className="text-[12px] text-destructive font-medium">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={handleSelectChange} value={formData.categoryId}>
                <SelectTrigger className={cn("bg-background border-border", errors.categoryId && "border-destructive")}>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && <p className="text-[12px] text-destructive font-medium">{errors.categoryId}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">
                Brand {industryAttributes.find((a: any) => a.name.toLowerCase() === 'brand')?.required && <span className="text-destructive">*</span>}
              </Label>
              <Select onValueChange={handleBrandChange} value={formData.brandId}>
                <SelectTrigger className={cn("bg-background border-border", errors.brandId && "border-destructive")}>
                  <SelectValue placeholder="Select Brand" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id.toString()}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.brandId && <p className="text-[12px] text-destructive font-medium">{errors.brandId}</p>}
            </div>

            {/* Integrated Dynamic Industry Attributes */}
            {industryAttributes
              .filter((attr: any) => attr.name.toLowerCase() !== 'brand')
              .map((attr: any) => (
              <div key={attr.name} className="space-y-2">
                <Label htmlFor={`attr-${attr.name}`}>
                  {attr.name} {attr.required && <span className="text-destructive">*</span>}
                </Label>
                {attr.type === 'select' ? (
                  <Select 
                    onValueChange={(val) => handleAttributeChange(attr.name, val)}
                    value={formData.attributes[attr.name] || ''}
                  >
                    <SelectTrigger className={cn("bg-background border-border", errors[attr.name] && "border-destructive")}>
                      <SelectValue placeholder={`Select ${attr.name}`} />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {attr.options?.map((opt: string) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input 
                    id={`attr-${attr.name}`}
                    type={attr.type}
                    value={formData.attributes[attr.name] || ''}
                    onChange={(e) => handleAttributeChange(attr.name, e.target.value)}
                    className={cn("bg-background border-border", errors[attr.name] && "border-destructive")}
                    placeholder={`Enter ${attr.name.toLowerCase()}`}
                  />
                )}
                {errors[attr.name] && <p className="text-[12px] text-destructive font-medium">{errors[attr.name]}</p>}
              </div>
            ))}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? 'Save Changes' : 'Add Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { ProductFormModal };
