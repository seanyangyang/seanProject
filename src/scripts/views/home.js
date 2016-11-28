var homeTpl=require("../tpls/home.string");
var util=require("../util/commonutil");

SPA.defineView("home",{
	html:homeTpl,
	plugins:["delegated",{
		name:"avalon",
		options:function(vm){
			vm.liveDetail=[];
		}
	}],
	init:{
		conSwiper:null,
		dataFormat:function(data)
		{
			var tempArr=[];
			for(var i=0,len=Math.ceil(data.length/2);i<len;i++)
			{
				tempArr[i]=[];
				tempArr[i].push(data[i*2]);
				data[i*2+1] && tempArr[i].push(data[i*2+1]);
			}
			return tempArr;
		}
	},
	bindEvents:{
		beforeShow:function()
		{
			var _this=this;
			this.vm=this.getVM();
			this.origin=[];
			$.ajax({
				url:"/api/getlive.php",
				data:{action:"origin"},
				success:function(res)
				{
					_this.vm.liveDetail=_this.dataFormat(res.data);
					_this.origin=res.data;
					console.log(_this.vm.liveDetail)
				}
			})
		},
		show:function()
		{
			 document.addEventListener('touchmove', function (e){
			  e.preventDefault(); 

			}, false); 
			var mainSwiper=new Swiper("#home-container",{
				onSlideChangeStart:function(swiper)
				{
					var $el=$("#title span").eq(swiper.activeIndex);
					util.setFous($el)
				}
			});
			this.conSwiper=new Swiper("#con-container",{
				onSlideChangeStart:function(swiper)
				{
					var $el=$("#nav li").eq(swiper.activeIndex);
					util.setFous($el);
				}
			});



			//下拉刷新和上拉加载
			var mainScroll=this.widgets.mainScroll;
			var scrollSize=30;
			//隐藏下拉刷新
			mainScroll.scrollBy(0,-scrollSize);

			//获取当前head，foot中的img以及当前状态
			var headImg=$(".head img");
			var topImgHasClass=headImg.hasClass("up");
			var footImg=$(".foot img");
			var bottomImgHasClass=footImg.hasClass("down");

			var _this=this;

			//进行滚动
			mainScroll.on("scroll",function()
			{
				//获取当前的滚动位置
				var y=this.y;
				//计算最大的滚动距离
				var maxY=this.maxScrollY-y;


				//判断如果是下拉,,刷新，只是样式有所改变，并没有真正刷新
				if(y>=0)
				{
					//改变类，就是把下箭头那张图变为上箭头
					!topImgHasClass && headImg.addClass("up");
			        return "";
				}
				//如果是上拉，，加载
				if(maxY>=0)
				{
					!bottomImgHasClass && footImg.addClass("down");
			       	return "";
				}
			})



			//滚动结束时，进行刷新或者加载 
			mainScroll.on("scrollEnd",function()
			{
				//结束的位置足够大才是刷新内容
				if(this.y >= -scrollSize && this.y < 0){
			        mainScroll.scrollTo(0,-scrollSize);
			        headImg.removeClass("up");
			    }else if(this.y>=0){
			        headImg.attr("src","src/images/ajax-loader.gif");
			       
			        $.ajax({
                        url:"/api/getlive.php",
                        data:{
                        	action:"refresh"
                        },
                        success:function(res){
                           var refresh=res.data;
                           _this.vm.liveDetail=_this.dataFormat(refresh);
                           mainScroll.scrollTo(0,-scrollSize);
                           topImgHasClass && headImg.removeClass("up");
						   headImg.attr("src","src/images/arrow.png");                        
                        }
			        })
			    }


			    // 计算最大的滚动范围
			    var maxY = this.maxScrollY - this.y;
			    var self = this;
			    var that=this
			    if(maxY>-scrollSize && maxY<0){
			        mainScroll.scrollTo(0,this.maxScrollY+scrollSize);
			        footImg.removeClass("down");
			    }else if(maxY>=0){
			       footImg.attr("src","src/images/ajax-loader.gif");
			       $.ajax({
			          url:"/api/getlive.php",
			          data:{
			          	action:"more"
			          },
			          success:function(res)
			          {
			          	//var origin=_this.origin;
			          	_this.origin=_this.origin.concat(res.data);
			          	 _this.vm.liveDetail=_this.dataFormat(_this.origin);
			          	 //console.log(that.maxScrollY)
			          	 mainScroll.scrollTo(0,that.maxScrollY+scrollSize);
			          	 bottomImgHasClass && footImg.removeClass("down");
			          	 footImg.attr("src","src/images/arrow.png");
			          }
			       })
			    }
			})








		}
	},
	bindActions:{
		"clik-navs":function(e,data)
		{
			var $el=$(e.el);
			var ind=$el.index();
			this.conSwiper.slideTo(ind);
			/*var $el=$("#nav li").eq(data.ind);
			util.setFous($el);
			var needW=$(window).width();
			$("#navs-change").css({
				"-webkit-transform":"translate3d(-"+needW*data.ind+"px,0,0)"
			})
			$("#navs-change .swiper-slide").eq(data.ind).addClass("swiper-slide-active");
			$("#navs-change .swiper-slide").eq(data.ind+1).addClass("swiper-slide-next");
			$("#navs-change .swiper-slide").eq(data.ind-1).addClass("swiper-slide-prev");*/
		}
	}	
});