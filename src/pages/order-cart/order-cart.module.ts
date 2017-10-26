import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderCartPage } from './order-cart';
import { Shared } from "../../app/shared";

@NgModule({
  declarations: [
    OrderCartPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderCartPage),
    Shared
  ],
})
export class OrderCartPageModule { }
