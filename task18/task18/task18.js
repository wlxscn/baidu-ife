function $(id){
  return document.getElementById(id);
}


var CancelQueue=function(obj){
	var obj = obj || {};
	this.input = obj.input || $("new-number");
	this.container = obj.container || $("arr-area");
	this.arr = [];
	this.update=function(){
        var childs = this.container.childNodes;
		for (var i = 0, len = this.arr.length; i < len; i++) {
			childs[i].setAttribute("data-index", i);
		}
	};
	this.inQueue=function(type){
		console.log(this);
        var num = this.check();
		if (num !== undefined) {
			CancelQueue.publicInQueue[type].inArr.call(this, num);//确保inArr方法的this指向CancelQueue
			CancelQueue.publicInQueue[type].inDom.call(this, num);
			this.update();
		}
	};
	this.outQueue=function(type){
        if (this.arr.length !== 0) {
			CancelQueue.publicOutQueue[type].outArr.call(this);
			CancelQueue.publicOutQueue[type].outDom.call(this);
			this.update();
		} else {
			alert("该队列已经为空");
		}
	}
	this.childClick = function () {
		var self = this;
		this.container.onclick = function (event) {
			if (event.target.tagName.toLowerCase() === "span") {
				var index = event.target.getAttribute("data-index");
				this.removeChild(this.childNodes[index]);
				self.arr.splice(index, 1);
				self.update();
			}
		};
	};
}
CancelQueue.fn=CancelQueue.prototype;
//生成新的节点
CancelQueue.fn.burnDom = function (number) {
	var span = document.createElement("span");
		// text = document.createTextNode(number);
		span.style.height=number+'px';
	// span.appendChild(text);
	return span;
}
//校验文本框的输入
CancelQueue.fn.check=function(){
	var pattern = /^\d{1,3}$/,
		strNum = this.input.value,
		flag = pattern.test(strNum);
	if (flag) {
		this.input.value = "";
		return strNum;
	} else {
		alert("您输入的数字有误!");
		return void 0;
	}
}
CancelQueue.fn.Arrsort=function(){
	if (this.arr.length > 1) {
		for(var i=0;i<this.arr.length-1;i++){
			for(var j=i+1;j<this.arr.length;j++){
				if(this.arr[i]>this.arr[j]){
					var temp=this.arr[i];
					    this.arr[i]=this.arr[j];
					    this.arr[j]=temp; 
				}
			}
		}
	}
	console.log(this.arr)
}
function bubbleSort(Arr){
	if(Arr.length<=1){
		return;
	}
   for(var j=0;j<Arr.length-1;j++){
   	 for(var k=0;k<Arr.length-j-1;k++){
   	 	if(Arr[k]>Arr[k+1]){
             var temp=Arr[k];
             Arr[k]=Arr[k+1];
             Arr[k+1]=temp; 
   	 	}
   	 }
   }
   return Arr;
}
//公共函数
CancelQueue.throwError = function () {//确保this的指向
	if (!(this instanceof CancelQueue)) {
		throw new Error("该函数不能直接调用");
	}
};

CancelQueue.publicInQueue = {
	left: {
		inArr: function (num) {
			CancelQueue.throwError.call(this);
			this.arr.unshift(+num);
		},
		inDom: function (num) {
			CancelQueue.throwError.call(this);
			this.container.insertBefore(this.burnDom(num), this.container.childNodes[0]);
		}
	},
	right: {
		inArr: function (num) {
			CancelQueue.throwError.call(this);
			this.arr.push(+num);
		},
		inDom: function (num) {
			CancelQueue.throwError.call(this);
			this.container.appendChild(this.burnDom(num));
		}
	}
};
CancelQueue.publicOutQueue = {
	left: {
		outArr: function (num) {
			CancelQueue.throwError.call(this);
			alert(this.arr.shift());
		},
		outDom: function (num) {
			CancelQueue.throwError.call(this);
			this.container.removeChild(this.container.firstElementChild);
		}
	},
	right: {
		outArr: function (num) {
			CancelQueue.throwError.call(this);
			alert(this.arr.pop());
		},
		outDom: function (num) {
			CancelQueue.throwError.call(this);
			this.container.removeChild(this.container.lastElementChild);
		}
	}
};
/*测试*/
(function (){
	var test = new CancelQueue(),
		buttons = $("button-area");
	test.childClick();
	$("left-in").onclick = function () {
		test.inQueue("left");
	};
	$("right-in").onclick = function () {
		test.inQueue("right");
	};
	$("left-out").onclick = function () {
		test.outQueue("left");
	};
	$("right-out").onclick = function () {
		test.outQueue("right");
	};
	$("sort").onclick=function(){
		test.sort();
	}
})();