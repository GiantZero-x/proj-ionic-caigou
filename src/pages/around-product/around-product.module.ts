import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AroundProductPage } from './around-product';
import { Shared } from "../../app/shared";

@NgModule({
  declarations: [
    AroundProductPage,
  ],
  imports: [
    IonicPageModule.forChild(AroundProductPage),
    Shared
  ],
  exports: [
    AroundProductPage
  ]
})
export class AroundProductPageModule {
}
