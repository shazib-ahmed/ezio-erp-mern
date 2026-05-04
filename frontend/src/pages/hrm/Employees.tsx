import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Search, UserPlus, Filter } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { EmployeeFormModal } from '@/modules/hrm/components/EmployeeFormModal';

const employees = [
  { id: 1, eid: 'EMP-001', name: 'Shazib Ahmed', avatar: 'https://github.com/shadcn.png', pos: 'Full Stack Developer', dept: 'IT', role: 'Super Admin', date: '2023-01-15', status: 'Active' },
  { id: 2, eid: 'EMP-042', name: 'Zayed Hasan', avatar: null, pos: 'UI/UX Designer', dept: 'Creative', role: 'Employee', date: '2024-03-01', status: 'Active' },
  { id: 3, eid: 'EMP-089', name: 'Mahrab Khan', avatar: null, pos: 'HR Manager', dept: 'HR', role: 'HR Manager', date: '2022-11-10', status: 'On Leave' },
];

const Employees: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleCreateEmployee = (data: any) => {
    console.log('Registering employee:', data);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Employee Directory</h1>
          <p className="text-muted-foreground">Manage employee lifecycle from onboarding to retirement.</p>
        </div>
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
          <UserPlus className="h-4 w-4" /> Add Employee
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, ID, or department..." 
              className="bg-background border-border pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filters
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">Employee</TableHead>
              <TableHead className="font-bold">Position</TableHead>
              <TableHead className="font-bold">Department</TableHead>
              <TableHead className="font-bold">System Role</TableHead>
              <TableHead className="font-bold">Join Date</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="text-right font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((emp) => (
              <TableRow key={emp.id} className="hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 overflow-hidden">
                      {emp.avatar ? (
                        <img src={emp.avatar} alt={emp.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold text-primary">{emp.name.split(' ').map(n => n[0]).join('')}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{emp.name}</p>
                      <p className="text-xs text-muted-foreground">{emp.eid}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{emp.pos}</TableCell>
                <TableCell>{emp.dept}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-border bg-muted/50 text-foreground text-[10px]">
                    {emp.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{emp.date}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "font-medium",
                      emp.status === 'Active' && "border-primary/20 text-primary bg-primary/5",
                      emp.status === 'On Leave' && "border-orange-500/20 text-orange-500 bg-orange-500/5"
                    )}
                  >
                    {emp.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-primary hover:underline">Profile</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <EmployeeFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateEmployee}
      />
    </>
  );
};

export default Employees;
