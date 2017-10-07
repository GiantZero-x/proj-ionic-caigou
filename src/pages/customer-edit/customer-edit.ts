import {Component} from '@angular/core';
import {Events, IonicPage, NavController, NavParams, ViewController, ActionSheetController} from 'ionic-angular';
import {HttpProvider} from "../../providers/http";
import {Helper} from "../../app/helper";
import {NgForm} from '@angular/forms';
import {ToastServiceProvider} from "../../providers/toast-service";
import {PictureProvider} from "../../providers/picture";

/**
 * Generated class for the CustomerEditPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-customer-edit',
  templateUrl: 'customer-edit.html',
})
export class CustomerEditPage {

  public editCustomer: any = {

    cus_id: null,
    cus_photo: null,
    cus_country: null,
    cus_status: '意向',
    cus_full_name: null,
    cus_short_name: null,

    link_mans: [{
      cus_id: null,
      cusl_tel: null
    }]
  };

  submitted: number = 0;

  cus_ID: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public http: HttpProvider,
              public helper: Helper,
              public viewCtrl: ViewController,
              public events: Events,
              public toast: ToastServiceProvider,
              public picService: PictureProvider,
              public camera: PictureProvider,
              public actionSheetCtrl: ActionSheetController,) {
    this.cus_ID = navParams.data.id;
    Object.assign(this.editCustomer, navParams.data.scanData)
  }

  ionViewDidLoad() {

    this.cus_ID && this.getDetail();
  }

  /**
   * 请求数据
   */
  getDetail() {


    this.http.get('tradeapp/Customer/detail', {id: this.cus_ID})
      .then(res => {

        res.data.link_mans[0] || res.data.link_mans.push({
          cusl_tel: '',
          cusl_name: ''
        });

        this.editCustomer = res.data;


      })
      .catch(e => console.log(e))
  }


  dismiss(data ?: any) {

    if (data) {
      let obj = {
        cus_id: data['cus_id'],
        cus_photo: data['cus_photo'],
        cus_country: data['cus_country'],
        cus_status: data['cus_status'],
        cus_full_name: data['cus_full_name'],
        cus_short_name: data['cus_short_name'],
        cusl_id: data['link_mans'][0]['cusl_id'],
        cusl_tel: data['link_mans'][0]['cusl_tel']
      };

      if (this.helper.validField(obj)) {

        this.http.post(`tradeapp/customer/${this.cus_ID ? 'update' : 'add'}`, obj)
          .then(res => {
            if (res.code === 200) {
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

  // 保存
  applyEdit(form: NgForm) {
    this.submitted++;
    if (form.valid) {
      this.dismiss(this.editCustomer);

    }
  }

  upload() {

    let actionSheet = this.actionSheetCtrl.create({
      title: '名片',
      buttons: [
        {
          text: '拍照上传',
          icon: 'qr-scanner',
          handler: () => {
            this.picService.scanCard()
              .then(res => this.helper.copyObj(true, this.editCustomer, res))
              .catch(err => console.log(err))
          }
        },
        {
          text: '相册上传',
          icon: 'albums',
          handler: () => {
            this.picService.choosePicture({scan: true})
              .then(res => res && this.helper.copyObj(true, this.editCustomer, res))
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
