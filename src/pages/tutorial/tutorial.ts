import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, Slides} from 'ionic-angular';
import {Storage} from '@ionic/storage';

/**
 * Generated class for the TutorialPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
})
export class TutorialPage {

  @ViewChild('slides') slides: Slides;

  imgBox = [
    'assets/tutorial/slider1.jpg',
    'assets/tutorial/slider2.jpg'
  ];

  constructor(public navCtrl: NavController,
              private storage: Storage) {
  }

  /**
   * 退出教程,进入主程序
   */
  startApp() {
    this.navCtrl.push('LoginPage').then(() => {
      this.storage.set('hasSeenTutorial', true);
    })
  }

  /**
   * 进入视图时更新
   */
  ionViewWillEnter() {
    this.slides.update();
  }

}
