import {Component} from '@angular/core';
import {IonicPage, LoadingController, Events} from 'ionic-angular';
import {NgForm} from '@angular/forms';
import {ToastServiceProvider} from "../../providers/toast-service";
import {Storage} from '@ionic/storage';
import {HttpProvider} from "../../providers/http";

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  //  登陆信息模型
  loginInfo = {
    username: '',
    password: ''
  };

  // 背景图片
  backgroundImage = 'assets/bgImage/background.jpg';

  // Logo
  logoImage = 'assets/icon/logo.png';

  // 是否已提交
  submitted: number = 0;

  // 是否可离开
  canLeave: boolean = false;

  constructor(public loadingCtrl: LoadingController,
              public events: Events,
              public toast: ToastServiceProvider,
              public storage: Storage,
              public http: HttpProvider) {
    // 读取历史登录用户名
    this.storage.get('lastLoginName').then(res => this.loginInfo.username = res);
  }

  /**
   * 视图是否可进入
   * @returns {Promise<boolean>}
   */

  async ionViewCanEnter() {
    let canEnter: boolean;
    // 若已登录则返回false, 阻止进入页面
    await this.storage.get('hasLoggedIn').then(hasLoggedIn => (canEnter = !hasLoggedIn));
    return canEnter;
  }

  /**
   * 视图是否可离开
   * @returns {boolean}
   */
  ionViewCanLeave() {
    return this.canLeave;
  }

  /**
   * 登陆
   * @param form  {Object}  表单对象
   */
  login(form?: NgForm) {
    this.submitted++;
    if (form.valid) {
      let loading = this.loadingCtrl.create({content: "正在登录..."});
      loading.present();
      this.http
        .post('tradeapp/login/login', this.loginInfo)
        .then(res => {
          if (res.code === 200) {
            this.canLeave = true;
            this.events.publish('user:login', res.data, this.loginInfo.username);
          } else {
            this.toast.open(res.msg)
          }
          loading.dismiss();
        })
        .catch(() => loading.dismiss());
    }
  }

  /**
   * 回车登录
   * @param key
   * @param form
   */
  quickLogin(key, form) {
    key === 13 && this.login(form)
  }

}
