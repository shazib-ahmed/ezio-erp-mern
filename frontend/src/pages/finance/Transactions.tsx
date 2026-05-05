import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { fetchTransactions, fetchFinanceStats } from '@/modules/finance/slice/transactionSlice';
import { fetchAccounts } from '@/modules/finance/slice/accountSlice';
import axios from '@/shared/lib/axios';
import { Button } from '@/shared/ui/button';
import { 
  Download, 
  Search, 
  FilterX, 
  FileText, 
  FileSpreadsheet, 
  FileCode,
  ChevronDown
} from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { TransactionList } from '@/modules/finance/components/TransactionList';
import { FinanceSummary } from '@/modules/finance/components/FinanceSummary';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/shared/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { ExportModal } from '@/modules/finance/components/ExportModal';
import { toast } from 'sonner';
import { getSecureData } from '@/shared/lib/storage';

const Transactions: React.FC = () => {
  const dispatch = useAppDispatch();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterMethod, setFilterMethod] = useState<string>('ALL');
  const [filterAccount, setFilterAccount] = useState<string>('ALL');
  
  const [exportModal, setExportModal] = useState<{ open: boolean; type: string }>({ open: false, type: '' });
  const [isExporting, setIsExporting] = useState(false);
  
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    dispatch(fetchAccounts({}));
    dispatch(fetchFinanceStats());
  }, [dispatch]);

  useEffect(() => {
    const params: any = {
      search: debouncedSearch,
    };
    
    if (filterType !== 'ALL') params.type = filterType;
    if (filterMethod !== 'ALL') params.method = filterMethod;
    if (filterAccount !== 'ALL') params.accountId = Number(filterAccount);
    
    dispatch(fetchTransactions(params));
  }, [dispatch, debouncedSearch, filterType, filterMethod, filterAccount]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterType('ALL');
    setFilterMethod('ALL');
    setFilterAccount('ALL');
  };

  const handleExport = async (fromDate: string, toDate: string) => {
    setIsExporting(true);
    try {
      // First, make a small request with axios to ensure the token is fresh
      // If it's expired, the axios interceptor will handle the refresh automatically
      await axios.get('/finance/transactions/stats');
      
      // Now get the fresh token from storage
      const token = await getSecureData('auth_accessToken');
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      
      // Build the download URL with token in query param
      const downloadUrl = `${API_URL}/finance/transactions/export/${exportModal.type}?fromDate=${fromDate}&toDate=${toDate}&token=${token}`;
      
      // Use hidden iframe or window.location for download
      // This bypasses axios interception and IDM related CORS errors
      window.location.href = downloadUrl;
      
      toast.success(`${exportModal.type.toUpperCase()} report generation started`);
      setExportModal({ open: false, type: '' });
    } catch (err: any) {
      toast.error('Failed to initiate download');
    } finally {
      // Small timeout to show the loader briefly
      setTimeout(() => setIsExporting(false), 2000);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
          <p className="text-muted-foreground">Monitor all financial movements across your organization.</p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-2 h-11 bg-primary px-6 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
              <Download className="h-5 w-5" /> Export Report <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-popover border-border">
            <DropdownMenuItem onClick={() => setExportModal({ open: true, type: 'csv' })} className="gap-2 cursor-pointer">
              <FileCode className="h-4 w-4 text-orange-500" /> Export to CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setExportModal({ open: true, type: 'excel' })} className="gap-2 cursor-pointer">
              <FileSpreadsheet className="h-4 w-4 text-green-500" /> Export to Excel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setExportModal({ open: true, type: 'pdf' })} className="gap-2 cursor-pointer">
              <FileText className="h-4 w-4 text-red-500" /> Export to PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <FinanceSummary />

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by TrxID, amount or purpose..." 
              className="pl-10 h-11 bg-background border-border w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[140px] h-11 bg-background">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="INCOME">Income</SelectItem>
                <SelectItem value="EXPENSE">Expense</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterMethod} onValueChange={setFilterMethod}>
              <SelectTrigger className="w-[140px] h-11 bg-background">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="ALL">All Methods</SelectItem>
                <SelectItem value="CASH">Cash</SelectItem>
                <SelectItem value="BANK_TRANSFER">Bank</SelectItem>
                <SelectItem value="BKASH">bKash</SelectItem>
                <SelectItem value="NAGAD">Nagad</SelectItem>
              </SelectContent>
            </Select>

            {(searchQuery || filterType !== 'ALL' || filterMethod !== 'ALL' || filterAccount !== 'ALL') && (
              <Button 
                variant="ghost" 
                onClick={handleResetFilters}
                className="h-11 px-3 text-muted-foreground hover:text-foreground"
              >
                <FilterX className="h-4 w-4 mr-2" /> Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      <TransactionList />

      <ExportModal 
        isOpen={exportModal.open}
        onClose={() => setExportModal({ ...exportModal, open: false })}
        onExport={handleExport}
        title={`Export Transactions as ${exportModal.type.toUpperCase()}`}
        isExporting={isExporting}
      />
    </div>
  );
};

export default Transactions;
