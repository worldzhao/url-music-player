### SoulBeats本地播放器

>预览地址：https://cdn.rawgit.com/hackerwen/SoulBeats/cba064a9/index.html
项目地址：https://github.com/hackerwen/SoulBeats
界面参考：https://github.com/wangpengfei15975/skPlayer?utm_source=tuicool&utm_medium=referral

暂停界面：
![image.png](http://upload-images.jianshu.io/upload_images/4869616-86d09dc68110cfdd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

播放界面：
![image.png](http://upload-images.jianshu.io/upload_images/4869616-bd63b802a15a4da9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


最近想用Vue写一个网页播放器，但是一直没有找到好用的api，室友正在研究网易云api转发，过几天应该就能弄出来啦。
自己就干脆练练原生js，参照了上面那位同学的界面（配色以及布局）写出了这个播放器。
主要是html5的audio标签控件的重写。
等室友api弄好啦就用vue重构弄成在线的播放器。
技术：
1. Html
2. Css
3. JavaScript

功能实现：
1. 上/下一首
2. 播放模式切换（单曲、顺序、列表、随机）
3. html5 audio控件重写

使用方法：
1.js入口处配置歌曲列表json生成列表（音乐外链折腾了我很久，室友通过api加密转发弄出了网易云的外链，但是貌似链接有时间限制，坑，用毕竟静态页面，还是有很多不足，目前选择的是七牛云服务）

>七牛云音乐外链生成教程：http://jingyan.baidu.com/article/f54ae2fc34c9d41e92b849af.html

![入口配置.png](http://upload-images.jianshu.io/upload_images/4869616-8cc01a867c27e212.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

如果喜欢请给一颗star 过几天用尝试用vue重构写在线版
>项目地址：https://github.com/hackerwen/SoulBeats