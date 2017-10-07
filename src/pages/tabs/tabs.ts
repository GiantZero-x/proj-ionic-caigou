import {Component} from '@angular/core';

import {HomePage} from '../home/home';
import {MePage} from "../me/me";
import {TradePage} from "../trade/trade";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = TradePage;
  tab3Root = MePage;

  constructor() {

  }
}
