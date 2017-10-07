import {Component, ViewChild} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  // ModalController,
  AlertController,
  Content
} from 'ionic-angular';
import {ToastServiceProvider} from "../../providers/toast-service";
import {HttpProvider} from "../../providers/http";


/**
 * Generated class for the AroundCartPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-order-cart',
  templateUrl: 'order-cart.html',
})
export class OrderCartPage {
  @ViewChild(Content) content: Content;

  // 当前商铺
  currentStore: any = {
    link_mans: []
  };

  // 当前订购车
  currentCart: any = [];

  // 客户id
  cusId: string;

  orderId:string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public toastCtrl: ToastServiceProvider,
              public http: HttpProvider) {
    this.cusId = navParams.data.cusId;
    this.currentStore = navParams.data.store;
    this.orderId = navParams.data.orderId;
  }

  /**
   * 加载采购车信息
   */
  ionViewDidEnter() {

    this.getAllPro();

  }

  /**
   * 获取全部商品
   */
  getAllPro() {
    this.http.get('tradeapp/Order/suppliersProduct', {
      customer_id: this.cusId,
      suppliers_id: this.currentStore.cus_id,
      tradeapp_order_id: this.orderId
    })
      .then(res => {
        this.currentCart = res.data;
        this.currentCart.forEach(item => {
          item['checked'] = false;
          item['img'] = item['img'] ? item['img'].split('|') : ['']
        });
      })
      .catch(err => console.log(err))
  }
}
