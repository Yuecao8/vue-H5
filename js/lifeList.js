var vm = new Vue({
    el: '#app',
    data: {
        host: 'http://mapi.plus.hebtv.com/',
        listData: [],
        flag:false
    },
    methods: {
        // 获取地址栏参数
        GetQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg); //search,查询？后面的参数，并匹配正则
            if (r != null) return r[2];
            return null;
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
        // http://mapi.plus.hebtv.com/api/open/js/list?appid=m2ovki73ruqwcwmw8b&appkey=b7269c8f9a318c69a59dc430cef3ab59&column_id=57
        getListData() {
            const _this = this;
            $.ajax({
                type: "GET",
                url: _this.host+'api/open/js/list?appid=m2ovki73ruqwcwmw8b&appkey=b7269c8f9a318c69a59dc430cef3ab59&column_id=' + _this.GetQueryString('column_id'),
                dataType: 'json',
                success: function (res) {
                    _this.listData = res
                    _this.flag = true
                }
            })
        }
    },
    mounted() {
        this.getListData();
        if (this.GetQueryString('title')) {
            document.title = decodeURIComponent(this.GetQueryString('title'))
        }
    },
})
