import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {StorePage} from './store';
import {Shared} from "../../app/shared";

@NgModule({
  declarations: [
    StorePage,
  ],
  imports: [
    IonicPageModule.forChild(StorePage),
    Shared
  ],
  exports: [
    StorePage
  ]
})
export class StorePageModule {
}
