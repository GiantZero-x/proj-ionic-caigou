import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events, Content } from 'ionic-angular';
import { HttpProvider } from "../../providers/http";

/**
 * Generated class for the AroundCustomerPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-customer',
  templateUrl: 'order-customer.html',
})
export class OrderCustomerPage {

  @ViewChild(Content) content: Content;

  public list: any = [];         //  列表
  public searchKey: string = ''; //  关键词

  public page: number = 1;         //  当前页
  public hasMore: boolean = true;  //  是否还有更多


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public modalCtrl: ModalController,
    public http: HttpProvider, ) {
  }

  /**
   * 获取列表数据
   */
  public getList(isNew: boolean = false) {
    return new Promise((resolve, reject) => {
      this.http.get(`tradeapp/Order/index`, {
        page: this.page,
        searchKey: this.searchKey.trim()
      })
        .then(res => {
          this.list = isNew ? res.data.data : this.list.concat(res.data.data);
          // 没有更多则关闭懒加载
          this.hasMore = res.data.hasmore;
          resolve();
        })
        .catch(e => reject(e))
    })
  }

  /**
   * 下拉刷新
   * @param refresher {Event} 刷新事件
   */
  public doRefresh(refresher?) {
    //  重置数据
    this.page = 1;
    this.hasMore = true;

    // 没有刷新事件则直接获取数据,
    if (refresher) {
      setTimeout(() => {
        this.getList(true)
          .then(() => refresher.complete())
          .catch(() => refresher.complete())
      }, 500)
    } else if (this.content) {
      this.content.scrollToTop().then(() => {
        this.getList(true);
      })
    } else {
      this.getList(true)
    }
  }

  public doInfinite(infiniteScroll) {
    //  当前页自增
    this.page++;
    //  获取数据
    this.getList().then(() => {
      infiniteScroll.complete();
    })
  }


  ionViewDidEnter() {
    this.getList(true);
  }

  /**
   * 开始逛市场
   */
  start() {
    this.navCtrl.popToRoot().then(() => {
      this.navCtrl.push('CustomerPage', { isCheck: true })
    })
  }

}
