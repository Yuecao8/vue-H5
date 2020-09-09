var vm = new Vue({
    el: '#app',
    data: {
        host: 'http://mapi.plus.hebtv.com',
        detailList: {},
        option: {},
        OptionVideo: {},
        flag: false,
        playImg: true,
        vote_id:'',
        storage:window.localStorage,
        access_token:'',
        tip:'',
        tipFlag:false
    },
    methods: {
        // 获取地址栏参数
        GetQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg); //search,查询？后面的参数，并匹配正则
            if (r != null) return r[2];
            return null;
        },
        // http://mapi.plus.hebtv.com/api/open/js/get_vote_detail?appid=m2ovki73ruqwcwmw8b&appkey=b7269c8f9a318c69a59dc430cef3ab59
        getDetial() {
            const _this = this;
            let param = {
                appid: 'm2ovki73ruqwcwmw8b',
                appkey: 'b7269c8f9a318c69a59dc430cef3ab59',
                id:this.GetQueryString('vote_id')
            };
            url = _this.host + '/api/open/js/get_vote_detail';
            axios.get(url, {
                params: param
            }).then(res => {
                // if (res.data.ErrorCode || res.data.ErrorText) {
                //     return
                // }
                _this.detailList = res.data;
                _this.detailList.src = _this.detailList.index_pic.host + _this.detailList.index_pic.dir + _this.detailList.index_pic.filepath + _this.detailList.index_pic.filename;
                _this.endTime = _this.detailList.closing_date;
                _this.vote_id =  _this.detailList.id;
                _this.getOptionDetial()
            })
        },
        // http://mapi.plus.hebtv.com/api/open/js/get_vote_option_detail?appid=m2ovki73ruqwcwmw8b&appkey=b7269c8f9a318c69a59dc430cef3ab59&option_id=8
        getOptionDetial() {
            const _this = this;
            let param = {
                appid: 'm2ovki73ruqwcwmw8b',
                appkey: 'b7269c8f9a318c69a59dc430cef3ab59',
                option_id: _this.GetQueryString('id')
            };
            url = _this.host + '/api/open/js/get_vote_option_detail';
            axios.get(url, {
                params: param
            }).then(res => {
                // if (res.data.ErrorCode || res.data.ErrorText) {
                //     return
                // }
                _this.option = res.data.option;
                _this.OptionVideo = res.data.video;
                if (_this.OptionVideo.video) {
                    _this.OptionVideo.src = _this.OptionVideo.video.host + _this.OptionVideo.video.dir + _this.OptionVideo.video.filepath + _this.OptionVideo.video.filename;
                    _this.OptionVideo.poster = _this.OptionVideo.indexpic.host + _this.OptionVideo.indexpic.dir + _this.OptionVideo.indexpic.filepath + _this.OptionVideo.indexpic.filename;
                }

                _this.flag = true;
            })
        },
        videoPlay() {
            var video = this.$refs.videoBox;
            if (video.paused) { // 如果视频是暂停的
                video.play(); //play()播放  load()重新加载  pause()暂停
                this.playImg = false;
            } else {
                video.pause();
                this.playImg = true;
            }
            video.addEventListener('ended', () => {
                this.playImg = true;
            });
        },
        // 获取用户信息
        _initUserInfo() {
            var _this = this;
            SmartCity.getUserInfo(function (res) {
                if (res && res.userInfo) {
                    _this.access_token = res.userInfo.userTokenKey;
                    _this.storage.setItem('access_token', _this.access_token)
                }
            })
            // setTimeout(()=>{
            //     _this.storage.setItem('access_token','5c3ef51c8e5062998bfb89efa5c30f8b')
            //     _this.access_token = _this.storage.getItem('access_token')
            // },1000)
            // console.log(_this.access_token)

        },
        zhichi() {
            const _this = this;
            if(!_this.access_token){
                SmartCity.goLogin();
                return
            }
            var config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            let params = new FormData();
            params.append('option_id', parseInt(_this.GetQueryString('id')));
            params.append('vote_id',_this.vote_id);
            params.append('access_token',_this.storage.getItem('access_token'));
            // appkey=b7269c8f9a318c69a59dc430cef3ab59&appid=m2ovki73ruqwcwmw8b&device_token=2c4a9b28cb789a05e0862ffe53e691f1&access_token=15fbd104a1d801d53862747de333207c
            // console.log(params)
            url = 'http://mapi.plus.hebtv.com/api/v1/vote.php';
            axios.post(url, params, config)
                .then(
                    res => {
                        // console.log(res.data)
                        setTimeout(()=>{
                            _this.tipFlag = false
                        },1000)
                        if(res.data.error_code==0&&res.data.data=="success"){
                            _this.option.num++;
                            _this.tip = "投票成功";
                            _this.tipFlag = true
                        }else{
                            _this.tip = res.data.ErrorText;
                            _this.tipFlag = true
                        }
                    }
                )


        }
    },
    created() {
        this._initUserInfo();
        this.getDetial()
    },
})