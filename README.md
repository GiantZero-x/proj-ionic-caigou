# 采购宝

为业务员在市场走单时，提供快速录入重要信息的工具，以及节省在PC上录单的时间，提高工作效率，有效管理客户、供应商和产品信息。

## 如何使用

```bash
// 安装ionic 脚手架(ionic: 3.7.0, cordova: 7.0.1)
$ npm install -g ionic cordova

// checkout 项目
checkout this svn svn://192.168.17.50/zzh0605/

// cmd进入项目目录
$ cd zzh0605

// 安装 NPM 依赖
$ npm i

// 安装 Cordova 依赖
$ ionic cordova prepare

// 启动开发服务器
$ ionic serve
```

-----------------

#### ionic使用ImagePicker插件问题!!

相关依赖没有记录在package.json文件中, 因为添加了一个不存在的包; 在执行完`ionic cordova prepare` 后执行 

  `ionic cordova plugin add cordova-plugin-telerik-imagepicker --variable PHOTO_LIBRARY_USAGE_DESCRIPTION="image picker" && npm install --save @ionic-native/image-picker
`
  
  重新安装插件但是之后要将config.xml和package.json文件还原,任然不记录依赖
  
#### ionic使用ImagePicker插件中文显示
 ```bash
 1. 找到目录platforms/android/res有国际化的几个文件夹
 
     values-de
     ...
 
 2. 将此文件夹复制过去
 
 3. 数量超限未改,在 platforms\android\src\com\synconset\MultiImageChooserActivity.java:200 处
 
     .setTitle("最大选取数 " + maxImageCount + " Photos")
     .setMessage("此次您最多能够选取 " + maxImageCount + " 张图片。")
     .setPositiveButton("确定", new DialogInterface.OnClickListener() {
         public void onClick(DialogInterface dialog, int which) {
             dialog.cancel();
         }
     })
```

#### 本地打包(提前配置JDK, SDK, Gradle)

```bash
 1. 将 'src/key/release-signing.properties' 文件 放到 platform > android 文件夹下
 2. 执行 ionic cordova build android --prod --release
 3. 两次输入密码 123456
 4. 打包文件在 platform > android > build > output > apk > android-release.apk
```

### 云端打包
 1. 上传代码至云端
    $ ionic upload
 2. $ ionic package build android --prod
 3. 登陆云端 https://apps.ionic.io/apps/
    18167999108@163.com - 123456
 4. Caigoubao -> Package -> DOWNLOAD
```
