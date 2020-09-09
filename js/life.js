var vm = new Vue({
    el: '#app',
    data: {
        curTab: 0,
        tabList: [],
        idList:[],
        host:'http://mapi.plus.hebtv.com/',
        lunboList:[],
        sortList:[],
        flag:false


    },
    filters:{
        // 超出 用省略号显示
        hideText(spanText){
            var str = spanText;
            var len=str.length
            if(len>18){
                var str2="";
                str2=str.substring(0,17)+"...";  
            }else{
                str2 = str;
            }
            return str2         
        },
        hideText6(spanText){
            var str = spanText;
            var len=str.length
            if(len>6){
                var str2="";
                str2=str.substring(0,6)+"...";  
            }else{
                str2 = str;
            }
            return str2         
        }
    },
    methods: {
        // 选择tab栏
        tabView(index) {
            this.curTab = index;
            this.getSortData()
        },
        getSwiper() {
            this.mySwiper = new Swiper(this.$refs.swiperContainer, {
                pagination: {
                    el: '.swiper-pagination',
                },
                loop: true,
                loopAdditionalSlides: 4,
                autoplay: {
                    delay: 2000,
                    stopOnLastSlide: false,
                    disableOnInteraction: false,
                },
                // autoplay: true,//可选选项，自动滑动
            });
        },
        // http://mapi.plus.hebtv.com/api/open/js/get_sh_slide_pics?appid=m2ovki73ruqwcwmw8b&appkey=b7269c8f9a318c69a59dc430cef3ab59
        getLunboData(){
            const _this = this;
            $.ajax({
                type:"GET",
                url:_this.host+'api/open/js/get_sh_slide_pics?appid=m2ovki73ruqwcwmw8b&appkey=b7269c8f9a318c69a59dc430cef3ab59',
                dataType:'json',
                success:function(res){
                    _this.lunboList = res;
                    setTimeout(() => {
                        _this.getSwiper();
                    }, 100);
                    _this.getIconData();

                }
            })  
   
        },
        // http://mapi.plus.hebtv.com/api/open/js/sh_get_recommend_data&fid:13
        getIconData(){
            const _this = this;
            $.ajax({
                type:"GET",
                url:_this.host+'api/open/js/sh_get_recommend_data?appid=m2ovki73ruqwcwmw8b&appkey=b7269c8f9a318c69a59dc430cef3ab59&fid=13',
                dataType:'json',
                success:function(res){
                    res.forEach(item => {
                        // ${item.indexpic.host}${item.indexpic.dir}${item.indexpic.filepath}${item.indexpic.filename}
                        _this.idList.push(item.id);
                        
                    });
                    _this.tabList = res;
                    _this.getSortData()

                }
            })   
        },
        getSortData(){
            const _this = this;
            $.ajax({
                type:"GET",
                url:_this.host+'api/open/js/sh_get_recommend_data?appid=m2ovki73ruqwcwmw8b&appkey=b7269c8f9a318c69a59dc430cef3ab59&fid='+_this.idList[_this.curTab],
                dataType:'json',
                success:function(res){
                    res.forEach(item => {
                        // ${item.indexpic.host}${item.indexpic.dir}${item.indexpic.filepath}${item.indexpic.filename}
                        _this.idList.push(item.id);  
                    });
                    _this.sortList= res;
                    _this.flag = true

                }
            })   
            
        },
        goDetail(module_id,id){
            console.log(module_id,id)
            // mix3/NewsDetailStyle11?id=
            // mix3/VideoDetailStyle11?id=
            var link;
            if(module_id=='vod'){
                link ='mix3/VideoDetailStyle6?id='+id;
            }else{
                link = 'mix3/NewsDetailStyle11?id='+id;
            }
            SmartCity.linkTo({innerLink:link})
        },
        goList(column_id,title){
            var link = this.host+'h5_hebei/lifeList.html?column_id='+column_id+'&title='+title;
            console.log(link)
            SmartCity.linkTo({innerLink:link})
        }
     
    },
    created() {
        this.getLunboData();
    }
})
