import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs';
import { Card, CardContent } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Button } from '@/shared/ui/button';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { updateProfile } from '@/core/auth/slice/authSlice';
import { User, Lock, Save, Camera, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isSubmitting } = useAppSelector((state) => state.auth);

  const [profileData, setProfileData] = React.useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [passwordData, setPasswordData] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfileData(prev => ({ ...prev, [id]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswordData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async () => {
    const formData = new FormData();
    Object.entries(profileData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (selectedFile) {
      formData.append('avatar', selectedFile);
    }

    try {
      await dispatch(updateProfile(formData)).unwrap();
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err || 'Failed to update profile');
    }
  };

  const handlePasswordSubmit = async () => {
    if (!passwordData.newPassword) return toast.error('Please enter a new password');
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    const formData = new FormData();
    formData.append('password', passwordData.newPassword);

    try {
      await dispatch(updateProfile(formData)).unwrap();
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password updated successfully!');
    } catch (err: any) {
      toast.error(err || 'Failed to update password');
    }
  };

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
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange}
                  />
                  <div className="w-32 h-32 rounded-2xl bg-muted border border-border overflow-hidden flex items-center justify-center">
                    {previewUrl || user?.avatar ? (
                      <img src={previewUrl || user?.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSubmitting}
                    className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-primary text-primary-foreground shadow-none border border-primary/20 hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={profileData.name} onChange={handleInputChange} disabled={isSubmitting} className="bg-background border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" value={profileData.username} onChange={handleInputChange} disabled={isSubmitting} className="bg-background border-border" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" value={profileData.email} onChange={handleInputChange} disabled={isSubmitting} className="bg-background border-border" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" value={profileData.phone} onChange={handleInputChange} disabled={isSubmitting} className="bg-background border-border" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <Button 
                  className="gap-2" 
                  onClick={handleProfileSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} 
                  Save Profile
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
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} disabled={isSubmitting} placeholder="••••••••" className="bg-background border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} disabled={isSubmitting} placeholder="••••••••" className="bg-background border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} disabled={isSubmitting} placeholder="••••••••" className="bg-background border-border" />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <Button 
                  className="gap-2" 
                  onClick={handlePasswordSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />} 
                  Update Password
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
