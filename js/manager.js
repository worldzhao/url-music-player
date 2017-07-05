(function (w) {
    function Controls(config) {
        //记录静音前一次音量长度
        this.lastVol = null;
        //歌曲列表隐藏/显示标记
        this.listShowFlag = 0;
        //当前播放歌曲序号
        this.songIndex = 0;
        //播放模式定时器
        this.timer = null;
        //播放模式标记
        this.modeFlag = 0;
        if (config) {
            this.init(config);
        }
    }

    Controls.prototype = {
        constructor: Controls,
        init(config){
            //获取元素
            this.music = document.querySelector('.music');
            this.plyBtn = document.querySelector('.ply-btn');
            this.pIcon = this.plyBtn.getElementsByTagName('i')[0];
            this.Ttime = document.querySelector('.Ttime');
            this.Ctime = document.querySelector('.Ctime');
            this.noVol = document.querySelector('.noVol');
            this.vIcon = this.noVol.getElementsByTagName('i')[0];
            this.vol = document.querySelector('.vol');
            this.nowVol = document.querySelector('.nowVol');
            this.progressBar = document.querySelector('.progressBar');
            this.progress = document.querySelector('.progress');
            this.cover = document.querySelector('.cover');
            this.songName = document.querySelector('.name');
            this.author = document.querySelector('.singer');
            this.songContainer = document.querySelector('.songContainer');
            this.menu = document.querySelector('.menu');
            this.preSongBtn = document.querySelector('.preSongBtn');
            this.nextSongBtn = document.querySelector('.nextSongBtn');
            this.playMode = document.querySelector('.playMode');
            this.modeIcon = this.playMode.getElementsByTagName('i')[0];
            this.songs = config.songs;
            //隐藏原生控件
            this.hideControls();
            //初始化歌曲列表
            this.initialList();
            //默认“列表循环”模式
            this.listCircle();
            //绑定事件
            this.addEvent();
            //默认音量0.5
            this.music.volume = 0.5;
            //获取歌曲列表高度
            this.songContainerHeight = parseInt(this.getStyle(this.songContainer, 'height'));
        },
        hideControls(){
            this.music.controls = false;
        },
        initialList(){
            for (let i = 0; i < this.songs.length; i++) {
                let song = this.songs[i];
                let li = document.createElement('li');
                li.className = 'song';
                let index = document.createElement('span');
                index.className = "no";
                index.innerHTML = i + 1 + '.';
                let name = document.createElement('span');
                name.className = "songName";
                name.innerHTML = song.name;
                let singer = document.createElement('span');
                singer.className = "songSinger";
                singer.innerHTML = song.author;
                li.appendChild(index);
                li.appendChild(name);
                li.appendChild(singer);
                this.songContainer.appendChild(li);
            }
            this.songItems = document.getElementsByClassName('song');
            this.songItems[0].className += " active";
        },
        addEvent(){
            var that = this;
            this.plyBtn.addEventListener('click', function () {
                that.PlayorPause();
            })
            this.progressBar.onclick = function (e) {
                that.setCtime(e);
            }
            this.noVol.onclick = function () {
                that.toggleMute();
            }
            this.vol.onclick = function (e) {
                that.setVol(e);
            }
            this.music.oncanplay = function () {
                that.calTtime();
            }
            this.music.ontimeupdate = function () {
                that.changeTime();
            }
            this.menu.onclick = function () {
                that.toggleList();
            }
            this.preSongBtn.onclick = function () {
                that.preSong();
            }
            this.nextSongBtn.onclick = function () {
                that.nextSong();
            }
            this.playMode.onclick = function () {
                that.changeMode();
            }
            for (let i = 0; i < this.songItems.length; i++) {
                let songItem = this.songItems[i];
                songItem.onclick = function () {
                    that.changeSong(i);
                }
            }
        },
        PlayorPause(){
            if (this.music.paused || this.music.ended) {
                this.toPlay();
            } else {
                this.toPause();
            }
        },
        toPlay(){
            this.music.play();
            this.pIcon.className = "icon-pause";
            this.animate(this.plyBtn, {left: 20});
            this.cover.className = "blur";
        },
        toPause(){
            this.music.pause();
            this.pIcon.className = "icon-play";
            this.animate(this.plyBtn, {left: -30});
            this.cover.className = "";
        },
        calTtime(){
            let duration = this.music.duration;
            let min = parseInt(duration / 60);
            let sec = parseInt(duration - min * 60);
            if (sec < 10) {
                sec = '0' + sec;
            }
            this.Ttime.innerHTML = min + ':' + sec;
        },
        changeTime(){
            let currentTime = this.music.currentTime;
            let scaling = currentTime / this.music.duration;
            let min = parseInt(currentTime / 60);
            let sec = parseInt(currentTime - min * 60);
            if (sec < 10) {
                sec = '0' + sec;
            }
            this.Ctime.innerHTML = min + ':' + sec;
            this.progress.style.width = this.progressBar.offsetWidth * scaling + "px";
        },
        toggleMute(){
            var that = this;
            this.music.muted = !this.music.muted;
            if (this.nowVol.style.width != "0px") {
                this.lastVol = this.nowVol.offsetWidth;
                this.animate(this.nowVol, {width: 0});
                this.vIcon.className = "icon-volume-mute2";
            } else {
                this.animate(this.nowVol, {width: this.lastVol});
                this.setvIcon();
            }
        },
        setVol(e){
            //let startX=this.vol.offsetLeft;
            //let endX = e.pageX;
            //let length = endX-startX;
            let length = e.offsetX;
            let scaling = length / (this.vol.offsetWidth);
            this.animate(this.nowVol, {width: length});
            this.music.volume = scaling;
            this.setvIcon();
        },
        setvIcon(){
            if (this.music.volume > 0 && this.music.volume <= 0.1) {
                this.vIcon.className = "icon-volume-mute";
            } else if (this.music.volume > 0.1 && this.music.volume <= 0.4) {
                this.vIcon.className = "icon-volume-low";
            } else if (this.music.volume > 0.4 && this.music.volume <= 0.7) {
                this.vIcon.className = "icon-volume-medium"
            } else if (this.music.volume > 0.7 && this.music.volume <= 1) {
                this.vIcon.className = "icon-volume-high";
            } else {
                this.vIcon.className = "icon-volume-medium";
            }
        },
        setCtime(e){
            //let startX=this.progressBar.offsetLeft;
            //let endX = e.pageX;
            //let length = endX-startX;
            let length = e.offsetX;
            let scaling = length / (this.progressBar.offsetWidth);
            this.animate(this.progress, {width: length});
            this.music.currentTime = this.music.duration * scaling;
        },
        changeSong(index){//与vue不一致
            this.songIndex = index;
            this.music.pause();
            this.music.src = this.songs[index].src;
            this.cover.setAttribute('src', this.songs[index].cover);
            this.songName.innerHTML = this.songs[index].name;
            this.author.innerHTML = this.songs[index].author;
            this.toPlay();
            this.addAcitveClass(this.songItems[index]);
        },
        addAcitveClass(li){
            for (let i = 0; i < this.songItems.length; i++) {
                let songItem = this.songItems[i];
                songItem.className = "song";
            }
            ;
            li.className += " active";
        },
        toggleList(){
            if (this.listShowFlag == 0) {
                this.animate(this.songContainer, {height: 0, opacity: 0});
                this.listShowFlag = 1;
            } else {
                this.animate(this.songContainer, {height: this.songContainerHeight, opacity: 100});
                this.listShowFlag = 0;
            }
        },
        preSong(){
            if (this.modeFlag !== 2) {
                if (this.songIndex === 0) {
                    this.songIndex = this.songs.length;
                }
                this.songIndex = this.songIndex - 1;
            } else {
                let rd = Math.random() * this.songs.length;
                this.songIndex = Math.floor(rd);
            }
            this.changeSong(this.songIndex);
        },
        nextSong(){
            if (this.modeFlag !== 2) {
                this.songIndex = this.songIndex + 1;
                if (this.songIndex === this.songs.length) {
                    this.songIndex = 0;
                }
            } else {
                let rd = Math.random() * this.songs.length;
                this.songIndex = Math.floor(rd);
            }
            this.changeSong(this.songIndex);
        },
        changeMode(){
            if (this.modeFlag === 0) {
                this.modeFlag = 1;
                this.oneCircle();
            } else if (this.modeFlag === 1) {
                this.modeFlag = 2;
                this.listRandom();
            } else if (this.modeFlag === 2) {
                this.modeFlag = 3;
                this.orderPlay();
            } else if (this.modeFlag === 3) {
                this.modeFlag = 0;
                this.listCircle();
            }
        },
        listCircle(){  //模式0 列表循环（默认）
            clearInterval(this.timer);
            this.modeIcon.className = "icon-loop";
            var that = this;
            this.timer = setInterval(function () {
                if (that.music.ended) {
                    that.songIndex = that.songIndex + 1;
                    if (that.songIndex === that.songs.length) {
                        that.songIndex = 0;
                    }
                    that.changeSong(that.songIndex);
                }
            }, 1000);
        },
        oneCircle(){  //模式1 单曲循环
            clearInterval(this.timer);
            this.modeIcon.className = "icon-loop2";
            var that = this;
            this.timer = setInterval(function () {
                if (that.music.ended) {
                    that.changeSong(that.songIndex);
                }
            }, 1000);
        },
        listRandom(){ //模式2 随机播放
            clearInterval(this.timer);
            this.modeIcon.className = "icon-shuffle";
            var that = this;
            this.timer = setInterval(function () {
                if (that.music.ended) {
                    let rd = Math.random() * that.songs.length;
                    that.songIndex = Math.floor(rd);
                    that.changeSong(that.songIndex);
                }
            }, 1000);
        },
        orderPlay(){  //模式3  顺序播放
            clearInterval(this.timer);
            this.modeIcon.className = "icon-repeat_one";
            var that = this;
            this.timer = setInterval(function () {
                if (that.music.ended) {
                    that.songIndex = that.songIndex + 1;
                    if (that.songIndex === that.songs.length) {
                        clearInterval(that.timer);
                        return;
                    }
                    that.changeSong(that.songIndex);
                }
            }, 1000);
        },
        animate(ele, json, fn){
            //首先清除定时器
            clearInterval(ele.timer);
            var that = this;
            ele.timer = setInterval(function () {
                //开闭原则
                var bool = true;
                //遍历属性和值，分别单独处理json
                //k:属性名 json[k]:属性值
                for (var k in json) {
                    var leader;
                    //获取当前属性值,如果没有则设为0
                    //如果是透明度属性取值方式不同
                    if (k === "opacity") {
                        if (!that.getStyle(ele, k)) {
                            leader = 100;
                        } else {
                            leader = that.getStyle(ele, k) * 100;
                        }
                        //leader = parseInt(that.getStyle(ele,k))*100||1;//最后还要用1乘100也就是100
                    } else {
                        leader = parseInt(that.getStyle(ele, k)) || 0;
                    }
                    //获取步长,，步长会随着leader的增大而减小，使得动画更平缓
                    var step = (json[k] - leader) / 10;
                    //二次处理步长，判断正负
                    step = step > 0 ? Math.ceil(step) : Math.floor(step);
                    leader = leader + step;
                    //赋值给属性
                    //特殊情况特殊赋值
                    if (k === "opacity") {
                        //最后除以100变成[0,1]之间的数
                        ele.style["opacity"] = leader / 100;
                        //兼容IE678
                        ele.style.filter = "alpha(opacity=" + leader + ")";
                    } else if (k === "zIndex") {
                        //如果是层级 就一次性赋值，没有理由，需求！
                        ele.style.zIndex = json[k];
                    } else {
                        ele.style[k] = leader + "px";
                    }
                    //直到这里运动完毕后定时器却并没有清除，需手动清除
                    //而不是等下一次移动再清除，太被动，且占内存
                    //清除定时器
                    //判断每一个属性的目标值和当前值的差是否大于步长
                    //如果大于步长说明还没到目标值(考虑小数)
                    /*if(Math.abs(json[k]-leader)>Math.abs(step)){
                     bool=false;
                     }*/
                    //不考虑小数
                    if (json[k] !== leader) {
                        bool = false;
                    }
                }
                if (bool) {
                    clearInterval(ele.timer);
                    if (fn) {
                        fn();
                    }
                }
            }, 20);
        },
        //兼容方法获取元素样式
        //getComputedStyle返回属性数组，只读
        //ele.style[attr]也可以(千万不要傻到用.k)，可读可写
        getStyle(ele, attr){
            if (window.getComputedStyle) {
                return window.getComputedStyle(ele, null)[attr];
            }
            return ele.currentStyle[attr];
        }
    }

    w.Controls = Controls;
})(window)