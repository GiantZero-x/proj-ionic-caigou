import { Component, ViewChild } from '@angular/core';
import { Content, Events, IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { HttpProvider } from "../../providers/http";

/**
 * Generated class for the CustomerPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-customer',
  templateUrl: 'customer.html',
})
export class CustomerPage {

  @ViewChild(Content) content: Content;

  public list: any = [];
  public secList: any = [];
  public searchKey: string = '';
  public page: number = 1;
  public hasMore: boolean = true;
  public isCheck: boolean;
  public checkId: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public events: Events,
    public http: HttpProvider) {

    this.isCheck = Boolean(navParams.data.isCheck);
    this.events.subscribe('updateList:Customer', () => this.getList(true));

  }

  ionViewDidLoad() {

    this.getList(true);
  }

  public getList(isNew: boolean = false) {

    return new Promise((resolve, reject) => {
      Promise.all([
        this.http.get('tradeapp/customer/index', { page: this.page, searchKey: this.searchKey.trim() }),
        this.http.get('tradeapp/customer/oldCustomers', false)
      ])
        .then(resArr => {
          let [list, secList] = resArr;
          this.list = isNew ? list.data.data : this.list.concat(list.data.data);
          // 没有更多则关闭懒加载
          this.hasMore = list.data.hasmore;
          this.secList = secList.data.data;
          resolve();
        })
        .catch(e => reject(e))

    })
  }

  public doRefresh(refresher?) {

    this.page = 1;
    this.hasMore = true;
    this.checkId = null;

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


  public handleCheck(id) {
    this.isCheck || this.navCtrl.push('CustomerDetailPage', { id: id })
  }

  /**
   * 添加
   */
  public handleAdd() {
    let modal = this.modalCtrl.create('CustomerEditPage');
    modal.present();

    modal.onDidDismiss(id => {
      if (id) {
        this.doRefresh();
        if (this.isCheck) {
          this.checkId = id;
          this.submitCheck()
        }
      }
    });
  }

  /*选中提交*/
  public submitCheck() {
    this.navCtrl.push('AroundProductPage', { cusId: this.checkId });
  }

}
