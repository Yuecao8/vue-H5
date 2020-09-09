function swiperAdroid() {
    var imgSwiper = document.getElementsByClassName('swiper-container')[0];
    var width = imgSwiper.clientWidth;
    var height = imgSwiper.clientHeight;
    var elem = getElementRect(imgSwiper);
    let param = {
        offsetX: elem.x,
        offsetY: elem.y,
        width: width,
        height: height
    }
    SmartCity.getViewPagerInfo(param)
};

function getElementRect(e) {
    var box = e.getBoundingClientRect();
    var x = box.left;
    var y = box.top;
    return {
        x: x,
        y: y
    };
};
var vm = new Vue({
    el: '#app',
    data: {
        host: 'http://mapi.plus.hebtv.com',
        curTab: 0,
        tabList: [],
        newsList: {},
        lunboList: [],
        columnList: [],
        flag: false,
        page: 1,
        count: 20,
        currentId: '',
        moreFlag: true
    },
    filters: {
        // 超出 用省略号显示
        hideText(spanText) {
            var str = spanText;
            var len = str.length
            if (len > 18) {
                var str2 = "";
                str2 = str.substring(0, 17) + "...";
            } else {
                str2 = str;
            }
            return str2
        },
        getTimeData(dataTime) {
            dataTime = new Date(dataTime.replace(/-/g, '/')).getTime()
            var currentTime = new Date().getTime();
            var forwardTime;
            var seconds = parseInt((currentTime - dataTime) / 60000);
            if (seconds < 1) {
                forwardTime = '1分钟前'
            } else if (seconds < 60 && seconds > 1) {
                forwardTime = seconds + '分钟前'
            } else if (seconds > 60 && seconds < 1440) {
                forwardTime = parseInt(seconds / 60) + '小时前'
            } else if (seconds > 1440) {
                forwardTime = parseInt(seconds / 1440) + '天以前'
            }
            return forwardTime
        }
    },
    methods: {
        // 选择tab栏
        tabView(index) {
            // console.log(index)
            this.curTab = index;
            this.columnList = this.tabList[this.curTab].data;
            this.currentId = this.tabList[this.curTab].id
            this.page = 1;
            this.moreFlag = true
            // console.log(this.columnList)
        },
        // 轮播图
        getSwiper() {
            this.mySwiper = new Swiper(this.$refs.swiperContainer, {
                pagination: {
                    el: '.swiper-pagination',
                },
                loop: true,
                loopAdditionalSlides: 2,
                autoplay: {
                    delay: 1500,
                    stopOnLastSlide: false,
                    disableOnInteraction: false,
                },
                // autoplay: true,//可选选项，自动滑动
            });
        },
        getSwiper2() {
            this.mySwiper2 = new Swiper('.swiper2', {
                direction: 'vertical',
                loop: true,
                autoplay: 0,
                autoplay: {
                    delay: 1500,
                    stopOnLastSlide: false,
                    disableOnInteraction: false,
                },
            })
        },
        // 轮播图数据
        getLunbo() {
            var _this = this;
            // /api/open/js/get_langfang_slide_pics?appid=m2ovki73ruqwcwmw8b&appkey=b7269c8f9a318c69a59dc430cef3ab59
            $.ajax({
                type: "GET",
                url: 'http://mapi.plus.hebtv.com/api/open/js/get_langfang_slide_pics?appid=m2ovki73ruqwcwmw8b&appkey=b7269c8f9a318c69a59dc430cef3ab59',
                dataType: 'json',
                success: function (res) {
                    _this.lunboList = res;
                    if (_this.lunboList.length > 1) {
                        setTimeout(() => {
                            _this.getSwiper();
                        }, 1000);
                    }
                    _this.getData();
                    _this.getNews();
                }
            })

        },
        // 分类数据
        // /api/open/js/langfang_get_recommend_data?appid=m2ovki73ruqwcwmw8b&appkey=b7269c8f9a318c69a59dc430cef3ab59
        getData() {
            var _this = this;
            $.ajax({
                type: "GET",
                url: 'http://mapi.plus.hebtv.com/api/open/js/langfang_get_recommend_data?appid=m2ovki73ruqwcwmw8b&appkey=b7269c8f9a318c69a59dc430cef3ab59&fid=404',
                dataType: 'json',
                success: function (res) {
                    _this.tabList = res;
                    // console.log(_this.tabList[0].data)
                    _this.currentId = _this.tabList[0].id;
                    _this.columnList = _this.tabList[0].data;
                    _this.currentId = _this.tabList[0].id
                    _this.flag = true

                }
            })
        },
        getNews() {
            const _this = this;
            // /api/open/js/get_langfang_slide_zixun?appid=m2ovki73ruqwcwmw8b&appkey=b7269c8f9a318c69a59dc430cef3ab59
            $.ajax({
                type: "GET",
                url: 'http://mapi.plus.hebtv.com/api/open/js/get_langfang_slide_zixun?appid=m2ovki73ruqwcwmw8b&appkey=b7269c8f9a318c69a59dc430cef3ab59',
                dataType: 'json',
                success: function (res) {
                    _this.newsList = {
                        topList: [],
                        bottomList: []
                    };
                    res.forEach((item, i) => {
                        if (i % 2 == 0) {
                            _this.newsList.topList.push(item);
                        } else {
                            _this.newsList.bottomList.push(item)
                        }
                    });
                    // console.log(_this.newsList)
                    setTimeout(() => {
                        _this.getSwiper2();
                    }, 1000);
                    // _this.getData();


                }
            })

        },
        goDetail(module_id, id, outlink, h5_url) {
            var mbldevice = navigator.userAgent.toLowerCase();
            if (/m2osmartcity/gi.test(mbldevice)) {
                if (outlink) {
                    location.href = outlink + '_ddtarget=push';
                } else {
                    if (outlink) {
                        if (outlink.indexOf("http") != -1) {
                            location.href = outlink + '_ddtarget=push'
                        } else {
                            SmartCity.linkTo({
                                innerLink: outlink
                            })
                        }
                    } else {
                        // mix3/NewsDetailStyle11?id=
                        // mix3/VideoDetailStyle11?id=
                        var link;
                        if (module_id == 'vod') {
                            link = 'mix3/VideoDetailStyle6?id=' + id;
                        } else {
                            link = 'mix3/NewsDetailStyle11?id=' + id;
                        }
                        // console.log(link)
                        SmartCity.linkTo({
                            innerLink: link
                        })
                    }
                }
            }else{
                location.href = h5_url;
            }
        },
        getMore() {
            const _this = this;
            _this.page++;
            _this.offset = (_this.page - 1) * _this.count;
            $.ajax({
                type: "GET",
                url: 'http://mapi.plus.hebtv.com/api/open/js/langfang_column_contents.php?appid=m2ovki73ruqwcwmw8b&appkey=b7269c8f9a318c69a59dc430cef3ab59&count=' + _this.count + '&offset=' + _this.offset + '&column_id=' + _this.currentId,
                dataType: 'json',
                success: function (res) {
                    if (res.length < _this.count) {
                        _this.moreFlag = false
                        return false
                    }
                    _this.columnList[0].data = _this.columnList[0].data.concat(res)
                }
            })
        }
    },
    created() {
        // new VConsole();
        this.getLunbo();


    },
})