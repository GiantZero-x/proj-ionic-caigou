import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, Events, ActionSheetController, ModalController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { ToastServiceProvider } from "../../providers/toast-service";
import { Helper } from "../../app/helper";
import { HttpProvider } from "../../providers/http";
import { PictureProvider } from "../../providers/picture";

/**
 * Generated class for the ProductEditPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-product-edit',
  templateUrl: 'product-edit.html',
})
export class ProductEditPage {
  editProduct: any = {
    id: null,
    suppliers_admin: {
      cus_short_name: null,
      cus_id: null
    },
    img: [],
    pro_name: '',
    pro_price: '',
    pro_box_quantity: '',
    pro_volume: '',
    pro_weight: '',
    pro_unit: '',
    pro_quantity: '',
    pro_detail: ''
  };

  submitted: number = 0;

  currId: string;

  // 是否显示选择商铺, 可传true(添加) 或stoId(修改)
  hideStore: any;

  constructor(public navParams: NavParams,
    public viewCtrl: ViewController,
    public toast: ToastServiceProvider,
    public events: Events,
    public helper: Helper,
    public http: HttpProvider,
    public actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController,
    public picService: PictureProvider) {
    // 前置页面 - 详情
    this.currId = navParams.data.id;

    // 前置页面 - 首页
    navParams.data.scanData && this.editProduct.img.push(navParams.data.scanData);

    // 添加固定商铺产品
    this.hideStore = navParams.data.hideStore || false;
  }

  ionViewWillEnter() {
    this.currId && this.getDetail();
  }

  /**
   * 获取详情
   */
  getDetail() {
    this.http.get('tradeapp/Product/detail', { id: this.currId })
      .then(res => {
        res.data.img = res.data.img ? res.data.img.split('|') : [];
        res.data.suppliers_admin || (res.data.suppliers_admin = {
          cus_short_name: null,
          cus_id: null
        });
        this.editProduct = res.data;
      })
      .catch(e => console.log(e))
  }

  // 保存
  applyEdit(form: NgForm) {
    /* TODO 应改为 < 1 */
    if (this.editProduct.img.length < 1) {
      return this.toast.open('请上传产品图片');
    }
    this.submitted++;
    form.valid && this.dismiss(this.editProduct);

  }

  // 取消
  dismiss(data?: any) {
    if (data) {
      let obj = {
        id: data['id'],
        pro_name: data['pro_name'],
        pro_price: data['pro_price'],
        pro_box_quantity: data['pro_box_quantity'],
        pro_volume: data['pro_volume'],
        pro_weight: data['pro_weight'],
        pro_unit: data['pro_unit'],
        pro_quantity: data['pro_quantity'],
        pro_detail: data['pro_detail'],
        img: data['img'].join('|'),
        suppliers_id: data['suppliers_admin']['cus_id'] || this.hideStore,
      };
      if (this.helper.validField(obj)) {
        this.http.post(`tradeapp/Product/${this.currId ? 'update' : 'add'}`, obj)
          .then(res => {
            if (res.code === 200) {
              /* 添加返回id, 更新不返回*/
              this.viewCtrl.dismiss(res.data || true)
            } else {
              this.toast.open('操作失败')
            }
          })
      }
    } else {
      this.viewCtrl.dismiss()
    }
  }

  // 上传图片
  upload() {
    let actionSheet = this.actionSheetCtrl.create({
      title: '图片',
      buttons: [
        {
          text: '拍照上传',
          icon: 'camera',
          handler: () => {
            this.picService.getPicture()
              .then(res => this.editProduct.img.push(res))
              .catch(err => console.log(err))
          }
        },
        {
          text: '相册上传',
          icon: 'albums',
          handler: () => {
            this.picService.choosePicture()
              .then(res => res && this.editProduct.img.push(res))
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
   * 选择商铺
   */
  chooseStore() {
    let modal = this.modalCtrl.create('StorePage', { isCheck: true, checkId: this.editProduct.suppliers_admin.cus_id });
    modal.present();

    modal.onDidDismiss(data => data && Object.assign(this.editProduct.suppliers_admin, data));
  }

}
