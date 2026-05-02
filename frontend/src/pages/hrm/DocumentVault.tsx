import React from 'react';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { Card, CardContent } from '@/shared/ui/card';
import { FileText, Image as ImageIcon, FileCode, Upload, MoreVertical, Download } from 'lucide-react';
import { Button } from '@/shared/ui/button';

const DocumentVault: React.FC = () => {
  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Document Vault</h1>
          <p className="text-muted-foreground">Secure digital storage for employee IDs, contracts, and certificates.</p>
        </div>
        <Button className="gap-2">
          <Upload className="h-4 w-4" /> Upload Document
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { name: 'NID_Shazib.pdf', size: '1.2 MB', type: 'pdf' },
          { name: 'Contract_2026.docx', size: '450 KB', type: 'doc' },
          { name: 'Certificate_Zayed.jpg', size: '2.4 MB', type: 'img' },
          { name: 'Tax_Form_101.pdf', size: '890 KB', type: 'pdf' },
        ].map((file, i) => (
          <Card key={i} className="hover:border-primary/50 transition-colors group cursor-pointer relative">
            <CardContent className="p-4">
              <div className="flex flex-col items-center justify-center py-6">
                <div className="p-4 rounded-2xl bg-muted group-hover:bg-primary/10 transition-colors mb-4">
                  {file.type === 'pdf' && <FileText className="h-8 w-8 text-destructive" />}
                  {file.type === 'doc' && <FileCode className="h-8 w-8 text-blue-500" />}
                  {file.type === 'img' && <ImageIcon className="h-8 w-8 text-orange-500" />}
                </div>
                <p className="font-semibold text-center truncate w-full px-2">{file.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{file.size}</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Download className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </MainLayout>
  );
};

export default DocumentVault;
