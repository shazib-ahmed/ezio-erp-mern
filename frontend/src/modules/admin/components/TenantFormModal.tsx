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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/shared/ui/select';

interface TenantFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const TenantFormModal: React.FC<TenantFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [formData, setFormData] = useState({
    companyName: '',
    subdomain: '',
    industry: '',
    ownerName: '',
    email: '',
    status: 'Active'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        companyName: '',
        subdomain: '',
        industry: '',
        ownerName: '',
        email: '',
        status: 'Active'
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Tenant' : 'Register New Tenant'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input 
                id="companyName" 
                name="companyName" 
                value={formData.companyName} 
                onChange={handleChange} 
                placeholder="e.g. Ezio Solutions Ltd" 
                required 
                className="bg-background border-border"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subdomain">Subdomain</Label>
              <div className="flex items-center">
                <Input 
                  id="subdomain" 
                  name="subdomain" 
                  value={formData.subdomain} 
                  onChange={handleChange} 
                  placeholder="ezio" 
                  required 
                  className="bg-background border-border rounded-r-none border-r-0"
                />
                <div className="h-10 px-3 flex items-center bg-muted border border-border rounded-r-md text-sm text-muted-foreground">
                  .ezioerp.com
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select onValueChange={(v) => handleSelectChange('industry', v)} value={formData.industry}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select Industry" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Tech">Technology</SelectItem>
                  <SelectItem value="Services">Services</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerName">Owner Name</Label>
              <Input 
                id="ownerName" 
                name="ownerName" 
                value={formData.ownerName} 
                onChange={handleChange} 
                placeholder="John Doe" 
                required 
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Primary Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email"
                value={formData.email} 
                onChange={handleChange} 
                placeholder="owner@company.com" 
                required 
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="status">Subscription Status</Label>
              <Select onValueChange={(v) => handleSelectChange('status', v)} value={formData.status}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                  <SelectItem value="Pending">Pending Approval</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{initialData ? 'Update Tenant' : 'Register Tenant'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { TenantFormModal };
