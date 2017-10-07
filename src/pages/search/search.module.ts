import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchPage } from './search';
import {Shared} from "../../app/shared";

@NgModule({
  declarations: [
    SearchPage
  ],
  imports: [
    IonicPageModule.forChild(SearchPage),
    Shared
  ],
  exports: [
    SearchPage
  ]
})
export class SearchPageModule {}
