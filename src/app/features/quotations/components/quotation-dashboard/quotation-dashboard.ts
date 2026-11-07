import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { QuotationApi } from '../../../../core/services/quotation-api';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Quotation } from '../../model/quotations.model';
import { catchError, debounceTime, distinctUntilChanged, map, merge, of, startWith, Subject, switchMap } from 'rxjs';

@Component({
  imports: [ReactiveFormsModule, DecimalPipe],
  selector: 'app-quotation-dashboard',
  styleUrl: './quotation-dashboard.scss',
  templateUrl: './quotation-dashboard.html',
})
export class QuotationDashboard {
  private readonly quotationApi = inject(QuotationApi);
  private readonly destroyRef = inject(DestroyRef);

  readonly searchControl = new FormControl('', { nonNullable: true });

  readonly quotations = signal<Quotation[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly statusFilter = signal<'All' | Quotation['status']>('All');
  readonly premiumSort = signal<'asc' | 'desc'>('asc');
  readonly selectedId = signal<string | null>(null);
  private readonly retryRequests = new Subject<string>();
  readonly visibleQuotations = computed(() => {
    const filtered = this.quotations().filter(q => this.statusFilter() === 'All' || q.status === this.statusFilter());
    return [...filtered].sort((a, b) => this.premiumSort() === 'asc' ? a.premium - b.premium : b.premium - a.premium);
  });
  readonly selectedQuotation = computed(() => this.visibleQuotations().find(q => q.quotationId === this.selectedId()) ?? null);

  constructor() {
    merge(this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged()
    ), this.retryRequests).pipe(

      switchMap(query => {
        this.loading.set(true);
        this.error.set(null);
        return this.quotationApi.search(query).pipe(
          map(results => ({ results, error: null as string | null })),
          catchError((err: unknown) => of({ results: [] as Quotation[], error: err instanceof Error ? err.message : 'Unable to fetch quotations.' }))
        );
      })
    ).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(({ results, error }) => {
        this.quotations.set(results);
        this.error.set(error);
        if (!results.some(q => q.quotationId === this.selectedId())) this.selectedId.set(null);
        this.loading.set(false);
    });
  }

  retry(): void { this.retryRequests.next(this.searchControl.value); }
}
