import {Component, ViewChild} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
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
  selector: 'page-around-cart',
  templateUrl: 'around-cart.html',
})
export class AroundCartPage {
  @ViewChild(Content) content: Content;

  // 当前商铺
  currentStore: any = {
    link_mans: []
  };

  // 当前订购车
  currentCart: any = [];


  // 是否是全选状态
  checkedAll: boolean = false;

  // 已选择商品的索引/id
  haveChecked: any = [];

  // 客户id
  cusId: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController,
              public toastCtrl: ToastServiceProvider,
              public http: HttpProvider) {
    this.cusId = navParams.data.cusId;
    this.currentStore = navParams.data.store;
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
    this.http.get('tradeapp/buy_car/suppliersProduct', {
      customer_id: this.cusId,
      suppliers_id: this.currentStore.cus_id,
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

  // 编辑产品
  editProduct(i) {
    let modal = this.modalCtrl.create('ProductEditPage', {id: this.currentCart[i].id, hideStore: true});
    modal.present();

    modal.onWillDismiss(hasUpdate => {
      if (hasUpdate) {
        this.updateProByIndex(i);
      }
    });
  }

  // 添加商品
  handleAdd() {
    let modal = this.modalCtrl.create('ProductPage', {
      isCheck: true,
      hideStore: this.currentStore.cus_id
    });
    modal.present();

    modal.onDidDismiss(res => {
      console.log(res)
      if (res) {
        this.http.post('tradeapp/buy_car/add', {
          customer_id: this.cusId,
          product_id: res.id,
          suppliers_id: this.currentStore.cus_id
        })
          .then(res => {
            this.toastCtrl.open(`添加${res.code === 200 ? '成功' : '失败'}`);
            this.getAllPro();
          })
      }
    });
  }

  // 根据索引更新产品
  updateProByIndex(i) {
    this.http.get('tradeapp/Product/detail', {id: this.currentCart[i].id})
      .then(res => {
        res.data.img = res.data.img ? res.data.img.split('|') : [];
        Object.assign(this.currentCart[i], res.data);
      })
      .catch(e => console.log(e))
  }

  /**
   * 获取商铺详情
   */
  getStoDetail() {
    this.http.get('tradeapp/Suppliers_Admin/detail', {id: this.currentStore.cus_id})
      .then(res => {
        this.currentStore = res.data;
      })
      .catch(e => console.log(e))
  }

  /**
   * 编辑商铺
   */
  editStore() {
    let modal = this.modalCtrl.create('StoreEditPage', {id: this.currentStore.cus_id});
    modal.present();

    modal.onWillDismiss(hasUpdate => {
      if (hasUpdate) {
        this.getStoDetail();
      }
    });
  }

  /**
   * 更新全选状态
   */
  updateCheckedAll() {
    let flagAll = true; // 是否全选
    this.haveChecked = [];
    // 若有一个未选则全选为false,否则为true
    this.currentCart.forEach((item, index) => item.checked ? this.haveChecked.push(item.id) : (flagAll = false));
    this.checkedAll = flagAll;
  }

  /**
   * 点击全选
   */
  clickCheckAll() {
    this.currentCart.forEach(item => item['checked'] = this.checkedAll);
    this.haveChecked = this.checkedAll ? this.currentCart.map(item => item.id) : [];
  }

  // 删除
  handleDelete() {
    this.alertCtrl.create({
      title: '<i class="gcIcon ion-ios-alert-outline"></i>确定删除?',
      message: '选中的 <strong>' + this.haveChecked.length + '</strong> 项商品移除后将不可恢复.',
      cssClass: 'text-danger',
      buttons: [
        {text: '取消'},
        {
          text: '确定',
          handler: () => {
            this.http.post('tradeapp/buy_car/delete', {
              customer_id: this.cusId,
              suppliers_id: this.currentStore.cus_id,
              product_ids: this.haveChecked.toString()
            }).then(res => {
              let msg: string = '删除';
              if (res.code === 200) {
                msg += '成功'
              } else {
                msg += '失败'
              }
              this.toastCtrl.open(msg);
              this.getAllPro();
              this.haveChecked = [];
            });
          }
        }
      ]
    }).present();
  }

  // 提交订购单
  cartSubmit() {
    this.alertCtrl.create({
      title: '<i class="gcIcon ion-md-checkmark"></i>确定提交?',
      message: '提交后可登陆ERP系统查看订购单.',
      cssClass: 'text-success',
      buttons: [
        {
          text: '取消'
        },
        {
          text: '确定',
          handler: () => {
            this.http.post('tradeapp/buy_car/sendErp', {
              customer_id: this.cusId,
              suppliers_id: this.currentStore.cus_id,
              product_ids: this.haveChecked.toString()
            }).then(res => {

              let msg: string = '提交';
              if (res.code === 200) {
                msg += '成功'
              } else {
                msg += '失败'
              }
              this.toastCtrl.open(msg);
              this.navCtrl.pop();
            });
          }
        }
      ]
    }).present();
  }
}
