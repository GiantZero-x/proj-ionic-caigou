import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductPage } from './product';
import { Shared } from "../../app/shared";

@NgModule({
  declarations: [
    ProductPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductPage),
    Shared
  ],
  exports: [
    ProductPage
  ]
})
export class ProductPageModule {
}
