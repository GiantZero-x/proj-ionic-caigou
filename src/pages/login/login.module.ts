import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Shared } from "../../app/shared";
import { LoginPage } from "./login";

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
    Shared
  ],
  exports: [
    LoginPage
  ]
})
export class LoginPageModule {
}
