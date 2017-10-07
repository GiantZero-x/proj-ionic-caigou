import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController, Events, Content, ViewController} from 'ionic-angular';
import {HttpProvider} from "../../providers/http";

/**
 * Generated class for the ProductPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage {

  @ViewChild(Content) content: Content;

  public list: any = [];         //  列表
  public searchKey: string = ''; //  关键词

  public page: number = 1;         //  当前页
  public hasMore: boolean = true;  //  是否还有更多

  public isCheck: boolean;     //  是否为选择操作
  public checkId: string;      //  选中id

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public events: Events,
              public modalCtrl: ModalController,
              public viewCtrl: ViewController,
              public http: HttpProvider,) {

    // 判断查看列表类型
    this.isCheck = Boolean(navParams.data.isCheck);

    // 修改后更新列表
    this.events.subscribe('updateList:Product', () => this.getList(true));
  }

  /**
   * 页面加载完成
   */
  ionViewDidLoad() {
    // 初始化时获取数据
    this.getList(true);
  }

  /**
   * 获取列表数据
   * @param isNew {Boolean} 是否清空list
   */
  public getList(isNew: boolean = false) {
    return new Promise((resolve, reject) => {
      let stoId = this.navParams.data.hideStore;
      // 如果传入商铺id则使用get接口,  否则使用Index接口
      this.http.get(`tradeapp/Product/${stoId ? 'getProduct' : 'index'}`, {
        page: this.page,
        searchKey: this.searchKey.trim(),
        suppliers_id: stoId
      })
        .then(res => {
          this.list = isNew ? res.data.data : this.list.concat(res.data.data);
          // 没有更多则关闭懒加载
          this.hasMore = res.data.hasmore;
          resolve()
        })
        .catch(e => reject(e));
    })
  }

  /**
   * 下拉刷新
   * @param refresher {Event} 刷新事件
   */
  public doRefresh(refresher?) {
    //  重置数据
    this.page = 1;
    this.hasMore = true;
    this.checkId = null;
    // 没有刷新事件则直接获取数据,
    if (refresher) {
      setTimeout(() => {
        this.getList(true)
          .then(() => refresher.complete())
          .catch(() => refresher.complete())
      }, 500)
    } else if (this.content) {
      this.content.scrollToTop().then(() => {
        this.getList(true);
      })
    } else {
      this.getList(true)
    }
  }

  /**
   * 懒加载
   * @param infiniteScroll  {Event} 懒加载事件
   */
  public doInfinite(infiniteScroll) {
    //  当前页自增
    this.page++;
    //  获取数据
    this.getList().then(() => {
      infiniteScroll.complete();
    })
  }


  /**
   * 查看
   * @param id  {String}  产品id
   */
  public handleCheck(id) {
    this.isCheck || this.navCtrl.push('ProductDetailPage', {id: id , isEdit: false})
  }

  /**
   * 添加
   */
  public handleAdd() {
    let modal = this.modalCtrl.create('ProductEditPage', {hideStore: this.navParams.data.hideStore});
    modal.present();

    modal.onDidDismiss(id => id && this.doRefresh());
  }

  /**
   * 关闭
   * @param {boolean} bool
   * @return {Object} Obj.data  产品信息
   */
  dismiss(bool: boolean = false) {
    let data = bool && Object.assign({}, this.list.filter(item => item.id === this.checkId)[0]);
    if (data) {
      data.img = data.img ? data.img.split('|') : [];
    }
    this.viewCtrl.dismiss(data)
  }

}
