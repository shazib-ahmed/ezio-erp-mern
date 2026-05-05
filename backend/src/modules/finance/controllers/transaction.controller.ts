import { 
  Controller, 
  Get, 
  Query,
  Res
} from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { Permissions } from '@/common/decorators/permissions.decorator';
import * as express from 'express';
import * as ExcelJS from 'exceljs';

@Controller('finance/transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  @Permissions('TRX_VIEW')
  findAll(
    @GetUser('tenantId') tenantId: string,
    @Query('search') search?: string,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
    @Query('type') type?: string,
    @Query('method') method?: string,
    @Query('accountId') accountId?: string,
  ) {
    return this.transactionService.findAll(
      Number(tenantId),
      search,
      limit ? Number(limit) : undefined,
      cursor ? Number(cursor) : undefined,
      type,
      method,
      accountId ? Number(accountId) : undefined,
    );
  }

  @Get('stats')
  @Permissions('TRX_VIEW')
  getStats(@GetUser('tenantId') tenantId: string) {
    return this.transactionService.getStats(Number(tenantId));
  }

  @Get('export/preview')
  @Permissions('TRX_VIEW')
  async exportPreview(
    @GetUser('tenantId') tenantId: string,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ) {
    return this.transactionService.getExportData(Number(tenantId), fromDate, toDate);
  }

  @Get('export/excel')
  @Permissions('TRX_VIEW')
  async exportExcel(
    @GetUser('tenantId') tenantId: string,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
    @Res() res: express.Response
  ) {
    const data = await this.transactionService.getExportData(Number(tenantId), fromDate, toDate);
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transactions');
    
    worksheet.columns = [
      { header: 'Date', key: 'Date', width: 15 },
      { header: 'Trx ID', key: 'TrxID', width: 25 },
      { header: 'Purpose', key: 'Purpose', width: 30 },
      { header: 'Account', key: 'Account', width: 20 },
      { header: 'Method', key: 'Method', width: 15 },
      { header: 'Amount', key: 'Amount', width: 15 },
      { header: 'Type', key: 'Type', width: 10 },
    ];
    
    worksheet.addRows(data);
    
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Expose-Headers', 'Content-Disposition');

    res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.attachment('transactions.xlsx');
    
    await workbook.xlsx.write(res);
    res.end();
  }

  @Get('export/csv')
  @Permissions('TRX_VIEW')
  async exportCSV(
    @GetUser('tenantId') tenantId: string,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
    @Res() res: express.Response
  ) {
    const data = await this.transactionService.getExportData(Number(tenantId), fromDate, toDate);
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transactions');
    
    worksheet.columns = [
      { header: 'Date', key: 'Date' },
      { header: 'Trx ID', key: 'TrxID' },
      { header: 'Purpose', key: 'Purpose' },
      { header: 'Account', key: 'Account' },
      { header: 'Method', key: 'Method' },
      { header: 'Amount', key: 'Amount' },
      { header: 'Type', key: 'Type' },
    ];
    
    worksheet.addRows(data);
    
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Expose-Headers', 'Content-Disposition');

    res.type('text/csv');
    res.attachment('transactions.csv');
    
    await workbook.csv.write(res);
    res.end();
  }

  @Get('export/pdf')
  @Permissions('TRX_VIEW')
  async exportPDF(
    @GetUser('tenantId') tenantId: string,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
    @Res() res: express.Response
  ) {
    try {
      const data = await this.transactionService.getExportData(Number(tenantId), fromDate, toDate);
      
      const PDFDocument = require('pdfkit');
      const doc = new PDFDocument({ margin: 30, size: 'A4' });

      // Explicit CORS headers for this request
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      res.header('Access-Control-Expose-Headers', 'Content-Disposition');
      
      res.type('application/pdf');
      res.attachment('transactions.pdf');

      doc.pipe(res);

      // Header
      doc.fontSize(20).text('Transaction Report', { align: 'center' });
      doc.fontSize(10).text(`Range: ${new Date(fromDate).toLocaleDateString()} to ${new Date(toDate).toLocaleDateString()}`, { align: 'center' });
      doc.moveDown(2);

      // Table Header
      const tableTop = 150;
      const col1 = 30;
      const col2 = 100;
      const col3 = 250;
      const col4 = 380;
      const col5 = 460;
      const col6 = 530;

      doc.fontSize(10).font('Helvetica-Bold');
      doc.text('Date', col1, tableTop);
      doc.text('Trx ID', col2, tableTop);
      doc.text('Purpose', col3, tableTop);
      doc.text('Method', col4, tableTop);
      doc.text('Amount', col5, tableTop);
      doc.text('Type', col6, tableTop);

      doc.moveTo(30, tableTop + 15).lineTo(565, tableTop + 15).stroke();

      // Table Rows
      let rowY = tableTop + 25;
      doc.font('Helvetica');

      data.forEach((item) => {
        if (rowY > 750) {
          doc.addPage();
          rowY = 50;
        }
        
        doc.fontSize(8);
        doc.text(item.Date || '', col1, rowY);
        doc.text((item.TrxID || '').substring(0, 15), col2, rowY);
        doc.text((item.Purpose || '').substring(0, 30), col3, rowY);
        doc.text(item.Method || '', col4, rowY);
        doc.text((item.Amount || 0).toString(), col5, rowY);
        doc.text(item.Type || '', col6, rowY);
        
        rowY += 20;
      });

      doc.end();
    } catch (error) {
      console.error('PDF Export Error:', error);
      res.status(500).send('Internal Server Error during PDF generation');
    }
  }
}
