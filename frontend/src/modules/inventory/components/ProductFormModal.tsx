import React, { useEffect, useState, useMemo } from 'react';
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
  Loader2,
  Upload,
  X,
  FileText
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
    thumb: '',
    attributes: {} as Record<string, any>
  });
  const [attributeFiles, setAttributeFiles] = useState<Record<string, File>>({});
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { user } = useAppSelector((state) => state.auth);
  const industryAttributes = useMemo(() => (user as any)?.industry?.attributes || [], [user]);

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
    const safeParseAttributes = (attrs: any) => {
      if (!attrs) return {};
      if (typeof attrs === 'object' && !Array.isArray(attrs)) return attrs;
      if (typeof attrs === 'string') {
        try {
          const parsed = JSON.parse(attrs);
          return typeof parsed === 'object' ? parsed : {};
        } catch (e) {
          return {};
        }
      }
      return {};
    };

    if (initialData) {
      setFormData({
        name: initialData.name || '',
        categoryId: initialData.categoryId?.toString() || '',
        brandId: initialData.brandId?.toString() || '',
        thumb: (typeof initialData.thumb === 'string') ? initialData.thumb : '',
        attributes: safeParseAttributes(initialData.attributes)
      });
      // Set existing file previews from URLs
      const existingPreviews: Record<string, string> = {};
      if (initialData.thumb) {
        existingPreviews['thumb'] = initialData.thumb;
      }
      industryAttributes.forEach((attr: any) => {
        if (attr.type === 'file' && initialData.attributes?.[attr.name]) {
          existingPreviews[attr.name] = initialData.attributes[attr.name];
        }
      });
      setPreviews(existingPreviews);
    } else {
      setFormData({
        name: '',
        categoryId: '',
        brandId: '',
        thumb: '',
        attributes: {}
      });
      setPreviews({});
      setAttributeFiles({});
    }
    setErrors({});
  }, [initialData, isOpen, industryAttributes]);

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

  const handleFileChange = (name: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttributeFiles(prev => ({ ...prev, [name]: file }));
      
      // If this is the thumbnail, clear the existing URL to avoid confusion
      if (name === 'thumb') {
        setFormData(prev => ({ ...prev, thumb: '' }));
      }

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews(prev => ({ ...prev, [name]: reader.result as string }));
        };
        reader.readAsDataURL(file);
      } else {
        setPreviews(prev => ({ ...prev, [name]: file.name }));
      }
    }
  };

  const clearFile = (name: string) => {
    setAttributeFiles(prev => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
    setPreviews(prev => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
    
    if (name === 'thumb') {
      setFormData(prev => ({ ...prev, thumb: '' }));
    } else {
      handleAttributeChange(name, '');
    }
  };

  const isImage = (url: string) => {
    return url.match(/\.(jpeg|jpg|gif|png|webp)/i) || url.startsWith('data:image/');
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
      const attrNameLower = attr.name.toLowerCase();
      if (attrNameLower === 'brand') return;
      
      if (attrNameLower === 'thumbnail' || attrNameLower === 'thumb') {
          if (attr.required && !formData.thumb && !attributeFiles['thumb']) {
              newErrors['thumb'] = 'Product Image is required';
          }
          return;
      }

      if (attr.required && !formData.attributes[attr.name] && !attributeFiles[attr.name]) {
        newErrors[attr.name] = `${attr.name} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Check if we have files to decide whether to use FormData
    const hasFiles = Object.keys(attributeFiles).length > 0;
    console.log('[ProductFormModal] Submitting. hasFiles:', hasFiles, 'attributeFiles:', Object.keys(attributeFiles));

    if (hasFiles) {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('categoryId', formData.categoryId);
      if (formData.brandId) fd.append('brandId', formData.brandId);
      
      // Only append the thumb URL if we ARE NOT uploading a new file for it
      if (formData.thumb && !attributeFiles['thumb']) {
        fd.append('thumb', formData.thumb);
      }
      
      fd.append('attributes', JSON.stringify(formData.attributes));
      Object.entries(attributeFiles).forEach(([name, file]) => {
        fd.append(name, file);
      });
      onSubmit(fd);
    } else {
      onSubmit({
        ...formData,
        categoryId: parseInt(formData.categoryId),
        brandId: formData.brandId ? parseInt(formData.brandId) : null,
        // Ensure thumb is a string or null
        thumb: typeof formData.thumb === 'string' ? formData.thumb : null
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
              .filter((attr: any) => {
                  const lower = attr.name.toLowerCase();
                  return lower !== 'brand' && lower !== 'thumbnail' && lower !== 'thumb';
              })
              .map((attr: any) => (
              <div key={attr.name} className={cn("space-y-2", attr.name.toLowerCase().includes('price') && "col-span-2")}>
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
                ) : attr.type === 'file' ? (
                  <div className="space-y-2">
                    {previews[attr.name] ? (
                      <div className="relative w-full h-32 rounded-lg overflow-hidden border border-border bg-muted/20 group flex items-center justify-center">
                        {isImage(previews[attr.name]) ? (
                          <img src={previews[attr.name]} alt="Preview" className="w-full h-full object-contain" />
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <FileText className="h-8 w-8 text-muted-foreground" />
                            <p className="text-[10px] font-medium text-muted-foreground truncate max-w-[150px]">{previews[attr.name]}</p>
                          </div>
                        )}
                        <button 
                          type="button" 
                          onClick={() => clearFile(attr.name)}
                          className="absolute top-1 right-1 p-1 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="relative h-32 rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center cursor-pointer bg-muted/10 overflow-hidden">
                        <input 
                          type="file" 
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                          onChange={(e) => handleFileChange(attr.name, e)}
                        />
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-xs text-muted-foreground">Upload {attr.name}</p>
                      </div>
                    )}
                  </div>
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

            {/* Dedicated Thumb Field (Moved to bottom) */}
            <div className="space-y-2 col-span-2">
              <Label>Product Thumbnail {industryAttributes.find((a: any) => a.name.toLowerCase() === 'thumbnail' || a.name.toLowerCase() === 'thumb')?.required && <span className="text-destructive">*</span>}</Label>
              <div className="space-y-2">
                {previews['thumb'] ? (
                  <div className="relative w-full h-40 rounded-lg overflow-hidden border border-border bg-muted/20 group flex items-center justify-center">
                    <img src={previews['thumb']} alt="Thumbnail Preview" className="w-full h-full object-contain" />
                    <button 
                      type="button" 
                      onClick={() => clearFile('thumb')}
                      className="absolute top-2 right-2 p-1.5 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div className="relative h-40 rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center cursor-pointer bg-muted/10 overflow-hidden">
                    <input 
                      type="file" 
                      name="thumb"
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                      onChange={(e) => handleFileChange('thumb', e)}
                    />
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Upload Product Image</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">PNG, JPG or WEBP (Max 2MB)</p>
                  </div>
                )}
                {errors['thumb'] || errors['Thumbnail'] ? <p className="text-[12px] text-destructive font-medium">{errors['thumb'] || errors['Thumbnail']}</p> : null}
              </div>
            </div>
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
