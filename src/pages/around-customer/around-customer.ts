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
  selector: 'page-around-customer',
  templateUrl: 'around-customer.html',
})
export class AroundCustomerPage {

  @ViewChild(Content) content: Content;

  public list: any = [];         //  列表
  public searchKey: string = ''; //  关键词

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public modalCtrl: ModalController,
    public http: HttpProvider, ) {
  }

  /**
   * 获取列表数据
   */
  public getList() {
    return new Promise((resolve, reject) => {
      this.http.get(`tradeapp/buy_car/index`, { searchKey: this.searchKey.trim() })
        .then(res => {
          this.list = res.data;
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
    // 没有刷新事件则直接获取数据,
    if (refresher) {
      setTimeout(() => {
        this.getList()
          .then(() => refresher.complete())
          .catch(() => refresher.complete())
      }, 500)
    } else if (this.content) {
      this.content.scrollToTop().then(() => {
        this.getList();
      })
    } else {
      this.getList()
    }
  }


  ionViewDidEnter() {
    this.getList();
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
