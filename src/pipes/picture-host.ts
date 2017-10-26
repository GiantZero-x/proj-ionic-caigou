import { Pipe, PipeTransform } from '@angular/core';
import { Helper } from "../app/helper";

/**
 * Generated class for the PictureHostPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'pictureHost',
})
export class PictureHostPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  constructor(public helper: Helper) {
  }

  transform(value: string, isOrigin: boolean = false, isAvatar: boolean = false) {
    let output = isAvatar ? 'assets/avatar_default.jpg' : 'assets/nopic.jpg';
    if (value) {
      value = value.split('|')[0].replace(/"|\\/g, '').replace(/^\//, '');
      output = this.helper.state.API_URL.common + value + (isOrigin ? '' : '.mini');
    }
    return output;
  }
}
