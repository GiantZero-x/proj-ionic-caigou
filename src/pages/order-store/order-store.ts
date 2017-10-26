import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController, Content } from 'ionic-angular';
import { HttpProvider } from "../../providers/http"

/**
 * Generated class for the StoreListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-order-store',
  templateUrl: 'order-store.html',
})
export class OrderStorePage {
  @ViewChild(Content) content: Content;


  public list: any = [];         //  列表
  public searchKey: string = ''; //  关键词

  public page: number = 1;         //  当前页
  public hasMore: boolean = true;  //  是否还有更多

  public cusId: string; // 客户id

  public orderId: string; //表单id

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public modalCtrl: ModalController,
    public http: HttpProvider, ) {
    this.cusId = navParams.data.cusId;
    this.orderId = navParams.data.orderId;
  }

  public getList(isNew: boolean = false) {
    return new Promise((resolve, reject) => {
      this.http.get('tradeapp/Order/supplierList', {
        page: this.page,
        searchKey: this.searchKey.trim(),
        customer_id: this.cusId,
        tradeapp_order_id: this.orderId
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

  /**
   * 懒加载
   * @param infiniteScroll  {Event} 懒加载事件
   */
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
      this.navCtrl.push('AroundProductPage', { cusId: this.cusId })
    })
  }

}
