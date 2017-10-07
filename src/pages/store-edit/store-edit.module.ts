import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {StoreEditPage} from './store-edit';
import {Shared} from "../../app/shared";

@NgModule({
  declarations: [
    StoreEditPage,
  ],
  imports: [
    IonicPageModule.forChild(StoreEditPage),
    Shared
  ],

})
export class StoreEditPageModule {
}
