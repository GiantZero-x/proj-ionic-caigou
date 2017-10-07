import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductEditPage } from './product-edit';
import {Shared} from "../../app/shared";

@NgModule({
  declarations: [
    ProductEditPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductEditPage),
    Shared
  ],
  exports: [
    ProductEditPage
  ]
})
export class ProductEditPageModule { }
