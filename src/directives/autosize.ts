import { Directive, ElementRef, HostListener, OnInit, Input } from '@angular/core';
import { ToastServiceProvider } from "../providers/toast-service";

/**
 * Generated class for the AutosizeDirective directive.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
 * for more info on Angular Directives.
 */
@Directive({
  selector: 'ion-textarea[autosize]' // Attribute selector
})
export class AutosizeDirective implements OnInit {
  @HostListener('input', ['$event.target'])
  onInput(textArea: HTMLTextAreaElement): void {
    this.adjust();
  }


  elP: any;

  @Input('maxlength') maxLength: any; // 字符串最大长度

  constructor(public element: ElementRef,
    public toast: ToastServiceProvider
  ) {
  }


  ngOnInit(): void {
    // bug 获取不到初始值
    setTimeout(() => this.init(), 100);
    console.log(1);
  }

  ngAfterContentChecked(): void {
    setTimeout(() => this.adjust(), 1000);
  }

  init() {
    this.maxLength = Number(this.maxLength) || 200;
    this.elP = document.createElement('p');
    this.elP.id = "elP";
    this.elP.style.textAlignLast = 'right';
    this.element.nativeElement.previousElementSibling.appendChild(this.elP);
    this.adjust();
  }

  adjust(): void {
    let textArea = this.element.nativeElement.getElementsByTagName('textarea')[0];
    let valLen = textArea.value.length;
    if (valLen >= this.maxLength) {
      this.elP.style.color = '#f53d3d'; // color => danger
      textArea.value = textArea.value.substr(0, this.maxLength);
      this.toast.open(`最多可输入${this.maxLength}个字`)
    } else if (valLen >= this.maxLength / 2) {
      this.elP.style.color = '#ffc333'; // color => warning
    } else {
      this.elP.style.color = '#8ec165'; // color => success
    }
    this.elP.innerHTML = `(${textArea.value.length}/${this.maxLength})`;
    textArea.style.overflow = 'hidden';
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + "px";
  }

}
