import React from 'react';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { BarChart3, FileText, Download, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/button';

const Reports: React.FC = () => {
  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Financial Reports</h1>
        <p className="text-muted-foreground">Generate and analyze Balance Sheets, P&L statements, and more.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { title: 'Profit & Loss Statement', desc: 'Summary of revenues, costs, and expenses.' },
          { title: 'Balance Sheet', desc: 'Detailed view of assets, liabilities, and equity.' },
          { title: 'Cash Flow Statement', desc: 'Track the flow of cash in and out of the business.' },
          { title: 'Tax Summary Report', desc: 'Consolidated report for annual tax filing.' },
        ].map((report, i) => (
          <Card key={i} className="hover:border-primary/50 transition-colors group cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold">{report.title}</CardTitle>
              <FileText className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">{report.desc}</p>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" /> Download PDF
                </Button>
                <Button size="sm" className="gap-2">
                   Analyze <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 p-12 border border-dashed border-border rounded-xl flex flex-col items-center justify-center bg-muted/10">
        <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-bold text-foreground">Advanced Analytics</h3>
        <p className="text-muted-foreground text-center max-w-md mt-2">
          Charts and visual analytics will be powered by Recharts once the backend API is ready to provide live data.
        </p>
      </div>
    </MainLayout>
  );
};

export default Reports;
