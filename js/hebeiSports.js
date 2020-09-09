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
        dataList: [],
        lunboList: [],
        columnList: [],
        flag: false
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
        }
    },
    methods: {
        // 选择tab栏
        tabView(index) {
            this.curTab = index;
            // this.getcolumnData()
            this.columnList = this.tabList[this.curTab].data[0].data
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
        // 轮播图数据
        getLunbo() {
            var _this = this;
            // http://mapi.plus.hebtv.com/api/open/js/get_hbty_slide_pics?appid=m2ovki73ruqwcwmw8b&appkey=b7269c8f9a318c69a59dc430cef3ab59
            $.ajax({
                type: "GET",
                url: 'http://mapi.plus.hebtv.com/api/open/js/get_hbty_slide_pics?appid=m2ovki73ruqwcwmw8b&appkey=b7269c8f9a318c69a59dc430cef3ab59',
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
        // 分类数据
        // http://mapi.plus.hebtv.com/api/open/js/sh_get_recommend_data&fid=14
        getData() {
            var _this = this;
            $.ajax({
                type: "GET",
                url: 'http://mapi.plus.hebtv.com/api/open/js/hbty_get_recommend_data?appid=m2ovki73ruqwcwmw8b&appkey=b7269c8f9a318c69a59dc430cef3ab59&fid=14',
                dataType: 'json',
                success: function (res) {
                    console.log(res)
                    _this.tabList = res;
                    _this.columnList = _this.tabList[0].data[0].data
                    _this.flag = true

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
        }
    },
    created() {
        // new VConsole();
        this.getLunbo();

    },
})
