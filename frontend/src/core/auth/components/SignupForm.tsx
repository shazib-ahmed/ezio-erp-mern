import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, User, ArrowRight, AlertCircle, Phone, Lock } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Card, CardContent } from '@/shared/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { cn } from '@/shared/lib/utils';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { signup, clearError } from '@/core/auth/slice/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const SignupForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    businessName: '',
    companyEmail: '',
    industryId: '',
    adminName: '',
    adminEmail: '',
    phone: '',
    password: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Map backend error to specific field and show toast
  React.useEffect(() => {
    if (error) {
      if (error.includes('Admin email already exists')) {
        setFieldErrors(prev => ({ ...prev, adminEmail: 'This email is already registered' }));
      } else {
        toast.error(error);
      }
    }
  }, [error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (error) dispatch(clearError());
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, industryId: value });
    if (fieldErrors.industryId) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next.industryId;
        return next;
      });
    }
    if (error) dispatch(clearError());
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.businessName) errors.businessName = 'Business name is required';
    if (!formData.industryId) errors.industryId = 'Industry is required';
    if (!formData.companyEmail) errors.companyEmail = 'Company email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.companyEmail)) errors.companyEmail = 'Invalid email format';
    
    if (!formData.adminName) errors.adminName = 'Admin name is required';
    if (!formData.adminEmail) errors.adminEmail = 'Admin email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.adminEmail)) errors.adminEmail = 'Invalid email format';
    
    if (!formData.phone) errors.phone = 'Phone number is required';
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    const resultAction = await dispatch(signup(formData));
    if (signup.fulfilled.match(resultAction)) {
      toast.success('Workspace created successfully!');
      navigate('/dashboard');
    }
  };

  return (
    <Card className="border-border/40">
      <CardContent className="pt-8">
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          
          <div className="border-b border-border/50 pb-6">
            <h3 className={cn("text-lg font-semibold mb-4 flex items-center gap-2", loading && "opacity-50")}>
              <Building2 className="h-5 w-5 text-primary" />
              Business Information
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="businessName" className={cn(fieldErrors.businessName && "text-destructive", loading && "opacity-50")}>Business Name</Label>
                <Input
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  error={!!fieldErrors.businessName}
                  disabled={loading}
                  placeholder="Acme Corp"
                  className="h-11 bg-background border-border"
                />
                {fieldErrors.businessName && (
                  <p className="text-[11px] font-medium text-destructive mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.businessName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry" className={cn(fieldErrors.industryId && "text-destructive", loading && "opacity-50")}>Industry</Label>
                <Select onValueChange={handleSelectChange} value={formData.industryId} disabled={loading}>
                  <SelectTrigger className={cn("h-11 bg-background border-border", fieldErrors.industryId && "border-destructive text-destructive")}>
                    <SelectValue placeholder="Select Industry" />
                  </SelectTrigger>
                  <SelectContent className="border-border">
                    <SelectItem value="Garments">Garments</SelectItem>
                    <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {fieldErrors.industryId && (
                  <p className="text-[11px] font-medium text-destructive mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.industryId}
                  </p>
                )}
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="companyEmail" className={cn(fieldErrors.companyEmail && "text-destructive", loading && "opacity-50")}>Company Email</Label>
                <div className="relative">
                  <Mail className={cn("absolute left-3 top-3 h-5 w-5", fieldErrors.companyEmail ? "text-destructive" : "text-muted-foreground")} />
                  <Input
                    id="companyEmail"
                    name="companyEmail"
                    type="email"
                    value={formData.companyEmail}
                    onChange={handleChange}
                    error={!!fieldErrors.companyEmail}
                    disabled={loading}
                    className="pl-10 h-11 bg-background border-border"
                    placeholder="contact@company.com"
                  />
                </div>
                {fieldErrors.companyEmail && (
                  <p className="text-[11px] font-medium text-destructive mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.companyEmail}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <h3 className={cn("text-lg font-semibold mb-4 flex items-center gap-2", loading && "opacity-50")}>
              <User className="h-5 w-5 text-primary" />
              Admin Account
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="adminName" className={cn(fieldErrors.adminName && "text-destructive", loading && "opacity-50")}>Full Name</Label>
                <Input
                  id="adminName"
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleChange}
                  error={!!fieldErrors.adminName}
                  disabled={loading}
                  className="h-11 bg-background border-border"
                  placeholder="John Doe"
                />
                {fieldErrors.adminName && (
                  <p className="text-[11px] font-medium text-destructive mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.adminName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminEmail" className={cn(fieldErrors.adminEmail && "text-destructive", loading && "opacity-50")}>Admin Email</Label>
                <Input
                  id="adminEmail"
                  name="adminEmail"
                  type="email"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  error={!!fieldErrors.adminEmail}
                  disabled={loading}
                  className="h-11 bg-background border-border"
                  placeholder="admin@company.com"
                />
                {fieldErrors.adminEmail && (
                  <p className="text-[11px] font-medium text-destructive mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.adminEmail}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className={cn(fieldErrors.phone && "text-destructive", loading && "opacity-50")}>Phone Number</Label>
                <div className="relative">
                  <Phone className={cn("absolute left-3 top-3 h-5 w-5", fieldErrors.phone ? "text-destructive" : "text-muted-foreground")} />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    error={!!fieldErrors.phone}
                    disabled={loading}
                    className="pl-10 h-11 bg-background border-border"
                    placeholder="+880 1XXX XXXXXX"
                  />
                </div>
                {fieldErrors.phone && (
                  <p className="text-[11px] font-medium text-destructive mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.phone}
                  </p>
                )}
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="password" className={cn(fieldErrors.password && "text-destructive", loading && "opacity-50")}>Password</Label>
                <div className="relative">
                  <Lock className={cn("absolute left-3 top-3 h-5 w-5", fieldErrors.password ? "text-destructive" : "text-muted-foreground")} />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!fieldErrors.password}
                    disabled={loading}
                    className="pl-10 h-11 bg-background border-border"
                    placeholder="••••••••"
                  />
                </div>
                {fieldErrors.password && (
                  <p className="text-[11px] font-medium text-destructive mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.password}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-md font-semibold mt-4" disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating workspace...</span>
              </div>
            ) : (
              <>
                Create Workspace
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-border/50">
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export { SignupForm };
