import {Directive, ElementRef, Input, OnChanges} from '@angular/core';
import {Helper} from "../app/helper";

/**
 * Generated class for the ShowErrDirective directive.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
 * for more info on Angular Directives.
 */
@Directive({
  selector: '[show-err]' // Attribute selector
})
export class ShowErrDirective implements OnChanges {

  @Input('show-err') msgArr: any;

  timer = null;

  constructor(private el: ElementRef,
              private helper: Helper) {
    el.nativeElement.classList.add('errmsg', 'wobble')
  }

  ngOnChanges() {
    // 错误对象
    let errors = this.msgArr[0];
    // 提交flag
    let submitted = this.msgArr[1];
    // 正则类型
    let patternType = this.msgArr[2];
    if (errors && submitted) {
      clearTimeout(this.timer);
      let msg: string;
      for (let key in errors) {
        if (errors.hasOwnProperty(key)) {
          switch (key) {
            case 'required':
              msg = '必填项';
              break;
            case 'pattern':
              let valid = this.helper.state.VALID[patternType];
              msg = valid ? valid.msg : '未定义的正则信息';
              break;
            default:
              msg = '校验失败'

          }
          this.toggleShow(true, msg);
          this.timer = setTimeout(() => this.toggleShow(false), 1500);
        }
      }
    } else {
      this.toggleShow(false);
    }
  }

  toggleShow(flag: boolean, msg?: string) {
    this.el.nativeElement.classList[flag ? 'add' : 'remove']('show');
    flag && (this.el.nativeElement.innerHTML = msg);
  }

}
