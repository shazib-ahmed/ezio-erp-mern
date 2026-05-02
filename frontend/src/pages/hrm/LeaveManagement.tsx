import React from 'react';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { FileText, Check, X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { LeaveFormModal } from '@/modules/hrm/components/LeaveFormModal';

const LeaveManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleApplyLeave = (data: any) => {
    console.log('Submitting leave application:', data);
    setIsModalOpen(false);
  };

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Leave Management</h1>
          <p className="text-muted-foreground">Manage employee leave requests and approval workflows.</p>
        </div>
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
          <FileText className="h-4 w-4" /> Apply For Leave
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/20">
          <h3 className="font-bold text-lg">Pending Requests</h3>
        </div>
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">Employee</TableHead>
              <TableHead className="font-bold">Type</TableHead>
              <TableHead className="font-bold">Duration</TableHead>
              <TableHead className="font-bold">Reason</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="text-right font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { name: 'Mahrab Khan', type: 'Annual', start: '2026-05-10', end: '2026-05-15', reason: 'Family Vacation', status: 'Pending' },
              { name: 'Zayed Hasan', type: 'Sick', start: '2026-05-02', end: '2026-05-03', reason: 'Fever', status: 'Approved' },
            ].map((req, i) => (
              <TableRow key={i}>
                <TableCell className="font-semibold">{req.name}</TableCell>
                <TableCell>{req.type}</TableCell>
                <TableCell className="text-sm">
                  {req.start} to {req.end}
                </TableCell>
                <TableCell className="text-muted-foreground italic text-sm">"{req.reason}"</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn(
                    "font-medium",
                    req.status === 'Pending' && "border-orange-500/20 text-orange-500 bg-orange-500/5",
                    req.status === 'Approved' && "border-primary/20 text-primary bg-primary/5"
                  )}>
                    {req.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {req.status === 'Pending' && (
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8 text-primary border-primary/20 hover:bg-primary/5">
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 text-destructive border-destructive/20 hover:bg-destructive/5">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <LeaveFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleApplyLeave}
      />
    </MainLayout>
  );
};

export default LeaveManagement;
