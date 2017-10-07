// 导出服务
import {Helper} from "./helper";
import {ToastServiceProvider} from '../providers/toast-service';
import {HttpProvider} from '../providers/http';
import {PictureProvider} from '../providers/picture';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {AppVersion} from '@ionic-native/app-version';
import {Camera} from '@ionic-native/camera';
import {Keyboard} from '@ionic-native/keyboard';
import {File} from '@ionic-native/file';
import {FileTransfer} from '@ionic-native/file-transfer';
import {ImagePicker} from '@ionic-native/image-picker';
import {Network} from '@ionic-native/network';
import {FileOpener} from '@ionic-native/file-opener';
import {HTTP} from '@ionic-native/http';
import {InAppBrowser} from '@ionic-native/in-app-browser';

export const Providers = [
  Helper,
  ToastServiceProvider,
  HttpProvider,
  PictureProvider,

  StatusBar,
  SplashScreen,
  AppVersion,
  Camera,
  Keyboard,
  File,
  FileTransfer,
  ImagePicker,
  Network,
  FileOpener,
  HTTP,
  InAppBrowser
];

// 导出指令
import {ShowErrDirective} from "../directives/show-err";
import {PictureSliderDirective} from "../directives/picture-slider";
import {AutosizeDirective} from "../directives/autosize"
import {PictureDownloadDirective} from "../directives/picture-download"

export const Directives = [
  ShowErrDirective,
  PictureSliderDirective,
  AutosizeDirective,
  PictureDownloadDirective
];

// 导出组件
export const Components = [
  ShowErrDirective,
  PictureSliderDirective,
  AutosizeDirective,
  PictureDownloadDirective
];

// 导出管道
import {PictureHostPipe} from "../pipes/picture-host"

export const Pipes = [
  PictureHostPipe
];

// 导出模块
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';

export const Modules = [
  BrowserModule,
  HttpModule
];
