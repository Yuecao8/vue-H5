var vm = new Vue({
    el:'#app',
    data:{
        curTab:0,
        host: 'http://mapi.plus.hebtv.com',
        optionList:[],
        sortList:[],
        rankList:[],
        detailList:{},
        isEnd: false, //倒计时是否结束
        endTime: '', //应为接口获取到的结束时间
        time: {
            D: '',
            h: '',
            m: '',
            s: ''
        },
        flag:false
    },
    methods:{
        tabView(index,name) {
            if(this.curTab ==index){
                return
            }
            this.title = name;
            this.curTab = index;
            // console.log(name)
            if(name=='总排名'){
                this.getRank()
            }else{
                this.getOptions()
            }
           
        },
        GetQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg); //search,查询？后面的参数，并匹配正则
            if (r != null) return r[2];
                  return null;
        },
        // 详情接口
        getDetial() {
            const _this = this;
            let param = {
                appid: 'm2ovki73ruqwcwmw8b',
                appkey: 'b7269c8f9a318c69a59dc430cef3ab59',
                id:_this.GetQueryString('id')
            };
            url = _this.host + '/api/open/js/get_vote_detail';
            axios.get(url, {
                params: param
            }).then(res => {
                // if (res.data.ErrorCode || res.data.ErrorText) {
                //     return
                // }
                // 详情信息
                _this.detailList = res.data;
                // 选项信息
                _this.optionList = res.data.options;
                _this.detailList.src = _this.detailList.index_pic.host + _this.detailList.index_pic.dir + _this.detailList.index_pic.filepath + _this.detailList.index_pic.filename;
                _this.endTime = _this.detailList.closing_date;
                _this.setEndTime();
                _this.getSort();
            })
        },
        // 分类接口
        getSort(){
            const _this = this;
            let param = {
                appid: 'm2ovki73ruqwcwmw8b',
                appkey: 'b7269c8f9a318c69a59dc430cef3ab59',
                vote_id:_this.GetQueryString('id')
            };
            url = _this.host + '/api/open/js/get_vote_option_sort_list';
            axios.get(url, {
                params: param
            }).then(res => {
                // if (res.data.ErrorCode || res.data.ErrorText) {
                //     return
                // }
                _this.sortList = res.data;
                _this.sortList.unshift({name:'总排名'});
                // console.log(_this.sortList)
                _this.getRank()
            })
        },
         // 投票选项列表
        // http://mapi.plus.hebtv.com/api/open/js/get_vote_option_list?appid=m2ovki73ruqwcwmw8b&appkey=b7269c8f9a318c69a59dc430cef3ab59
        getOptions(){
            const _this = this;
            let param = {
                appid: 'm2ovki73ruqwcwmw8b',
                appkey: 'b7269c8f9a318c69a59dc430cef3ab59',
                //    title 按照  标题来搜索
                //    sort_id :  按照分类来筛选
                //    offset  : 分页的位置
                //    count  : 每页的个数
                title:_this.title,
                vote_id:_this.GetQueryString('id'),
                offset:'',
                count:'',
                // sort_id:_this.content,
            };
            url = _this.host + '/api/open/js/get_vote_option_list';
            axios.get(url, {
                params: param
            }).then(res => {
                // if (res.data.ErrorCode || res.data.ErrorText) {
                //     return
                // }
                _this.rankList=res.data;

            })
        },
        // 排行榜接口
        // http://mapi.plus.hebtv.com/api/open/js/get_vote_option_rank_list?appid=m2ovki73ruqwcwmw8b&appkey=b7269c8f9a318c69a59dc430cef3ab59
        getRank(){
            const _this = this;
            let param = {
                appid: 'm2ovki73ruqwcwmw8b',
                appkey: 'b7269c8f9a318c69a59dc430cef3ab59',
                vote_id:_this.GetQueryString('id')
            };
            url = _this.host + '/api/open/js/get_vote_option_rank_list';
            axios.get(url, {
                params: param
            }).then(res => {
                // if (res.data.ErrorCode || res.data.ErrorText) {
                //     return
                // }
                this.rankList = res.data;
                _this.flag=true

            })
        },
        setEndTime() {
            var that = this;
            // 先调用一次
            that.timestampToTime();
            that.interval = setInterval(that.timestampToTime, 1000);
        },
        // 格式化日期
        timestampToTime() {
            var that = this;
            that.endTime = that.endTime.replace(/-/g,'/');
            var date = (new Date(that.endTime)) - (new Date()); //计算剩余的毫秒数
            if (date <= 0) {
                that.isEnd = true;
                clearInterval(that.interval)
            } else {
                that.time.D = parseInt(date / 1000 / 60 / 60 / 24, 10);
                that.time.h = parseInt(date / 1000 / 60 / 60 % 24, 10);
                if (that.time.h < 10) {
                    that.time.h = "0" + that.time.h
                }
                that.time.m = parseInt(date / 1000 / 60 % 60, 10); //计算剩余的分钟
                if (that.time.m < 10) {
                    that.time.m = "0" + that.time.m
                }
                that.time.s = parseInt(date / 1000 % 60, 10); //计算剩余的秒数 
                if (that.time.s < 10) {
                    that.time.s = "0" + that.time.s
                }
            }
        }
    },
    created() {
        this.getDetial();
        
    },
})