import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Card, CardContent } from '@/shared/ui/card';
import { Checkbox } from '@/shared/ui/checkbox';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <Card className="border-border/40">
      <CardContent className="pt-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 bg-background border-border"
                placeholder="admin@company.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-12 bg-background border-border"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember-me" />
              <Label htmlFor="remember-me" className="text-sm text-muted-foreground cursor-pointer font-normal">
                Remember me
              </Label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" title="Forgot Password" className="font-medium text-primary hover:text-primary/80 transition-colors">
                Forgot your password?
              </Link>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-md font-semibold">
            Sign in
            <ArrowRight className="ml-2 h-4 w-4" />
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
