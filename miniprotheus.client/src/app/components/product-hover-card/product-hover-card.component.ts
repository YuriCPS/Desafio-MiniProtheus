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

  private readonly cardWidth = 320;
  private readonly cardHeight = 280;
  private readonly margin = 16;

  get adjustedX(): number {
    const x = this.position.x + this.margin;
    const maxX = window.innerWidth - this.cardWidth - this.margin;
    return Math.max(this.margin, Math.min(x, maxX));
  }

  get adjustedY(): number {
    const y = this.position.y - 8;
    const maxY = window.innerHeight - this.cardHeight - this.margin;
    return Math.max(this.margin, Math.min(y, maxY));
  }
}
