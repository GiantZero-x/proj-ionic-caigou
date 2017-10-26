import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AroundCustomerPage } from './around-customer';
import { Shared } from "../../app/shared";

@NgModule({
  declarations: [
    AroundCustomerPage,
  ],
  imports: [
    IonicPageModule.forChild(AroundCustomerPage),
    Shared
  ],
})
export class AroundCustomerPageModule { }
