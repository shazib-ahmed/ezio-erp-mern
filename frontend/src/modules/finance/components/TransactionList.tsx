import React, { useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/shared/ui/table';
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/lib/utils';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchTransactions } from '../slice/transactionSlice';
import { Skeleton } from '@/shared/ui/skeleton';
import { InfiniteScroll } from '@/shared/components/common/InfiniteScroll';
import { format } from 'date-fns';
import { useCurrency } from '@/shared/hooks/useCurrency';

const TransactionList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { transactions, loading, nextCursor } = useAppSelector((state) => state.transactions);
  const { formatCurrency } = useCurrency();

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const handleLoadMore = () => {
    if (nextCursor && !loading) {
      dispatch(fetchTransactions({ cursor: nextCursor }));
    }
  };

  return (
    <InfiniteScroll
      onLoadMore={handleLoadMore}
      hasMore={Boolean(nextCursor)}
      isLoading={loading}
    >
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">Date</TableHead>
              <TableHead className="font-bold">Trx ID</TableHead>
              <TableHead className="font-bold">Purpose</TableHead>
              <TableHead className="font-bold">Account</TableHead>
              <TableHead className="font-bold">Method</TableHead>
              <TableHead className="font-bold">Amount</TableHead>
              <TableHead className="font-bold">Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && transactions.length === 0 ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                </TableRow>
              ))
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              Array.isArray(transactions) && transactions.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30">
                  <TableCell className="text-muted-foreground">
                    {format(new Date(item.createdAt), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{item.trxId}</TableCell>
                  <TableCell className="font-medium">{item.purpose}</TableCell>
                  <TableCell>
                    <span className="text-xs bg-muted px-2 py-1 rounded border border-border">
                      {item.account?.name || 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-muted/50 border-border">
                      {item.method?.replace('_', ' ') || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell className={cn(
                    "font-bold",
                    item.type === 'INCOME' ? "text-primary" : "text-destructive"
                  )}>
                    {item.type === 'INCOME' ? '+' : '-'} {formatCurrency(item.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "font-medium",
                        item.type === 'INCOME' ? "border-primary/20 text-primary bg-primary/5" : "border-destructive/20 text-destructive bg-destructive/5"
                      )}
                    >
                      {item.type}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </InfiniteScroll>
  );
};

export { TransactionList };
