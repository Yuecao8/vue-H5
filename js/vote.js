var vm = new Vue({
    el:'#app',
    data:{
        host:'http://mapi.plus.hebtv.com',
        flag:false,
        listData:[],
    },
    filters:{
        // 日期格式
        hideText(spanText,num){
            var str = spanText;
            str = str.replace(/-/g,'/');
            var len=str.length
            if(len>num){
            var str2="";
            str2=str.substring(0,num)+""; 
            }else{
            str2 = str;
            }
            return str2 
            }
    },
    methods:{
        getList(){
            // http://mapi.plus.hebtv.com/api/open/js/vote_list?appid=m2ovki73ruqwcwmw8b&appkey=b7269c8f9a318c69a59dc430cef3ab59
            const _this = this;
            let param = {
                appid: 'm2ovki73ruqwcwmw8b',
                appkey: 'b7269c8f9a318c69a59dc430cef3ab59'
            };
            url = _this.host + '/api/open/js/vote_list';
            axios.get(url, {
                params: param
            }).then(res => {
               console.log(res.data.data)
               _this.listData = res.data.data
                _this.flag = true;

            })
        },
        goIndex(id){
            window.location.href = 'voteIndex.html?id='+id
        }
    },
    mounted() {
        // this.flag = true
        this.getList()
    },
})