import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MeDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-me-detail',
  templateUrl: 'me-detail.html',
})
export class MeDetailPage {

  user = {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.user = navParams.data;
  }

}
