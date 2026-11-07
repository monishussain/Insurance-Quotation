import { Injectable } from '@angular/core';
import { Observable, of, switchMap, throwError, timer } from 'rxjs';
import { Quotation } from '../../features/quotations/model/quotations.model';

@Injectable({ providedIn: 'root' })
export class QuotationApi {
    private readonly quotations: Quotation[] = [
    {
      quotationId: 'QT-1001',
      customerName: 'Ahmed Hassan',
      insuranceCompany: 'Bupa Arabia',
      premium: 2500,
      deductible: 500,
      status: 'Available'
    },
    {
      quotationId: 'QT-1002',
      customerName: 'Sara Ali',
      insuranceCompany: 'Tawuniya',
      premium: 3200,
      deductible: 750,
      status: 'Available'
    },
    {
      quotationId: 'QT-1003',
      customerName: 'Mohammed Khan',
      insuranceCompany: 'MedGulf',
      premium: 1800,
      deductible: 300,
      status: 'Expired'
    },
    {
      quotationId: 'QT-1004',
      customerName: 'Fatima Noor',
      insuranceCompany: 'Bupa Arabia',
      premium: 4100,
      deductible: 1000,
      status: 'Available'
    },
    {
      quotationId: 'QT-1005',
      customerName: 'Ali Raza',
      insuranceCompany: 'Tawuniya',
      premium: 2900,
      deductible: 500,
      status: 'Expired'
    },
    {
      quotationId: 'QT-1006',
      customerName: 'Ayesha Ahmed',
      insuranceCompany: 'MedGulf',
      premium: 2200,
      deductible: 400,
      status: 'Available'
    },
    {
      quotationId: 'QT-1007',
      customerName: 'Omar Farooq',
      insuranceCompany: 'Bupa Arabia',
      premium: 3500,
      deductible: 800,
      status: 'Available'
    },
    {
      quotationId: 'QT-1008',
      customerName: 'Zainab Malik',
      insuranceCompany: 'Tawuniya',
      premium: 1500,
      deductible: 250,
      status: 'Expired'
    }
  ];

  search(query: string): Observable<Quotation[]> {
    const normalizedQuery = query.trim().toLowerCase();

    // Simulate different API response times.
    const latency = normalizedQuery.length === 1
      ? 1800
      : 400 + Math.floor(Math.random() * 500);

    return timer(latency).pipe(
      switchMap(() => {

        // Special keyword for testing API errors.
        if (normalizedQuery === 'error') {
          return throwError(
            () => new Error('Unable to fetch quotations. Please try again.')
          );
        }

        const results = this.quotations.filter(quotation => {
          return (
            quotation.customerName.toLowerCase().includes(normalizedQuery) ||
            quotation.quotationId.toLowerCase().includes(normalizedQuery)
          );
        });

        return of(results);
      })
    );
  }
}
