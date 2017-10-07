/**
 * 辅助方法
 * */

import {Injectable} from '@angular/core';
import {ToastServiceProvider} from "../providers/toast-service";

@Injectable()
export class Helper {
  /* TODO 切换接口 */
  // protected URL = 'http://122.226.54.202:808/'; // 测试
  protected URL = 'https://www.sumsoarbest.com/api/';  // 生产
  // 全局状态
  _state = {
    API_URL: {
      common: this.URL,
      base64: 'tradeapp/Upload/base64Upload',
      file: this.URL + 'tradeapp/Upload/index',
      card: 'tradeapp/business_card/index',
      localFileDir: 'caigoubao',
      update: 'http://www.shangxiangchina.com/version/cgb.php'
    },
    VALID: {
      common: {
        rule: '^[+|,， /@\u4E00-\u9FA5A-Za-z0-9._-]*$',
        msg: '仅允许中文、字母、数字和-_+|/@'
      },
      tel: {
        rule: '^[\\d+-]+$',
        msg: '电话号码有误'
      },
      email: {
        rule: '^([a-zA-Z0-9_\\.\\-])+\\@(([a-zA-Z0-9\\-])+\\.)+([a-zA-Z0-9]{2,4})+$',
        msg: '邮箱格式不正确'
      },
      float: {
        rule: '^[1-9]\\d*(\\.\\d*)?$|^0\\.\\d*[1-9]\\d*$',
        msg: '请输入非负整数或小数'
      },
      integer: {
        rule: '^[1-9]\\d*$',
        msg: '请输入非负整数'
      }
    }
  };

  constructor(public toast: ToastServiceProvider) {
  }

  // already return a clone of the current state
  get state() {
    return this._state = Helper._clone(this._state);
  }

  // never allow mutation
  static set state(value) {
    throw new Error('do not mutate the `.state` directly');
  }

  static _clone(object) {
    // simple object clone
    return JSON.parse(JSON.stringify(object));
  }

  public get(prop?: any) {
    // use our state getter for the clone
    const state = this.state;
    return state.hasOwnProperty(prop) ? state[prop] : state;
  }

  public set(prop: string, value: any) {
    // internally mutate our state
    return this._state[prop] = value;
  }

  /**
   * 克隆对象
   * @param arg
   * @returns {any | {}}
   */
  public copyObj(...arg) {
    let i = 1,
      target = arg[0] || {},
      deep = false,
      length = arg.length,
      name, options, src, copy,
      copyIsArray, clone;



    // 如果第一个参数的数据类型是Boolean类型
    // target往后取第二个参数
    if (typeof target === 'boolean') {
      deep = target;
      // 使用||运算符，排除隐式强制类型转换为false的数据类型
      // 如'', 0, undefined, null, false等
      // 如果target为以上的值，则设置target = {}
      target = arg[1] || {};
      i++;
    }

    // 如果target不是一个对象或数组或函数
    if (typeof target !== 'object' && !(typeof target === 'function')) {
      target = {};
    }

    // 如果arg.length === 1 或
    // typeof arg[0] === 'boolean',
    // 且存在arg[1]，则直接返回target对象
    if (i === length) {
      return target;
    }

    // 循环每个源对象
    for (; i < length; i++) {
      // 如果传入的源对象是null或undefined
      // 则循环下一个源对象
      if (typeof (options = arg[i]) != null) {
        // 遍历所有[[emuerable]] === true的源对象
        // 包括Object, Array, String
        // 如果遇到源对象的数据类型为Boolean, Number
        // for in循环会被跳过，不执行for in循环
        for (name in options) {
          // src用于判断target对象是否存在name属性
          src = target[name];
          // copy用于复制
          copy = options[name];
          // 判断copy是否是数组
          copyIsArray = Array.isArray(copy);
          if (deep && copy && (typeof copy === 'object' || copyIsArray)) {
            if (copyIsArray) {
              copyIsArray = false;
              // 如果目标对象存在name属性且是一个数组
              // 则使用目标对象的name属性，否则重新创建一个数组，用于复制
              clone = src && Array.isArray(src) ? src : [];
            } else {
              // 如果目标对象存在name属性且是一个对象
              // 则使用目标对象的name属性，否则重新创建一个对象，用于复制
              clone = src && typeof src === 'object' ? src : {};
            }
            // 深复制，所以递归调用copyObject函数
            // 返回值为target对象，即clone对象
            // copy是一个源对象
            target[name] = this.copyObj(deep, clone, copy);
          } else if (copy !== undefined) {
            // 浅复制，直接复制到target对象上
            target[name] = copy;
          }
        }
      }
    }
    // 返回目标对象
    return target;
  }

  /**
   * 检查变量类型
   * @param o
   * @return {string}
   */
  public getType(o) {
    let _t;
    return ((_t = typeof(o)) == "object" ? Object.prototype.toString.call(o).slice(8, -1) : _t).toLowerCase();
  }

  public validField(obj) {
    let reg = new RegExp(this.get('VALID').common.rule);
    for (let key in obj) {
      if (obj.hasOwnProperty(key) && (typeof obj[key] === 'string')) {
        if (!reg.test(obj[key])) {
          console.log(key, obj[key]);
          this.toast.open(this.get('VALID').common.msg);
          return false;
        }
      }
    }
    return true;
  }

}
