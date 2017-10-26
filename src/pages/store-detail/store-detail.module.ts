import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StoreDetailPage } from './store-detail';
import { Shared } from "../../app/shared";

@NgModule({
  declarations: [
    StoreDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(StoreDetailPage),
    Shared,
  ],
})
export class StoreDetailPageModule {
}
