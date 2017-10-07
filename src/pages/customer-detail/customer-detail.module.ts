import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerDetailPage } from './customer-detail';
import {Shared} from "../../app/shared";

@NgModule({
  declarations: [
    CustomerDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerDetailPage),
    Shared
  ],
})
export class CustomerDetailPageModule {}
