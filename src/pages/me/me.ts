import { Component } from '@angular/core';
import { Events, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AppVersion } from '@ionic-native/app-version';
import { HttpProvider } from "../../providers/http";

/**
 * Generated class for the MePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-me',
  templateUrl: 'me.html',
})
export class MePage {

  user = {};
  version: string = '';
  versionCode: string = '';

  constructor(public storage: Storage,
    public events: Events,
    public alertCtrl: AlertController,
    public appVersion: AppVersion,
    public http: HttpProvider) {
  }

  ionViewDidLoad() {
    this.storage.get('userInfo').then(res => {
      this.user = res.user;
    });
    this.appVersion.getVersionNumber().then(res => {
      this.version = res;
    }).catch(err => console.log(err))
  }


  /**
   * 登出
   */
  logOut() {
    let alert = this.alertCtrl.create({
      title: '确定退出登陆?',
      buttons: [
        { text: '取消' },
        {
          text: '确定',
          handler: () => {
            this.http.post('tradeapp/login/loginOut');
            this.events.publish('user:logout');
          }
        }
      ]
    });
    alert.present();
  }

}
