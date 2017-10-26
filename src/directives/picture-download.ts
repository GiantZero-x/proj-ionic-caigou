import { Directive, HostListener, ElementRef, Input } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { HttpProvider } from "../providers/http";

/**
 * Generated class for the PictureDownloadDirective directive.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
 * for more info on Angular Directives.
 */
@Directive({
  selector: '[picture-download]' // Attribute selector
})
export class PictureDownloadDirective {

  constructor(private el: ElementRef,
    private http: HttpProvider,
    private alertCtrl: AlertController) {
  }

  @Input('picture-download') fileName: string;

  @HostListener('press')
  onPress() {
    let alert = this.alertCtrl.create({
      title: '保存图片',
      message: '是否将图片保存在本地?',
      buttons: [
        {
          text: '取消',
          role: 'cancel'
        },
        {
          text: '确定',
          handler: () => {
            let src = this.el.nativeElement.src;
            let fileName = this.fileName ? (this.fileName + '.jpg') : src.substr(src.lastIndexOf('/') + 1);
            this.http.download(src, fileName);
          }
        }
      ]

    });
    alert.present();
  }

}
