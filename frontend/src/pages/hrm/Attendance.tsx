import React from 'react';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Badge } from '@/shared/ui/badge';
import { StatsCard } from '@/shared/components/common/StatsCard';
import { Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const attendance = [
  { id: 1, name: 'Shazib Ahmed', date: '2026-05-02', in: '09:05 AM', out: '06:15 PM', status: 'Present' },
  { id: 2, name: 'Zayed Hasan', date: '2026-05-02', in: '09:45 AM', out: '06:30 PM', status: 'Late' },
  { id: 3, name: 'Mahrab Khan', date: '2026-05-02', in: '-', out: '-', status: 'Absent' },
];

const Attendance: React.FC = () => {
  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Attendance System</h1>
        <p className="text-muted-foreground">Monitor daily check-ins, shifts, and punctuality.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard label="Present Today" value="124" icon={CheckCircle2} iconColor="text-primary" />
        <StatsCard label="Late Arrivals" value="12" icon={Clock} iconColor="text-orange-500" />
        <StatsCard label="Absent" value="3" icon={XCircle} iconColor="text-destructive" />
        <StatsCard label="On Leave" value="5" icon={AlertCircle} iconColor="text-blue-500" />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/20">
          <h3 className="font-bold text-lg">Daily Attendance Log</h3>
        </div>
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">Employee Name</TableHead>
              <TableHead className="font-bold">Date</TableHead>
              <TableHead className="font-bold">Check In</TableHead>
              <TableHead className="font-bold">Check Out</TableHead>
              <TableHead className="font-bold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendance.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-semibold">{log.name}</TableCell>
                <TableCell className="text-muted-foreground">{log.date}</TableCell>
                <TableCell>{log.in}</TableCell>
                <TableCell>{log.out}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "font-medium",
                      log.status === 'Present' && "border-primary/20 text-primary bg-primary/5",
                      log.status === 'Late' && "border-orange-500/20 text-orange-500 bg-orange-500/5",
                      log.status === 'Absent' && "border-destructive/20 text-destructive bg-destructive/5"
                    )}
                  >
                    {log.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </MainLayout>
  );
};

export default Attendance;
