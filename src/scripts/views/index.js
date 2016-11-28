//引入模板
var indexTpl=require("../tpls/index.string");
/*var homeTpl=require("../tpls/home.string");
var content=document.body.innerHTML;
document.body.innerHTML=domTpls+content;
document.getElementById("m-wrapper").innerHTML=homeTpl;*/
SPA.defineView("index",{
	html:indexTpl,
	plugins:["delegated"],
	bindEvents:{
		beforeShow:function()
		{
			console.log("zhiqian");
		},
		show:function()
		{
			console.log("完成");
		}
	},
	modules:[{
		name:"content",//给子视图取个名字，方便后面的引用
		views:["guide","home","find","my"],//定义所有子视图，名称
		container:".m-wrapper",//子视图加载主视图的什么位置，相当于是个容器
		defaultTag:"home"//定义默认的子视图
	}
	],
	bindActions:{
		"switch.tabs":function(e,data)
		{
			//console.log(e)
			//console.log(data)
			var view=data.tag;
			this.modules.content.launch(view);
		}
	}
})





//如果是对象或者数组什么的需要在别的js引用的话就需要抛出
/*module.exports={
	name:"sean"
}*/