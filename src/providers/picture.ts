import { Injectable } from '@angular/core';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { HttpProvider } from "./http";
// import {imageData} from "./mockImage"

/*
  Generated class for the PictureProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class PictureProvider {

  cameraOptions = {
    quality: 80,
    destinationType: this.camera.DestinationType.DATA_URL,   // DATA_URL: 返回图像作为base64编码的字符串 FILE_URI: 返回图片文件URL
    encodingType: this.camera.EncodingType.JPEG,
    allowEdit: false, //  是否允许编辑, (相册选择情况中,true会导致不响应)
    saveToPhotoAlbum: true, //  是否保存到相册
    correctOrientation: true //  旋转图片到正确的方向
  };

  constructor(private camera: Camera,
    private imagePicker: ImagePicker,
    private http: HttpProvider) {
  }

  /**
   * 上传名片获取信息
   */
  scanCard() {
    return new Promise((resolve, reject) => {
      /* TODO 测试代码, 打包需删除, 下方注释解掉 */
      /*this.http.uploadCard(imageData)
        .then(res => resolve(res))
        .catch(err => reject(err))*/
      this.camera.getPicture(this.cameraOptions)
        .then(imageData => {
          this.http.uploadCard(imageData)
            .then(res => resolve(res))
            .catch(err => reject(err))
        }, err => reject("CAMERA ERROR -> " + JSON.stringify(err)));
    })
  }

  /**
   * 拍照
   * @returns {String} 文件路径
   */
  getPicture() {
    return new Promise((resolve, reject) => {

      /* TODO 测试代码, 打包需删除, 下方注释解掉 */
      /*let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.http.uploadBase64(base64Image)
        .then(res => resolve(res))
        .catch(err => reject(err))*/
      this.camera.getPicture(this.cameraOptions).then(imageData => {
        let base64Image = 'data:image/jpeg;base64,' + imageData;
        this.http.uploadBase64(base64Image).then(res => resolve(res))
      }, err => {
        reject("CAMERA ERROR -> " + JSON.stringify(err));
      });
    })

  }

  /**
   * 相册选择
   * @param options
   */
  choosePicture(options: any = {}) {
    return new Promise((resolve, reject) => {
      // 多选调用imagePicker, 单选调用camera
      if (options.multiple) {
        this.imagePick(options.multiple.currNum, options.multiple.maxNum)
          .then(res => resolve(res))
          .catch(err => reject(err))
      } else {
        /* TODO 测试代码, 打包需删除, 下方注释解掉 */
        /*let base64Image = 'data:image/jpeg;base64,' + imageData;
        this.http.uploadBase64(base64Image)
          .then(res => resolve(res))
          .catch(err => reject(err));*/

        let photoLibraryOptions = Object.assign({}, this.cameraOptions, {
          saveToPhotoAlbum: false,
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
        });
        this.camera.getPicture(photoLibraryOptions).then(imageData => {

          if (options.scan) {
            this.http.uploadCard(imageData)
              .then(res => resolve(res))
              .catch(err => reject(err))
          } else {
            let base64Image = 'data:image/jpeg;base64,' + imageData;
            this.http.uploadBase64(base64Image)
              .then(res => resolve(res))
              .catch(err => reject(err));
          }
        }, err => {
          reject("CAMERA ERROR -> " + JSON.stringify(err));
        });
      }
    })

  }

  /**
   * 相册多选图片上传
   * @param {number} currNum    当前选择数
   * @param {number} maxNum     最大选择数, 默认8
   * @return {Promise<any>}
   */
  imagePick(currNum: number, maxNum: number = 8) {
    let options = {
      maximumImagesCount: maxNum - currNum,
      quality: 80,
      outputType: 0
    };
    return new Promise((resolve, reject) => {
      this.imagePicker.getPictures(options).then(async results => {
        let output = [];
        for (let i = 0; i < results.length; i++) {
          await this.http.uploadFileUrl(results[i]).then(res => output.push(res.replace(/"|\\/g, '')));
        }
        resolve(output);
      }, err => {
        reject("ImagePicker ERROR -> " + JSON.stringify(err));
      });
    })
  }

}

