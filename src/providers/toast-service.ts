import { Injectable } from '@angular/core';
import '../assets/plugin/layer-mobile/layer.js'

/*
  Generated class for the ToastServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ToastServiceProvider {

  protected _layer = window['layer'];

  constructor() {
  }

  /**
   *
   * @param content
   * @param options
   * @param options.type        {Number}  设置弹层的类型 默认：0 （0表示信息框，1表示页面层，2表示加载层）
   * @param options.content     {String}  设置弹层内容
   * @param options.title       {String | Array}  设置弹层标题，为空则不显示 默认：空，值可以为字符串或者数组  ['标题', 'background-color: #eee;']
   * @param options.time        {Number}  控制自动关闭层所需秒数 默认不开启，支持整数和浮点数
   * @param options.style       {String}  自定义层的样式 style: 'border:none; background-color:#78BA32; color:#fff;',
   * @param options.skin        {String}  设定弹层显示风格 目前支持配置 footer（即底部对话框风格）、msg（普通提示） 两种风格。
   * @param options.className   {String}  自定义一个css类
   * @param options.btn         {String | Array}  按钮  不设置则不显示按钮。如果只需要一个按钮，则btn: '按钮'，如果有两个，则：btn: ['按钮一', '按钮二']。
   * @param options.anim        {String | Boolean}   动画类型  可支持的支持动画配置：scale（默认）、up（从下往上弹出），如果不开启动画，设置false即可
   * @param options.shade       {String | Boolean}  控制遮罩展现  默认：true，该参数可允许你是否显示遮罩，并且定义遮罩风格
   * @param options.shadeClose  {Boolean}  是否点击遮罩时关闭层 默认：true
   * @param options.fixed       {Boolean}  是否固定层的位置 默认：true
   * @param options.top         {Number}  控制层的纵坐标 默认：无，一般情况下不需要设置，因为层会始终垂直水平居中，只有当fixed: false时top才有效。
   * @param options.success     {Function}  层成功弹出层的回调  该回调参数返回一个参数为当前层元素对象
   * @param options.yes         {Function}  点确定按钮触发的回调函数，返回一个参数为当前层的索引
   * @param options.no          {Function}  点取消按钮触发的回调函数
   * @param options.end         {Function}  层彻底销毁后的回调函数
   * @returns {Number} 弹窗索引
   */

  open(content, options = {}) {
    options['content'] = content;
    if (!options['skin']) {
      options['skin'] = 'msg';
      options['time'] = 2
    }
    return this._layer.open(options)
  }

  /**
   * 关闭指定弹窗
   * @param i {Number} 弹窗索引
   */
  close(i) {
    return this._layer.close(i)
  }

  /**
   * 关闭全部弹窗
   */
  closeAll() {
    return this._layer.closeAll
  }

}
