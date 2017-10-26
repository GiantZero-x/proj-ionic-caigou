import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StoreListPage } from './store-list';
import { Shared } from "../../app/shared";


@NgModule({
  declarations: [
    StoreListPage,
  ],
  imports: [
    IonicPageModule.forChild(StoreListPage),
    Shared
  ],
})
export class StoreListPageModule { }
