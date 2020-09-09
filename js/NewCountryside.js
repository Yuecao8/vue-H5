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
        host: 'http://mapi.plus.hebtv.com/',
        linkHost:'http://share.plus.hebtv.com/',
        dataList: [],
        sannongData: [],
        sannongList: [],
        lunboList: [],
        picData: [],
        topPicData: [],
        yudataList: [],
        flag: false,
        alldataList:[]
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
        hideText28(spanText) {
            var str = spanText;
            var len = str.length
            if (len > 28) {
                var str2 = "";
                str2 = str.substring(0, 27) + "...";
            } else {
                str2 = str;
            }
            return str2
        }
    },
    methods: {
        // http://mapi.plus.hebtv.com/api/open/js/get_xnc_slide_pics?appid=m2ovki73ruqwcwmw8b&appkey=b7269c8f9a318c69a59dc430cef3ab59
        getLunboData() {
            const _this = this;
            $.ajax({
                type: "GET",
                url: _this.host + 'api/open/js/get_xnc_slide_pics?appid=m2ovki73ruqwcwmw8b&appkey=b7269c8f9a318c69a59dc430cef3ab59',
                dataType: 'json',
                success: function (res) {
                    _this.lunboList = res;
                    if (_this.lunboList.length > 1) {
                        setTimeout(() => {
                            _this.getSwiper();
                        }, 100);
                    }
                    _this.getData();

                }
            })

        },
        getSwiper() {
            this.mySwiper = new Swiper(this.$refs.swiperContainer, {
                pagination: {
                    el: '.swiper-pagination',
                },
                loop: true,
                loopAdditionalSlides: 2,
                autoplay: {
                    delay: 2000,
                    stopOnLastSlide: false,
                    disableOnInteraction: false,
                },
                // autoplay: true,//可选选项，自动滑动
            });
        },
        // http://mapi.plus.hebtv.com/api/open/js/xnc_get_recommend_data

        getData() {
            const _this = this;
            $.ajax({
                type: "GET",
                url: _this.host + 'api/open/js/xnc_get_recommend_data?appid=m2ovki73ruqwcwmw8b&appkey=b7269c8f9a318c69a59dc430cef3ab59&fid=17',
                dataType: 'json',
                success: function (res) {
                    console.log(res)
                    _this.alldataList = res;
                    // _this.sannongData = res.slice(0, 1)[0];
                    // // 三农列表
                    // _this.sannongList = _this.sannongData.data[0].data;
                    // // 通栏图片
                    // _this.picData = res.slice(1, 2)[0].data[0].data[0];
                    // // 剩下的数据
                    // _this.dataList = res.slice(2, res.length);
                    // // // css_id=1时，显示第一条数据 图片显示大图
                    // // _this.topPicData = _this.dataList.slice(1,_this.dataList.length);
                    // // _this.yudataList = _this.dataList.
                    // console.log(_this.dataList)
                    _this.flag = true;

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
        goList(column_id, title) {
            // var link = this.linkHost + 'h5_hebei/lifeList.html?column_id=' + column_id + '&title=' + title;
            // console.log(link)
            // var mbldevice = navigator.userAgent.toLowerCase();
            // if (/m2osmartcity/gi.test(mbldevice)) {
            //     SmartCity.linkTo({
            //         innerLink: link
            //     })
            // }else{
            //     location.href = link 
            // }
            location.href = 'lifeList.html?column_id=' + column_id + '&title=' + title + '&_ddtarget=push'
        }
    },
    created() {
        this.getLunboData()
    },
})
