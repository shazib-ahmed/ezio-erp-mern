import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Card, CardContent } from '@/shared/ui/card';
import { Checkbox } from '@/shared/ui/checkbox';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { login, clearError } from '@/core/auth/slice/authSlice';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/shared/lib/utils';

const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isSubmitting, error } = useAppSelector((state) => state.auth);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  React.useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Map backend error to specific field and show toast
  React.useEffect(() => {
    if (error) {
      if (error === 'Invalid credentials') {
        setFieldErrors(prev => ({ ...prev, password: 'Wrong email or password' }));
      } else {
        toast.error(error);
      }
    }
  }, [error]);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    const resultAction = await dispatch(login({ email, password }));
    if (login.fulfilled.match(resultAction)) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
    if (error) dispatch(clearError());
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
    if (error) dispatch(clearError());
  };

  return (
    <Card className="border-border/40">
      <CardContent className="pt-8">
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="space-y-2">
            <Label htmlFor="email" className={cn(fieldErrors.email && "text-destructive", isSubmitting && "opacity-50")}>Email address</Label>
            <div className="relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className={cn("h-5 w-5", fieldErrors.email ? "text-destructive" : "text-muted-foreground")} />
              </div>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                error={!!fieldErrors.email}
                disabled={isSubmitting}
                className="pl-10 h-12 bg-background border-border"
                placeholder="admin@company.com"
              />
            </div>
            {fieldErrors.email && (
              <p className="text-xs font-medium text-destructive mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="h-3 w-3" />
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className={cn(fieldErrors.password && "text-destructive", isSubmitting && "opacity-50")}>Password</Label>
            <div className="relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className={cn("h-5 w-5", fieldErrors.password ? "text-destructive" : "text-muted-foreground")} />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                error={!!fieldErrors.password}
                disabled={isSubmitting}
                className="pl-10 pr-10 h-12 bg-background border-border"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-xs font-medium text-destructive mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="h-3 w-3" />
                {fieldErrors.password}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember-me" disabled={isSubmitting} />
              <Label htmlFor="remember-me" className={cn("text-sm text-muted-foreground cursor-pointer font-normal", isSubmitting && "opacity-50 cursor-not-allowed")}>
                Remember me
              </Label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" title="Forgot Password" className={cn("font-medium text-primary hover:text-primary/80 transition-colors", isSubmitting && "pointer-events-none opacity-50")}>
                Forgot your password?
              </Link>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-md font-semibold" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Signing in...</span>
              </div>
            ) : (
              <>
                Sign in
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">
                New to Ezio-ERP?
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Button variant="outline" className="w-full h-12 border-border hover:bg-accent hover:text-accent-foreground" asChild>
              <Link to="/signup">
                Create a workspace
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { LoginForm };
