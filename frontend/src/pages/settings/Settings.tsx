import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs';
import { Card, CardContent } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Button } from '@/shared/ui/button';
import { useAppSelector } from '@/app/hooks';
import { User, Lock, Save, Camera } from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">System Settings</h1>
        <p className="text-muted-foreground">Manage your personal profile and security credentials.</p>
      </div>

      <Tabs defaultValue="profile" className="max-w-4xl">
        <TabsList className="mb-4">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="credentials" className="gap-2">
            <Lock className="h-4 w-4" /> Credentials
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="border-border bg-card">
            <div className="p-6 border-b border-border bg-muted/20">
              <h3 className="font-bold text-lg">Profile Information</h3>
              <p className="text-sm text-muted-foreground">Update your account's profile information and email address.</p>
            </div>
            <CardContent className="p-6 space-y-8">
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-2xl bg-muted border border-border overflow-hidden flex items-center justify-center">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name || 'User'} className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-primary text-primary-foreground shadow-none border border-primary/20 hover:scale-105 transition-transform">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="Shazib" className="bg-background border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Ahmed" className="bg-background border-border" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="shazib@ezioerp.com" className="bg-background border-border" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="+880 1712-345678" className="bg-background border-border" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <Button className="gap-2">
                  <Save className="h-4 w-4" /> Save Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credentials">
          <Card className="border-border bg-card">
            <div className="p-6 border-b border-border bg-muted/20">
              <h3 className="font-bold text-lg">Update Password</h3>
              <p className="text-sm text-muted-foreground">Ensure your account is using a long, random password to stay secure.</p>
            </div>
            <CardContent className="p-6 space-y-6">
              <div className="max-w-md space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current">Current Password</Label>
                  <Input id="current" type="password" placeholder="••••••••" className="bg-background border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new">New Password</Label>
                  <Input id="new" type="password" placeholder="••••••••" className="bg-background border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm Password</Label>
                  <Input id="confirm" type="password" placeholder="••••••••" className="bg-background border-border" />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <Button className="gap-2">
                  <Lock className="h-4 w-4" /> Update Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Settings;
