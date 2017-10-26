import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PictureModalPage } from './picture-modal';
import { Shared } from "../../app/shared";

@NgModule({
  declarations: [
    PictureModalPage,
  ],
  imports: [
    IonicPageModule.forChild(PictureModalPage),
    Shared
  ],
  exports: [
    PictureModalPage
  ]
})
export class PictureModalPageModule { }
