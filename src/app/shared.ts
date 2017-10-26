/**
 * 输出共享管道, 指令, 组件
 * */

import { Components, Directives, Pipes } from "./app.import";
import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

@NgModule({
  declarations: [
    Pipes,
    Directives,
    Components
  ],
  imports: [
    IonicModule
  ],
  exports: [
    Pipes,
    Components
  ]
})

export class Shared {
}
