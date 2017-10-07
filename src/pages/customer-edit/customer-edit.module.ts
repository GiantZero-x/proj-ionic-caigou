import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerEditPage } from './customer-edit';
import {Shared} from "../../app/shared";

@NgModule({
  declarations: [
    CustomerEditPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerEditPage),
    Shared
  ],
})
export class CustomerEditPageModule {}
