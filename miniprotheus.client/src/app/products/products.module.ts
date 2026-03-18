import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from '../components/product-list/product-list.component';
import { ProductFormComponent } from '../components/product-form/product-form.component';
import { ProductHoverCardComponent } from '../components/product-hover-card/product-hover-card.component';

const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'new', component: ProductFormComponent },
  { path: 'edit/:id', component: ProductFormComponent }
];

@NgModule({
  declarations: [
    ProductListComponent,
    ProductFormComponent,
    ProductHoverCardComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class ProductsModule { }
