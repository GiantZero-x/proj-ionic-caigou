import { Directive, HostListener, Input } from '@angular/core';
import { ModalController, AlertController } from 'ionic-angular';

/**
 * Generated class for the PictureSliderDirective directive.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
 * for more info on Angular Directives.
 */
@Directive({
  selector: '[picture-slider]' // Attribute selector
})
export class PictureSliderDirective {

  constructor(public modalCtrl: ModalController,
    public alertCtrl: AlertController) {
  }

  @Input('picture-slider') picArr: any; // [索引:string, 图片列表:array, 是否可删除:boolean]

  @HostListener('tap') onTap() {
    this.picArr[1][0] && this.modalCtrl
      .create('PictureModalPage', this.picArr)
      .present();
  }

  @HostListener('press') onPress() {
    this.picArr[2] && this.alertCtrl.create({
      title: '确定删除么?',
      buttons: [
        {
          text: '确定',
          handler: () => {
            this.picArr[1].splice(this.picArr[0], 1)
          }
        },
        {
          text: '取消'
        }
      ]
    }).present();
  }

}
