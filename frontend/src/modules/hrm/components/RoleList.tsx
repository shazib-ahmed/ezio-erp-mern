import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/shared/ui/table';
import { Badge } from '@/shared/ui/badge';
import { Edit, Trash2, ShieldCheck, Users } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Role } from '../types';

const rolesData: Role[] = [
  { id: 1, name: 'Super Admin', permissions: ['All'], description: 'Full access to all modules and settings.', userCount: 2 },
  { id: 2, name: 'HR Manager', permissions: ['HRM.Read', 'HRM.Write', 'Payroll.Manage'], description: 'Can manage employees, attendance, and payroll.', userCount: 3 },
  { id: 3, name: 'Inventory Manager', permissions: ['Inventory.Read', 'Inventory.Write'], description: 'Manage stock levels and products.', userCount: 5 },
  { id: 4, name: 'Employee', permissions: ['Self.Read', 'Attendance.Self'], description: 'Basic access to own profile and attendance.', userCount: 120 },
];

const RoleList: React.FC = () => {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="font-bold">Role Name</TableHead>
            <TableHead className="font-bold hidden md:table-cell">Description</TableHead>
            <TableHead className="font-bold">Permissions</TableHead>
            <TableHead className="font-bold">Users</TableHead>
            <TableHead className="text-right font-bold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rolesData.map((role) => (
            <TableRow key={role.id} className="hover:bg-muted/30">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/5 border border-primary/10 text-primary">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-foreground">{role.name}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground text-sm max-w-xs truncate">
                {role.description}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.map((p, i) => (
                    <Badge key={i} variant="outline" className="text-[10px] py-0 border-border bg-muted/50">
                      {p}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span className="font-medium text-foreground">{role.userCount}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export { RoleList };
