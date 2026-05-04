import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, User, ArrowRight, AlertCircle, Phone, Lock, Hash, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Card, CardContent } from '@/shared/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Checkbox } from '@/shared/ui/checkbox';
import { cn } from '@/shared/lib/utils';
import axios from '@/shared/lib/axios';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { signup, clearError } from '@/core/auth/slice/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface Industry {
  id: number;
  name: string;
}

const SignupForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isSubmitting, error } = useAppSelector((state) => state.auth);

  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loadingIndustries, setLoadingIndustries] = useState(true);

  const [formData, setFormData] = useState({
    businessName: '',
    companyEmail: '',
    industryId: '',
    adminName: '',
    adminEmail: '',
    username: '',
    phone: '',
    businessPhone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [phoneSameAsPersonal, setPhoneSameAsPersonal] = useState(false);
  const [emailSameAsPersonal, setEmailSameAsPersonal] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Load industries from API
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await axios.get('/industries', { params: { limit: 100 } });
        // The backend returns { data: Industry[], nextCursor } inside response.data.data
        setIndustries(response.data.data.data || []);
      } catch (err) {
        console.error('Failed to fetch industries', err);
        toast.error('Could not load industries');
      } finally {
        setLoadingIndustries(false);
      }
    };
    fetchIndustries();
  }, []);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      if (error.includes('Admin email already exists')) {
        setFieldErrors(prev => ({ ...prev, adminEmail: 'This email is already registered' }));
      } else if (error.includes('username already exists')) {
        setFieldErrors(prev => ({ ...prev, username: 'This username is taken' }));
      } else if (error.includes('Business name already exists')) {
        setFieldErrors(prev => ({ ...prev, businessName: 'This business name is already registered' }));
      } else {
        toast.error(error);
      }
    }
  }, [error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Sync phone if enabled
      if (phoneSameAsPersonal && name === 'phone') {
        newData.businessPhone = value;
      }
      
      // Sync email if enabled
      if (emailSameAsPersonal && name === 'adminEmail') {
        newData.companyEmail = value;
      }
      
      return newData;
    });

    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (error) dispatch(clearError());
  };

  const handlePhoneCheckboxChange = (checked: boolean) => {
    setPhoneSameAsPersonal(checked);
    if (checked) {
      setFormData(prev => ({ ...prev, businessPhone: prev.phone }));
    }
  };

  const handleEmailCheckboxChange = (checked: boolean) => {
    setEmailSameAsPersonal(checked);
    if (checked) {
      setFormData(prev => ({ ...prev, companyEmail: prev.adminEmail }));
    }
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
    
    if (!formData.adminName) errors.adminName = 'Full name is required';
    if (!formData.username) errors.username = 'Username is required';
    if (!formData.adminEmail) errors.adminEmail = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.adminEmail)) errors.adminEmail = 'Invalid email format';
    
    if (!formData.phone) errors.phone = 'Phone number is required';
    if (!formData.businessPhone) errors.businessPhone = 'Business phone is required';
    
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 6) errors.password = 'Min 6 characters';
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    // Create a copy of formData and remove confirmPassword before sending to backend
    const { confirmPassword, ...signupData } = formData;
    
    const resultAction = await dispatch(signup(signupData));
    if (signup.fulfilled.match(resultAction)) {
      toast.success('Account created successfully!');
      navigate('/dashboard');
    }
  };

  return (
    <Card className="border-border/40 shadow-xl bg-card/50 backdrop-blur-sm">
      <CardContent className="pt-8 px-6 pb-8">
        <form className="space-y-8" onSubmit={handleSubmit} noValidate>
          
          {/* Section 1: Owner Details */}
          <div className="space-y-5">
            <div className="flex items-center gap-3 border-b border-border/50 pb-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <User className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold tracking-tight">Owner Details</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="adminName" className={cn(fieldErrors.adminName && "text-destructive")}>Owner Full Name</Label>
                <Input
                  id="adminName"
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleChange}
                  error={!!fieldErrors.adminName}
                  disabled={isSubmitting}
                  className="h-11 bg-background"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className={cn(fieldErrors.username && "text-destructive")}>Username</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    error={!!fieldErrors.username}
                    disabled={isSubmitting}
                    className="pl-10 h-11 bg-background"
                    placeholder="johndoe123"
                  />
                </div>
                {fieldErrors.username && (
                  <p className="text-[11px] font-medium text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {fieldErrors.username}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminEmail" className={cn(fieldErrors.adminEmail && "text-destructive")}>Personal Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="adminEmail"
                    name="adminEmail"
                    type="email"
                    value={formData.adminEmail}
                    onChange={handleChange}
                    error={!!fieldErrors.adminEmail}
                    disabled={isSubmitting}
                    className="pl-10 h-11 bg-background"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className={cn(fieldErrors.phone && "text-destructive")}>Personal Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    error={!!fieldErrors.phone}
                    disabled={isSubmitting}
                    className="pl-10 h-11 bg-background"
                    placeholder="+880 1XXX XXXXXX"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className={cn(fieldErrors.password && "text-destructive")}>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    error={!!fieldErrors.password}
                    disabled={isSubmitting}
                    className="pl-10 pr-10 h-11 bg-background"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className={cn(fieldErrors.confirmPassword && "text-destructive")}>Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!fieldErrors.confirmPassword}
                    disabled={isSubmitting}
                    className="pl-10 pr-10 h-11 bg-background"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="text-[11px] font-medium text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Business Profile */}
          <div className="space-y-5 pt-4">
            <div className="flex items-center gap-3 border-b border-border/50 pb-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold tracking-tight">Business Profile</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="businessName" className={cn(fieldErrors.businessName && "text-destructive")}>Business Name</Label>
                <Input
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  error={!!fieldErrors.businessName}
                  disabled={isSubmitting}
                  placeholder="Acme Solutions"
                  className="h-11 bg-background"
                />
                {fieldErrors.businessName && (
                  <p className="text-[11px] font-medium text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {fieldErrors.businessName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry" className={cn(fieldErrors.industryId && "text-destructive")}>Select Industry</Label>
                <Select onValueChange={handleSelectChange} value={formData.industryId} disabled={isSubmitting || loadingIndustries}>
                  <SelectTrigger className={cn("h-11 bg-background", fieldErrors.industryId && "border-destructive")}>
                    <SelectValue placeholder={loadingIndustries ? "Loading..." : "Select Industry"} />
                  </SelectTrigger>
                  <SelectContent className="border-border max-h-[300px] overflow-y-auto">
                    {industries.map((ind) => (
                      <SelectItem key={ind.id} value={ind.id.toString()}>{ind.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldErrors.industryId && (
                  <p className="text-[11px] font-medium text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {fieldErrors.industryId}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyEmail" className={cn(fieldErrors.companyEmail && "text-destructive")}>Company Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="companyEmail"
                    name="companyEmail"
                    type="email"
                    value={formData.companyEmail}
                    onChange={handleChange}
                    error={!!fieldErrors.companyEmail}
                    disabled={isSubmitting || emailSameAsPersonal}
                    className="pl-10 h-11 bg-background"
                    placeholder="hello@company.com"
                  />
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox 
                    id="emailSameAsPersonal" 
                    checked={emailSameAsPersonal} 
                    onCheckedChange={(checked) => handleEmailCheckboxChange(checked as boolean)}
                  />
                  <label htmlFor="emailSameAsPersonal" className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Same as personal email
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessPhone" className={cn(fieldErrors.businessPhone && "text-destructive")}>Business Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="businessPhone"
                    name="businessPhone"
                    type="tel"
                    value={formData.businessPhone}
                    onChange={handleChange}
                    error={!!fieldErrors.businessPhone}
                    disabled={isSubmitting || phoneSameAsPersonal}
                    className="pl-10 h-11 bg-background"
                    placeholder="Business Contact"
                  />
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox 
                    id="sameAsPersonal" 
                    checked={phoneSameAsPersonal} 
                    onCheckedChange={(checked) => handlePhoneCheckboxChange(checked as boolean)}
                  />
                  <label htmlFor="sameAsPersonal" className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Same as personal phone
                  </label>
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-md font-bold mt-4 shadow-lg shadow-primary/20" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              <>
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-primary hover:underline underline-offset-4 decoration-2">
              Sign in here
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export { SignupForm };
