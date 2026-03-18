import { Component, Input } from '@angular/core';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-hover-card',
  templateUrl: './product-hover-card.component.html',
  styleUrl: './product-hover-card.component.css',
  standalone: false
})
export class ProductHoverCardComponent {
  @Input() product!: Product;
  @Input() position: { x: number; y: number } = { x: 0, y: 0 };
}
