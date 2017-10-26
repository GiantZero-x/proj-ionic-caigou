import { Component, ViewChild } from '@angular/core';
import { IonicPage, Searchbar, Events } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { HttpProvider } from "../../providers/http";

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  public searchBox = {
    Customer: [],
    Product: [],
    Suppliers_Admin: []
  };

  // 关键字
  searchKey: string = '';

  // 是否已查询
  hasSearch: boolean = false;

  @ViewChild('mainSearch') mainSearch: Searchbar;

  constructor(public keyboard: Keyboard,
    public events: Events,
    public http: HttpProvider) {
    // 数据修改后更新列表
    this.events.subscribe('updateList:Product', () => this.getData('Product'));
    this.events.subscribe('updateList:Customer', () => this.getData('Customer'));
    this.events.subscribe('updateList:Store', () => this.getData('Suppliers_Admin'))
  }

  ionViewDidEnter() {
    // 搜索输入框获取焦点
    setTimeout(() => {
      this.mainSearch.setFocus();
      this.keyboard.show();
    }, 0)
  }

  /**
   * 处理搜索输入
   */
  handleSearch() {
    ['Customer', 'Product', 'Suppliers_Admin'].forEach(v => this.getData(v));
  }

  /**
   * 单独获取数据
   * @param type
   * @return {Promise<ResData>}
   */
  getData(type: string) {
    let key = this.searchKey.trim();
    if (key) {
      this.hasSearch = true;
      this.http.get(`tradeapp/${type}/index`, { page: 1, page_size: 10000, searchKey: key })
        .then(res => this.searchBox[type] = res.data.data)
    } else {
      this.hasSearch = false;
      this.searchBox[type] = []
    }
  }
}
