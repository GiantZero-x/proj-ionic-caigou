import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderCustomerPage } from './order-customer';
import {Shared} from "../../app/shared";

@NgModule({
  declarations: [
    OrderCustomerPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderCustomerPage),
    Shared
  ],
})
export class OrderCustomerPageModule {}
