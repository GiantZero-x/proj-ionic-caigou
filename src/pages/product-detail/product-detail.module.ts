import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductDetailPage } from './product-detail';
import { Shared } from "../../app/shared";

@NgModule({
  declarations: [
    ProductDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductDetailPage),
    Shared
  ],
  exports: [
    ProductDetailPage
  ]
})
export class ProductDetailPageModule {

}
