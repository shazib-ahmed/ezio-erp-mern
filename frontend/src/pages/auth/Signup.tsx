import React from 'react';
import { Building2 } from 'lucide-react';
import { SignupForm } from '@/core/auth/components/SignupForm';
import { ThemeSwitcher } from '@/shared/components/ThemeSwitcher';

const Signup: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-foreground font-jakarta">
      <ThemeSwitcher />
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="flex justify-center">
          <div className="bg-primary p-3 rounded-xl border border-primary/20">
            <Building2 className="h-10 w-10 text-primary-foreground" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight">
          Create your Workspace
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Setup your Ezio-ERP tenant in minutes
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <SignupForm />
      </div>
    </div>
  );
};

export default Signup;
