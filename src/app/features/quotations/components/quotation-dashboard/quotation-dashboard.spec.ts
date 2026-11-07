import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { QuotationApi } from '../../../../core/services/quotation-api';
import { Quotation } from '../../model/quotations.model';
import { QuotationDashboard } from './quotation-dashboard';

describe('QuotationDashboard', () => {
  it('ignores an earlier request after a newer search takes over', async () => {
    vi.useFakeTimers();
    const oldRequest = new Subject<Quotation[]>();
    const latestRequest = new Subject<Quotation[]>();
    const api = { search: vi.fn((query: string) => query === '' ? oldRequest : latestRequest) };
    TestBed.configureTestingModule({ imports: [QuotationDashboard], providers: [{ provide: QuotationApi, useValue: api }] });
    const fixture = TestBed.createComponent(QuotationDashboard);
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(300);
    fixture.componentInstance.searchControl.setValue('new');
    await vi.advanceTimersByTimeAsync(300);

    const quotation = (quotationId: string, customerName: string): Quotation => ({ quotationId, customerName, insuranceCompany: 'Bupa Arabia', premium: 1000, deductible: 100, status: 'Available' });
    latestRequest.next([quotation('QT-NEW', 'Latest Customer')]);
    oldRequest.next([quotation('QT-OLD', 'Stale Customer')]);

    expect(fixture.componentInstance.quotations().map(item => item.quotationId)).toEqual(['QT-NEW']);
    fixture.destroy();
    vi.useRealTimers();
  });

  it('filters and sorts through derived state without changing source results', () => {
    const api = { search: vi.fn(() => new Subject<Quotation[]>()) };
    TestBed.configureTestingModule({ imports: [QuotationDashboard], providers: [{ provide: QuotationApi, useValue: api }] });
    const fixture = TestBed.createComponent(QuotationDashboard);
    const component = fixture.componentInstance;
    const source: Quotation[] = [
      { quotationId: 'QT-1', customerName: 'A', insuranceCompany: 'Bupa', premium: 2000, deductible: 200, status: 'Available' },
      { quotationId: 'QT-2', customerName: 'B', insuranceCompany: 'MedGulf', premium: 1000, deductible: 100, status: 'Expired' },
    ];
    component.quotations.set(source);
    component.statusFilter.set('Available');
    component.premiumSort.set('desc');
    expect(component.visibleQuotations().map(item => item.quotationId)).toEqual(['QT-1']);
    expect(component.quotations()).toBe(source);
    fixture.destroy();
  });
});
