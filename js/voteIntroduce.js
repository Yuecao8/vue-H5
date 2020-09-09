var vm = new Vue({
    el:'#app',
    data:{
        host:'http://mapi.plus.hebtv.com',
        introduceList:{},
        flag:false,
    },
    methods:{
        GetQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg); //search,查询？后面的参数，并匹配正则
            if (r != null) return r[2];
                  return null;
        },
        // http://mapi.plus.hebtv.com/api/open/js/get_vote_introduce?appid=m2ovki73ruqwcwmw8b&appkey=b7269c8f9a318c69a59dc430cef3ab59
        getIntroduce(){
            const _this = this;
            let param = {
                appid:'m2ovki73ruqwcwmw8b',
                appkey:'b7269c8f9a318c69a59dc430cef3ab59',
                vote_id:_this.GetQueryString('id')
            };
            url=_this.host+'/api/open/js/get_vote_introduce';
            axios.get(url,{params: param}).then(res=>{
                // if (res.data.ErrorCode || res.data.ErrorText) {
                //     return
                // }
                _this.introduceList = res.data;
                _this.introduceList.vote_id = _this.GetQueryString('id');
                _this.introduceList.src = _this.introduceList.indexpic.host+_this.introduceList.indexpic.dir+_this.introduceList.indexpic.filepath+_this.introduceList.indexpic.filename;
                console.log(_this.introduceList)
                _this.flag = true
            })
        },
    },
    created() {
        this.getIntroduce()        
    },
})