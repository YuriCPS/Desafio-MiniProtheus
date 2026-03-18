import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
  standalone: false
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  isEditMode = false;
  productId: number | null = null;
  error: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      sku: ['', [Validators.required, Validators.maxLength(50)]],
      name: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(1000)]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      stock: [null, [Validators.required, Validators.min(0)]],
      barcode: ['', [Validators.maxLength(14), Validators.pattern(/^\d{0,14}$/)]],
      ncm: ['', [Validators.maxLength(10), Validators.pattern(/^\d{4}\.?\d{2}\.?\d{2}$/)]],
      cest: ['', [Validators.maxLength(9), Validators.pattern(/^\d{2}\.?\d{3}\.?\d{2}$/)]],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = +id;
      this.loadProduct(this.productId);
    }
  }

  get f() {
    return this.productForm.controls;
  }

  private loadProduct(id: number): void {
    this.loading = true;
    this.productService.getById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          sku: product.sku,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          barcode: product.barcode,
          ncm: product.ncm,
          cest: product.cest,
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar produto.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    const formValue = this.productForm.getRawValue();
    const payload = {
      ...formValue,
      description: formValue.description || null,
      barcode: formValue.barcode || null,
      ncm: formValue.ncm || null,
      cest: formValue.cest || null,
    };

    const operation = this.isEditMode
      ? this.productService.update(this.productId!, payload)
      : this.productService.create(payload);

    operation.subscribe({
      next: () => this.router.navigate(['/products']),
      error: (err) => {
        if (err.status === 409 && err.error?.message) {
          this.error = err.error.message;
        } else {
          this.error = this.isEditMode
            ? 'Erro ao atualizar produto. Tente novamente.'
            : 'Erro ao criar produto. Tente novamente.';
        }
        this.loading = false;
        console.error(err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }
}
