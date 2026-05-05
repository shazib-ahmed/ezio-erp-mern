import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
import { DatePicker } from '@/shared/components/common/DatePicker';
import { Download, Loader2, Eye, Table as TableIcon } from 'lucide-react';
import axios from '@/shared/lib/axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { useCurrency } from '@/shared/hooks/useCurrency';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (fromDate: string, toDate: string) => void;
  title: string;
  isExporting?: boolean;
}

export const ExportModal: React.FC<ExportModalProps> = ({ 
  isOpen, 
  onClose, 
  onExport, 
  title,
  isExporting = false
}) => {
  const { formatCurrency } = useCurrency();
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date());
  const [toDate, setToDate] = useState<Date | undefined>(new Date());
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  const handleFetchPreview = async () => {
    if (!fromDate || !toDate) return;
    
    setIsLoadingPreview(true);
    try {
      const response = await axios.get('/finance/transactions/export/preview', {
        params: { 
          fromDate: fromDate.toISOString(), 
          toDate: toDate.toISOString() 
        }
      });
      setPreviewData(response.data.data);
    } catch (err) {
      console.error('Failed to fetch preview', err);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleExport = () => {
    if (fromDate && toDate) {
      onExport(fromDate.toISOString(), toDate.toISOString());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-b border-border">
          <div className="grid gap-2">
            <Label>From Date</Label>
            <DatePicker 
              date={fromDate} 
              setDate={setFromDate} 
              disabled={isExporting || isLoadingPreview}
            />
          </div>
          <div className="grid gap-2">
            <Label>To Date</Label>
            <DatePicker 
              date={toDate} 
              setDate={setToDate} 
              disabled={isExporting || isLoadingPreview}
            />
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col py-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <TableIcon className="h-4 w-4 text-primary" />
              Data Preview
            </h4>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleFetchPreview}
              disabled={isLoadingPreview || !fromDate || !toDate}
              className="gap-2"
            >
              {isLoadingPreview ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
              Fetch Preview
            </Button>
          </div>

          <div className="flex-1 border border-border rounded-lg overflow-hidden bg-muted/20">
            <ScrollArea className="h-[300px]">
              <Table>
                <TableHeader className="bg-muted/50 sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="w-[100px]">Date</TableHead>
                    <TableHead>Trx ID</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingPreview ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={4} className="h-10 animate-pulse bg-muted/30" />
                      </TableRow>
                    ))
                  ) : previewData === null ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic">
                        Select date range and click "Fetch Preview" to see data.
                      </TableCell>
                    </TableRow>
                  ) : !Array.isArray(previewData) || previewData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                        No transactions found for this range.
                      </TableCell>
                    </TableRow>
                  ) : (
                    previewData.map((row, i) => (
                      <TableRow key={i} className="hover:bg-muted/30">
                        <TableCell className="text-xs">{row.Date}</TableCell>
                        <TableCell className="font-mono text-[10px]">{row.TrxID}</TableCell>
                        <TableCell className="text-xs">{row.Account}</TableCell>
                        <TableCell className={`text-right font-bold text-xs ${row.Type === 'INCOME' ? 'text-primary' : 'text-destructive'}`}>
                          {row.Type === 'INCOME' ? '+' : '-'}{formatCurrency(row.Amount)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="mt-4 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose} disabled={isExporting || isLoadingPreview}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting || isLoadingPreview || !fromDate || !toDate} className="gap-2 h-10 px-8 font-bold">
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Download {title.split('as ')[1] || 'Report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
