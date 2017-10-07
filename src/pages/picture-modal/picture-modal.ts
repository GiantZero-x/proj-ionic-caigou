import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the PictureModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-picture-modal',
  templateUrl: 'picture-modal.html',
})
export class PictureModalPage {
  images: any = [];
  index: number = 0;

  constructor(public navParams: NavParams,
    public viewCtrl: ViewController) {
    this.images = navParams.data[1];
    this.index = navParams.data[0];
  }

}
