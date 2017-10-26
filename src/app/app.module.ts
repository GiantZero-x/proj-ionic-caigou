import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { MePage } from "../pages/me/me";
import { TradePage } from "../pages/trade/trade";

import { Shared } from "./shared";
import { Modules, Providers } from "./app.import"

@NgModule({
  declarations: [
    MyApp,
    MePage,
    TradePage,
    HomePage,
    TabsPage
  ],
  imports: [
    Shared,
    Modules,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: 'true'
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MePage,
    TradePage,
    HomePage,
    TabsPage
  ],
  providers: [
    Providers,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
  ]
})
export class AppModule {
}
