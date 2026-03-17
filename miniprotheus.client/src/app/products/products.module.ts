import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from '../components/product-list/product-list.component';

const routes: Routes = [
  { path: '', component: ProductListComponent }
];

@NgModule({
  declarations: [
    ProductListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class ProductsModule { }
