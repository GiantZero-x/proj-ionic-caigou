import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Events, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from "@ionic/storage";
import { Network } from '@ionic-native/network';
import { AppVersion } from '@ionic-native/app-version';
import { TabsPage } from '../pages/tabs/tabs';
import { HttpProvider } from "../providers/http";
import { ImagePicker } from '@ionic-native/image-picker';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;
  rootPage: any;

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public storage: Storage,
    public events: Events,
    public appVersion: AppVersion,
    public http: HttpProvider,
    public network: Network,
    public alertCtrl: AlertController,
    public iab: InAppBrowser,
    public imagePicker: ImagePicker) {
    // 检查用户是否已经看过该教程
    this.storage.get('hasSeenTutorial')
      .then(hasSeenTutorial => {
        if (hasSeenTutorial) {  // 看过
          // 检查是否登录
          this.storage.get('hasLoggedIn')
            .then(hasLoggedIn => {
              // 登陆跳至主页, 否则跳至登陆页
              this.rootPage = hasLoggedIn ? TabsPage : 'LoginPage';
            });
        } else {  // 没看过则跳至教程页
          this.rootPage = 'TutorialPage';
        }
        this.platformReady()
      });

    this.listenToEvents();
  }

  /**
   * 设备准备完成
   */
  platformReady() {
    // Call any initial plugins when ready
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.imagePicker.hasReadPermission()
        .then(bool => {
          /* 检查更新 */
          if (bool) {
            this.checkUpdate();
          } else {
            this.imagePicker.requestReadPermission()
              .then(() => {
                this.checkUpdate();
              })
              .catch(err => console.log('获取读取权限失败'))
          }
        })
        .catch(err => console.log('检测读取权限失败'));

      /* 检查网络 */
      console.log('网络类型: ' + this.network.type)
      /*// watch network for a disconnect
      let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
        console.log('network was disconnected :-(');
      });

      // watch network for a connection
      let connectSubscription = this.network.onConnect().subscribe(() => {
        console.log('network connected!');
        // We just got a connection but we need to wait briefly
        // before we determine the connection type. Might need to wait.
        // prior to doing any api requests as well.
        setTimeout(() => {
          if (this.network.type === 'wifi') {
            console.log('we got a wifi connection, woohoo!');
          }
        }, 3000);
      });*/
    });


  }

  /**
   * 检查更新
   */
  checkUpdate() {

    let isIos = this.platform.is('ios');
    this.http.checkUpdate()
      .then((data: any) => {
        this.appVersion.getVersionCode()
          .then(version => {
            console.log("version=====本机>>>" + version + "====>>服务器" + data.versionCode + '-' + data.version);
            if ((!isIos && version < data.versionCode) || (isIos && version != data.version)) {  //  安卓和苹果版本校验
              let confirm = this.alertCtrl.create({
                title: `发现新版本(${data.version})`,
                message: `<b>更新日志：</b><br/>
                          ${data.description.substr(0, 50)}...<br/>
                          此版本为${data.updateFlag == 1 ? '可选' : '<strong> 必选 </strong>'}更新，是否立即更新？`,
                enableBackdropDismiss: false,
                buttons: [
                  {
                    text: '取消',
                    handler: () => {
                      //  强制升级取消则退出APP
                      data.updateFlag == 2 && this.platform.exitApp();
                    }
                  },
                  {
                    text: `立即更新${this.network.type === 'wifi' ? '' : '（非Wifi环境！）'}`,
                    handler: () => {
                      if (isIos) {
                        this.iab.create(data.app_url);
                      } else {
                        this.http.download(data.downuurl, `${data.sitename}-${data.versionCode}.apk`, true)
                          .then(res => {
                            console.log('下载完成' + res);
                          })
                          .catch(err => console.log('下载文件出错,' + JSON.stringify(err)))
                      }
                    }
                  }
                ]
              });
              confirm.present();
            }
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }

  /**
   * 监听全局事件
   */
  listenToEvents() {
    /**
     * 监听用户登录事件
     * 设置登录flag, 存储用户信息, => 跳至主页
     */
    this.events.subscribe('user:login', (userInfo, loginName) => {
      Promise.all([
        // 设置登录flag
        this.storage.set('hasLoggedIn', true),
        // 设置存储用户信息
        this.storage.set('userInfo', userInfo),
        // 记录本次登录用户名
        this.storage.set('lastLoginName', loginName),
      ])
        .then(() => this.nav.setRoot(TabsPage))
    });

    /**
     * 监听用户登出事件
     * 清除登陆flag, 清除用户信息, => 跳至登录页
     */
    this.events.subscribe('user:logout', () => {
      Promise.all([
        this.storage.remove('userInfo'),
        this.storage.remove('hasLoggedIn')
      ])
        .then(() => this.nav.setRoot('LoginPage'))
    });
  }
}
