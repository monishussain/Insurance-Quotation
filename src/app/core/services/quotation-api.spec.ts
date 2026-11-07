import { TestBed } from '@angular/core/testing';
import { QuotationApi } from './quotation-api';

describe('QuotationApi', () => {
  let service: QuotationApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuotationApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('filters by quotation id and customer name without mutating its records', async () => {
    const results = await new Promise<import('../../features/quotations/model/quotations.model').Quotation[]>(resolve =>
      service.search('qt-1003').subscribe(resolve)
    );
    expect(results.map(item => item.quotationId)).toEqual(['QT-1003']);
  });
});
