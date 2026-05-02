import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, User, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Card, CardContent } from '@/shared/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    companyEmail: '',
    industryId: '',
    adminName: '',
    adminEmail: '',
    phone: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, industryId: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <Card className="border-border/40">
      <CardContent className="pt-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          <div className="border-b border-border/50 pb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Business Information
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  name="businessName"
                  required
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Acme Corp"
                  className="h-11 bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select onValueChange={handleSelectChange}>
                  <SelectTrigger className="h-11 bg-background border-border">
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
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="companyEmail">Company Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="companyEmail"
                    name="companyEmail"
                    type="email"
                    required
                    value={formData.companyEmail}
                    onChange={handleChange}
                    className="pl-10 h-11 bg-background border-border"
                    placeholder="contact@company.com"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Admin Account
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="adminName">Full Name</Label>
                <Input
                  id="adminName"
                  name="adminName"
                  required
                  value={formData.adminName}
                  onChange={handleChange}
                  className="h-11 bg-background border-border"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input
                  id="adminEmail"
                  name="adminEmail"
                  type="email"
                  required
                  value={formData.adminEmail}
                  onChange={handleChange}
                  className="h-11 bg-background border-border"
                  placeholder="admin@company.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="h-11 bg-background border-border"
                  placeholder="+880 1XXX XXXXXX"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="h-11 bg-background border-border"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-md font-semibold mt-4">
            Create Workspace
            <ArrowRight className="ml-2 h-4 w-4" />
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
