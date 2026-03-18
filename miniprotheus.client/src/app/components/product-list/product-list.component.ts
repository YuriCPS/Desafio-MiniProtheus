import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, EMPTY, Subject, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, startWith } from 'rxjs/operators';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
  standalone: false
})
export class ProductListComponent implements OnInit, OnDestroy {
  products$: Observable<Product[]> = EMPTY;
  error: string | null = null;
  searchTerm = '';

  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.products$ = this.searchSubject.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.fetchProducts(term))
    );
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.searchSubject.next(term);
  }

  loadProducts(): void {
    this.searchSubject.next(this.searchTerm);
  }

  private fetchProducts(search: string): Observable<Product[]> {
    this.error = null;
    return this.productService.getAll(search || undefined).pipe(
      catchError((err) => {
        this.error = 'Erro ao carregar produtos. Tente novamente.';
        console.error(err);
        return EMPTY;
      })
    );
  }

  onEdit(id: number): void {
    this.router.navigate(['/products/edit', id]);
  }

  onDelete(product: Product): void {
    if (!confirm(`Deseja excluir o produto "${product.name}"?`)) return;

    this.productService.delete(product.id).subscribe({
      next: () => this.loadProducts(),
      error: (err) => {
        this.error = 'Erro ao excluir produto. Tente novamente.';
        console.error(err);
      }
    });
  }

  onNew(): void {
    this.router.navigate(['/products/new']);
  }
}
