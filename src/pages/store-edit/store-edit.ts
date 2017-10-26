import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ActionSheetController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { PictureProvider } from "../../providers/picture";
import { ToastServiceProvider } from "../../providers/toast-service"
import { Helper } from "../../app/helper";
import { HttpProvider } from "../../providers/http";

/**
 * Generated class for the StoreEditPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-store-edit',
  templateUrl: 'store-edit.html',
})
export class StoreEditPage {
  editStore: any = {
    cus_id: null,
    cus_picpath: null,
    cus_short_name: null,
    cus_addr: null,
    link_mans: [{
      link_name: null,
      link_phone: null,
      link_email: null,
      link_position: null
    }]
  };
  submitted: number = 0;

  currId: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public toast: ToastServiceProvider,
    public camera: PictureProvider,
    public actionSheetCtrl: ActionSheetController,
    public picService: PictureProvider,
    public http: HttpProvider,
    public helper: Helper) {
    this.currId = navParams.data.id;
    Object.assign(this.editStore, navParams.data.scanData)
  }

  ionViewWillEnter() {
    this.currId && this.getDetail();

  }

  /**
   * 获取详情
   */
  getDetail() {
    this.http.get('tradeapp/Suppliers_Admin/detail', { id: this.currId })
      .then(res => {
        res.data.link_mans[0] || res.data.link_mans.push({
          link_name: null,
          link_phone: null,
          link_email: null,
          link_position: null
        });
        this.editStore = res.data;
      })
      .catch(e => console.log(e))
  }

  // 保存
  applyEdit(form: NgForm) {
    this.submitted++;
    if (form.valid) {
      this.dismiss(this.editStore);
    }
  }

  // 取消
  dismiss(data?: any) {
    if (data) {
      let obj = {
        cus_id: data['cus_id'],
        cus_picpath: data['cus_picpath'],
        cus_short_name: data['cus_short_name'],
        cus_addr: data['cus_addr'],
        id: data['link_mans'][0]['id'],
        link_name: data['link_mans'][0]['link_name'],
        link_phone: data['link_mans'][0]['link_phone'],
        link_email: data['link_mans'][0]['link_email'],
        link_position: data['link_mans'][0]['link_position'],
      };
      if (this.helper.validField(obj)) {
        this.http.post(`tradeapp/Suppliers_Admin/${this.currId ? 'update' : 'add'}`, obj)
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

  // 上传名片
  upload() {
    let actionSheet = this.actionSheetCtrl.create({
      title: '名片',
      buttons: [
        {
          text: '拍照上传',
          icon: 'qr-scanner',
          handler: () => {
            this.picService.scanCard()
              .then(res => this.helper.copyObj(true, this.editStore, res))
              .catch(err => console.log(err))
          }
        },
        {
          text: '相册上传',
          icon: 'albums',
          handler: () => {
            this.picService.choosePicture({ scan: true })
              .then(res => res && this.helper.copyObj(true, this.editStore, res))
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

}

