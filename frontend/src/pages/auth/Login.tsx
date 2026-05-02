import React from 'react';
import { Building2 } from 'lucide-react';
import { LoginForm } from '@/core/auth/components/LoginForm';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-foreground font-jakarta">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-primary p-3 rounded-xl border border-primary/20">
            <Building2 className="h-10 w-10 text-primary-foreground" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Sign in to access your ERP workspace
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
