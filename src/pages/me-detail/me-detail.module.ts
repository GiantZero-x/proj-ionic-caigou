import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MeDetailPage } from './me-detail';

@NgModule({
  declarations: [
    MeDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(MeDetailPage),
  ],
  exports: [
    MeDetailPage
  ]
})
export class MeDetailPageModule { }
