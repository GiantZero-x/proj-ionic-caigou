import { Component } from '@angular/core';
import { NavController, ActionSheetController, AlertController, ModalController } from 'ionic-angular';
import { HttpProvider } from "../../providers/http";
import { PictureProvider } from "../../providers/picture";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  //  首页数据
  homeData: any = {
    month: {
      customers: 0,
      products: 0
    },
    week: {
      customers: 0,
      products: 0
    }
  };

  constructor(public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public picture: PictureProvider,
    public http: HttpProvider) {

  }

  //  进入页面更新/获取数据
  ionViewDidEnter() {
    this.http.get('tradeapp/Index/index')
      .then(res => this.homeData = res)
      .catch((err) => console.log(err))
  }

  /**
   * 扫描名片或者添加产品
   */
  scan() {
    let action = this.actionSheetCtrl.create({
      buttons: [
        {
          text: '上传名片',
          icon: 'qr-scanner',
          handler: () => {
            // 调用 camera服务 scanBusinessCard方法, 拍照上传图片进行识别
            this.picture.scanCard()
              .then(res => {
                // 识别结束询问添加类型
                let alert = this.alertCtrl.create({
                  cssClass: 'no-alert-head',
                  buttons: [
                    {
                      text: '添加一个客户',
                      handler: () => {
                        this.handleAdd(res, 'Customer');
                      }
                    },
                    {
                      text: '添加一个商铺',
                      handler: () => {
                        this.handleAdd(res, 'Store');
                      }
                    }
                  ]
                });
                alert.present();
              })
              .catch(err => console.log(err)
              )
          }
        }, {
          text: '添加产品',
          icon: 'add-circle',
          handler: () => {
            action.dismiss()
              .then(() => {
                this.picture.getPicture()
                  .then(res => {
                    this.handleAdd(res, 'Product');
                  })
                  .catch(err => console.log(err))
              });
            return false;
          }
        }, {
          text: '取消',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    action.present();
  }

  /**
   * 首页添加
   * @param data
   * @param type
   */
  handleAdd(data: any, type: string) {
    let modal = this.modalCtrl.create(type + 'EditPage', { scanData: data });
    modal.present();
  }
}
