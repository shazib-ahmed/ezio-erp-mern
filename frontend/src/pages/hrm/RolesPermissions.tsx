import React from 'react';

import { RoleList } from '@/modules/hrm/components/RoleList';
import { RoleFormModal } from '@/modules/hrm/components/RoleFormModal';
import { Button } from '@/shared/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/shared/ui/input';

const RolesPermissions: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleCreateRole = (data: any) => {
    console.log('Creating new role:', data);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Roles & Permissions</h1>
          <p className="text-muted-foreground">Manage user access levels and system permissions.</p>
        </div>
        
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" /> Create Role
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search roles by name or description..." 
              className="bg-background border-border pl-10"
            />
          </div>
        </div>
      </div>

      <RoleList />

      <RoleFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateRole}
      />
    </>
  );
};

export default RolesPermissions;
