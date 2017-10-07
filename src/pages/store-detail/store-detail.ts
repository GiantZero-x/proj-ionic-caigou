import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController, Events} from 'ionic-angular';
import {HttpProvider} from "../../providers/http";

/**
 * Generated class for the StoreDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-store-detail',
  templateUrl: 'store-detail.html',
})
export class StoreDetailPage {

  currStore: any = {
    link_mans: []
  };
  currId: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              public events: Events,
              public http: HttpProvider) {
    this.currId = navParams.data.id;
  }

  /**
   * 进入前
   */
  ionViewWillEnter() {
    this.getDetail();
  }

  /**
   * 获取详情
   */
  getDetail() {
    this.http.get('tradeapp/Suppliers_Admin/detail', {id: this.currId})
      .then(res => {
        this.currStore = res.data;
      })
      .catch(e => console.log(e))
  }

  // 编辑
  editStore() {
    let modal = this.modalCtrl.create('StoreEditPage', {id: this.currId});
    modal.present();

    modal.onWillDismiss(hasUpdate => {
      if (hasUpdate) {
        this.getDetail();
        this.events.publish('updateList:Store')
      }
    });
  }

}
