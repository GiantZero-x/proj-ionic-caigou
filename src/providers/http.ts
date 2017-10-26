import { Injectable } from '@angular/core';
import { LoadingController, Events } from 'ionic-angular';
import { Http, RequestOptions, Headers } from '@angular/http';
import { HTTP } from '@ionic-native/http';
import { Helper } from "../app/helper";
import { Storage } from '@ionic/storage';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import 'rxjs/add/operator/toPromise';
import { ToastServiceProvider } from "./toast-service";

/*
  Generated class for the HttpProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class HttpProvider {

  API_URL: any = this.helper.get('API_URL');

  // 文件传输实例
  fileTransfer: FileTransferObject = this.transfer.create();

  constructor(public http: Http,
    private ioHttp: HTTP,
    public loadingCtrl: LoadingController,
    public file: File,
    public events: Events,
    public transfer: FileTransfer,
    public helper: Helper,
    public storage: Storage,
    public fileOpener: FileOpener,
    public toast: ToastServiceProvider) {
  }

  /**
   * GET
   * @param url         {String}
   * @param parameters  {Object}
   * @returns {Promise<ResData>}
   */
  async get(url: string, parameters: Object = {}) {
    let token = await this.storage.get('userInfo').then(res => res && res.token);
    let header = new Headers({ 'Content-Type': 'application/json', token: token });
    let options = new RequestOptions({ params: parameters, headers: header });
    return this.http.get(this.API_URL.common + url, options)
      .toPromise()
      .then(res => this.onResponse(res))
      .catch(err => this.onError(err));
  }

  /**
   * POST
   * @param url   {String}
   * @param body  {Object}
   * @returns {Promise<ResData>}
   */
  async post(url: string, body: Object = {}) {
    let token = await this.storage.get('userInfo').then(res => res && res.token);
    let header = new Headers({ 'Content-Type': 'application/json', token: token });
    let options = new RequestOptions({ headers: header });
    return this.http.post(this.API_URL.common + url, body, options)
      .toPromise()
      .then(res => this.onResponse(res))
      .catch(err => this.onError(err));
  }

  /**
   * uploadBase64
   * @param imgData  {String}  文件本地地址
   */
  uploadBase64(imgData) {
    let loading = this.loadingCtrl.create();
    loading.present();
    return this.post(this.API_URL.base64, { base64: imgData })
      .then(res => {
        loading.dismiss();
        return res
      })
      .catch(err => {
        loading.dismiss();
        return err
      })
  }

  /**
   * uploadFileUrl
   * @param fileURL  {String}  文件本地地址
   */
  async uploadFileUrl(fileURL) {
    let loading = this.loadingCtrl.create();
    loading.present();
    let token = await this.storage.get('userInfo').then(res => res && res.token);
    let options: FileUploadOptions = {
      fileKey: 'fileList',
      fileName: fileURL.split('/').reverse()[0],
      mimeType: "text/plain",
      headers: { token: token }
    };

    return this.fileTransfer.upload(fileURL, this.API_URL.file, options)
      .then(res => {
        loading.dismiss();
        return res.response
      }, err => {
        loading.dismiss();
        return err
      })
  }

  /**
   * 名片识别
   * @param imgData
   * @returns {Promise<Promise<T>>}
   */
  uploadCard(imgData) {
    let loading = this.loadingCtrl.create();
    loading.present();

    return this.post(this.API_URL.card, { data: imgData })
      .then(res => {

        let data = JSON.parse(res['card']['outputs'][0]['outputValue']['dataValue']);

        loading.dismiss();

        if (!res.card) {
          this.toast.open('无法识别');
        }
        /* 组装数据 */
        return {
          cus_photo: res['imgPath'],
          cus_picpath: res['imgPath'],
          cus_full_name: data['company'][0],
          cus_short_name: data['company'][0],
          cus_addr: data['addr'][0].replace(/:/g, ''),
          link_mans: [{
            cusl_tel: data['tel_cell'][0],
            cusl_name: data['name'],
            link_email: data['email'][0],
            link_position: data['title'][0],
            link_name: data['name'],
            link_phone: data['tel_cell'][0]
          }]
        };
      })
      .catch(err => loading.dismiss())
  }

  /**
   * 检查本地目录是否存在 caigoubao
   */
  checkDir() {
    return new Promise((resolve, reject) => {
      this.file.checkDir(this.file.externalRootDirectory, this.helper.state.API_URL.localFileDir)
        .then(() => resolve())
        .catch(() => {
          this.file.createDir(this.file.externalRootDirectory, this.helper.state.API_URL.localFileDir, true)
            .then(entry => resolve())
            .catch(err => reject(err))
        });
    })
  }

  /**
   * 下载文件
   * @param url
   * @param fileName
   * @param willOpen
   */
  download(url: string, fileName: string, willOpen: boolean = false) {
    return new Promise((resolve, reject) => {
      let fileUrl = `${this.file.externalRootDirectory}/${this.helper.state.API_URL.localFileDir}/${fileName}`;
      this.checkDir()
        .then(() => {
          this.file.checkFile(`${this.file.externalRootDirectory}/${this.helper.state.API_URL.localFileDir}/`, fileName)
            .then(() => {
              this.toast.open('文件已存在');
              willOpen && this.openFile(fileUrl, 'application/vnd.android.package-archive');
              resolve(fileUrl);
            })
            .catch(() => {
              /*let loader = this.loadingCtrl.create({content: '正在下载...'});
              loader.present();*/
              this.toast.open('开始下载');
              this.fileTransfer.download(url, fileUrl, true)
                .then(() => {
                  this.toast.open('下载成功');
                  // loader.dismiss();
                  willOpen && this.openFile(fileUrl, 'application/vnd.android.package-archive');
                  resolve(fileUrl);
                }, err => {
                  // loader.dismiss();
                  reject(err)
                });
            })
        })
        .catch(err => reject(err))
    })

  }

  /**
   *  打开文件
   *  @param filePath {String}
   *  @param fileMIMEType {String} 文件类型, 默认jpg
   */
  openFile(filePath: string, fileMIMEType: string = 'image/jpeg') {
    this.fileOpener.open(filePath, fileMIMEType)
      .then(() => {
      })
      .catch(e => console.log('Error openening file', JSON.stringify(e)));
  }

  /**
   * 检查更新
   */
  checkUpdate() {
    return new Promise((resolve, reject) => {
      this.ioHttp.get(this.API_URL.update, {}, {})
        .then(res => resolve(JSON.parse(res.data)))
        .catch(err => reject(err))
    })
  }

  /**
   * 响应成功
   * @param res
   * @return {Promise<any>}
   */
  private onResponse(res) {
    return res.json();
  }

  /**
   * 响应失败
   * @param err
   * @return {Promise<never>}
   */
  private onError(err) {
    console.log(err.status)
    if (err.status >= 400 && err.status < 600) {
      if (err.status === 401) {
        this.toast.open('用户令牌过期, 将在 3s 后重新登录...', {
          end: () => this.events.publish('user:logout')
        })
      } else {
        const body = JSON.parse(err._body);
        this.toast.open(body.msg, { time: 3 })
      }
    } else {
      this.toast.open('网络错误')
    }
    return Promise.reject(err);
  }
}
