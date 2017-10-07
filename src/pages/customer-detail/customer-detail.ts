import {Component} from '@angular/core';
import {Events, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {HttpProvider} from "../../providers/http";

/**
 * Generated class for the CustomerDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-customer-detail',
  templateUrl: 'customer-detail.html',
})
export class CustomerDetailPage {

  currCustomer: any = {
    link_mans: []
  };
  cus_ID: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              public http: HttpProvider,
              public events: Events,) {

    this.cus_ID = navParams.data.id;
  }

  ionViewWillEnter() {
    this.getDetail();
  }

  /**
   * 请求数据
   */
  getDetail() {

    this.http.get('tradeapp/Customer/detail', {id: this.cus_ID})
      .then(res => {

        this.currCustomer = res.data;

      })
      .catch(e => console.log(e))
  }

  /**
   * 编辑用户信息
   */
  editCustomer() {

    let modal = this.modalCtrl.create('CustomerEditPage', {id: this.cus_ID});
    modal.present();

    modal.onWillDismiss(hasUpdate => {
      if (hasUpdate) {
        this.getDetail();
        this.events.publish('updateList:Customer')
      }
    });
  }

}
