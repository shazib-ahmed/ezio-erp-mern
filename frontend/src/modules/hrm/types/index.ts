export interface Employee {
  id: number;
  employeeId: string;
  fullName: string;
  designation: string;
  department: string;
  joinDate: string;
  email: string;
  role: string;
  status: 'Active' | 'On Leave' | 'Terminated';
}

export interface AttendanceRecord {
  id: number;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'Present' | 'Late' | 'Absent';
}

export interface LeaveRequest {
  id: number;
  employeeName: string;
  type: 'Annual' | 'Sick' | 'Casual';
  startDate: string;
  endDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface PayrollRecord {
  id: number;
  employeeName: string;
  month: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'Paid' | 'Processing';
}

export interface Role {
  id: number;
  name: string;
  permissions: string[];
  description: string;
  userCount: number;
}

