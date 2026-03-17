import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
  standalone: false
})
export class ProductListComponent implements OnInit {
  products$: Observable<Product[]> = EMPTY;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.error = null;
    this.products$ = this.productService.getAll().pipe(
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
