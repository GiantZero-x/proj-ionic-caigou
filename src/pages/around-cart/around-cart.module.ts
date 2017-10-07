import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import { AroundCartPage } from './around-cart';
import {Shared} from "../../app/shared";

@NgModule({
  declarations: [
    AroundCartPage,
  ],
  imports: [
    IonicPageModule.forChild(AroundCartPage),
    Shared
  ],
  exports: [
    AroundCartPage
  ]
})
export class AroundCartPageModule {
}
