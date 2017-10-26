import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { HttpProvider } from "../../providers/http";

/**
 * Generated class for the ProductDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-product-detail',
  templateUrl: 'product-detail.html',
})
export class ProductDetailPage {
  currProduct: any = {
    img: []
  };

  hideEdit: boolean;

  currId: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public http: HttpProvider,
    public events: Events) {
    this.currId = navParams.data.id;
    this.hideEdit = navParams.data.isEdit;
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
    this.http.get('tradeapp/Product/detail', { id: this.currId })
      .then(res => {
        res.data.img = res.data.img ? res.data.img.split('|') : [];
        this.currProduct = res.data;
      })
      .catch(e => console.log(e))
  }



  editProduct() {
    let modal = this.modalCtrl.create('ProductEditPage', { id: this.currId });
    modal.present();

    modal.onWillDismiss(hasUpdate => {
      if (hasUpdate) {
        this.getDetail();
        this.events.publish('updateList:Product')
      }
    });
  }
}
