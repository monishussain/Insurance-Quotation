import { Component } from '@angular/core';
import { QuotationDashboard } from './features/quotations/components/quotation-dashboard/quotation-dashboard';

@Component({
  imports: [QuotationDashboard],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {}
