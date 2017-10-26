import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderStorePage } from './order-store';
import { Shared } from "../../app/shared";

@NgModule({
  declarations: [
    OrderStorePage,
  ],
  imports: [
    IonicPageModule.forChild(OrderStorePage),
    Shared
  ],
})
export class OrderStorePageModule { }
