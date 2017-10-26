import { Component, ViewChild } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ActionSheetController,
  ModalController
} from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { Keyboard } from '@ionic-native/keyboard';
import { ToastServiceProvider } from "../../providers/toast-service";
import { HttpProvider } from "../../providers/http";
import { Helper } from "../../app/helper";
import { PictureProvider } from "../../providers/picture";

/**
 * Generated class for the AroundProductPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-around-product',
  templateUrl: 'around-product.html'
})
export class AroundProductPage {
  //  客户id
  cusId: string;
  //  商铺信息
  stoInfo: any = {
    cus_short_name: null,
    cus_id: null
  };
  //  当前产品信息
  currProduct: any = {
    id: null,
    img: [],
    pro_name: '',
    pro_price: '',
    pro_box_quantity: '',
    pro_volume: '',
    pro_weight: '',
    pro_unit: '',
    pro_quantity: '',
    pro_detail: '',
    suppliers_id: null
  };
  //  购物车商品数
  cartNum: number = 0;
  //  表单对象
  @ViewChild('editForm') currentForm: NgForm;

  // 提交动作
  submitted: number = 0;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public toastCtrl: ToastServiceProvider,
    public actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController,
    public http: HttpProvider,
    public helper: Helper,
    public picService: PictureProvider,
    public keyboard: Keyboard, ) {
    // 客户id赋值
    this.cusId = navParams.data.cusId;

  }

  /**
   * 能否提交
   * @return {boolean}
   */
  disSubmit() {
    return !(this.stoInfo.cus_id && this.currProduct.pro_price && this.currProduct.pro_box_quantity && this.currProduct.pro_unit)
  }

  /**
   * 离店
   */
  handleExit() {
    let alert = this.alertCtrl.create({
      title: '提示',
      message: '确认离开本店吗?',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          cssClass: 'bg-light'
        },
        {
          text: '离开',
          cssClass: 'bg-primary',
          handler: () => {
            this.goToWhere(alert.dismiss());
            return false;
          }
        }
      ]
    });
    this.stoInfo.cus_id ? alert.present() : this.goToWhere();

  }

  /**
   * 离店去向
   * @param navTransition
   */
  goToWhere(navTransition?) {
    this.alertCtrl.create({
      cssClass: 'no-alert-head',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: '查看客户成果',
          cssClass: 'bg-light',
          handler: () => {
            // 设置业务页为根视图,然后推入客户所属商铺页
            Promise.all([
              navTransition,
              this.navCtrl.popToRoot()
            ]).then(() => {
              this.navCtrl.push('StoreListPage', { cusId: this.cusId })
            });
          }
        },
        {
          text: '继续逛下一家',
          cssClass: 'bg-primary',
          handler: () => {
            this.resetFiled(true);
          }
        }
      ]
    }).present();
  }

  /**
   * 提交至采购车
   * @param form
   */
  submitCheck(form: NgForm) {
    this.submitted++;
    if (form.valid && this.currProduct.img.length > 0) {

      let obj = {
        id: this.currProduct.id,
        img: this.currProduct.img.join('|'),
        pro_name: this.currProduct.pro_name,
        pro_price: this.currProduct.pro_price,
        pro_box_quantity: this.currProduct.pro_box_quantity,
        pro_volume: this.currProduct.pro_volume,
        pro_weight: this.currProduct.pro_weight,
        pro_unit: this.currProduct.pro_unit,
        pro_quantity: this.currProduct.pro_quantity,
        pro_detail: this.currProduct.pro_detail,
        suppliers_id: this.currProduct.suppliers_id
      };


      if (this.helper.validField(obj)) {
        // 先选产品, 再选商铺, 需判断是不是此商铺产品, 若不是则添加相同产品
        if (obj.suppliers_id !== this.stoInfo.cus_id) {
          obj.id = null;
          obj.suppliers_id = this.stoInfo.cus_id
        }
        // 更新或修改产品
        this.http.post(`tradeapp/Product/${obj.id ? 'update' : 'add'}`, obj)
          .then(res => {
            if (res.code === 200) {
              this.http.post('tradeapp/buy_car/add', {
                customer_id: this.cusId,
                product_id: res.data || obj.id,
                suppliers_id: this.stoInfo.cus_id
              })
                .then(res => {
                  this.toastCtrl.open(`添加${res.code === 200 ? '成功' : '失败'}`);
                  this.resetFiled();
                  this.getCartNum();
                })
            }
          });
      }
    } else {
      this.toastCtrl.open("请上传产品图片");
    }
  }

  /**
   * 重置字段
   * @param deep {Boolean} 是否清除商铺
   */
  resetFiled(deep: boolean = false) {
    this.currentForm.reset();
    this.currProduct.id = null;
    this.currProduct.suppliers_id = null;
    this.currProduct.img = [];
    this.submitted = 0;
    if (deep) {
      this.cartNum = 0;
      this.stoInfo = {}
    }
  }

  /**
   * 查看购物车
   */
  goToCart() {
    this.navCtrl.push('AroundCartPage', { store: this.stoInfo, cusId: this.cusId });
  }

  /**
   * 上传商品图片
   */
  uploadCard() {
    let actionSheet = this.actionSheetCtrl.create({
      title: '图片',
      buttons: [
        {
          text: '产品列表',
          icon: 'list',
          handler: () => {
            let modal = this.modalCtrl.create('ProductPage', { isCheck: true, hideStore: this.stoInfo.cus_id });
            modal.present();

            modal.onDidDismiss(data => {
              if (data) {
                for (let key in this.currProduct) {
                  if (this.currProduct.hasOwnProperty(key)) {
                    this.currProduct[key] = data[key]
                  }
                }
              }
            });
          }
        },
        {
          text: '拍照上传',
          icon: 'camera',
          handler: () => {
            this.picService.getPicture()
              .then(res => this.currProduct.img.push(res))
              .catch(err => console.log(err))
          }
        },
        {
          text: '相册上传',
          icon: 'albums',
          handler: () => {
            this.picService.choosePicture()
              .then(res => res && this.currProduct.img.push(res))
              .catch(err => console.log(err))
          }
        },
        {
          text: '取消',
          icon: 'close',
        }
      ]
    });

    actionSheet.present();
  }

  /**
   * 修改商铺
   */
  changeStore() {
    let modal = this.modalCtrl.create('StorePage', { isCheck: true, checkId: this.stoInfo.cus_id });
    modal.present();

    modal.onDidDismiss(data => {
      data && Object.assign(this.stoInfo, data);
      this.getCartNum();
    });
  }

  /**
   * 检查是否可以离开
   */
  canLeave() {
    let outPut = true;
    for (let key in this.currProduct) {
      if (this.currProduct.hasOwnProperty(key)) {
        let v = this.currProduct[key];
        if (!(v === null || v.length === 0)) {
          outPut = false;
          break;
        }
      }
    }

    return new Promise((resolve, reject) => {
      if (outPut || !this.stoInfo.cus_id) {
        resolve()
      } else {
        this.alertCtrl.create({
          title: '提示',
          message: '是否放弃当前录入信息?',
          buttons: [{
            text: '放弃',
            handler: () => resolve()
          }, {
            text: '取消',
            handler: () => reject()
          }]
        }).present()
      }
    })
  }

  async ionViewCanLeave() {
    let bool: boolean;
    await this.canLeave().then(() => bool = true).catch(() => bool = false);
    return bool
  }

  /**
   * 获取当前商铺购物车数量
   */
  getCartNum() {
    // 选择商铺后, 进入页面则重新获取购物车数量
    this.stoInfo.cus_id && this.http.get('tradeapp/buy_car/suppliersProduct', {
      customer_id: this.cusId,
      suppliers_id: this.stoInfo.cus_id
    })
      .then(res => {
        this.cartNum = res.data ? res.data.length : 0;
      });
  }

  ionViewDidEnter() {
    this.getCartNum()
  }

  /**
   * 收起键盘
   * @param e
   */
  closeKeyBoard(e) {
    if (e.which === 13) {
      this.keyboard.close();
    }
  }

}
