//延时函数
function delay (fun,t) {
	var queue=[],timer;
	function delayDo(fun,t){
       if(queue.length||timer){
       	queue.push({'fun':fun,'t':timer});
       }else{
       	schedule(fun,t);
       }
	}
	function schedule(fun,t){
        timer=setTimeout(function(){
          timer=null;
          fun();
          if(queue.length){
          	var next=queue.shift();
          	schedule(next.fun,next.t);
          }
        },t) 
	}
}
//快排
var data=[1,3,2,7,5,4];
function sort_partition(left,right){
	var p=data[left];
	while(left<right){
		while (data[right]>=p) {
			right--;
		}
		data[left]=data[right];
		while (data[left]<=p) {
			left++;
		}
		data[right]=data[left];
	}
	data[left]=p;
	return left;
}
function sort(left, right) {//递归
      if (left >= right) return;
      var idx = sort_partition(left, right);
      if (left < idx - 1) {
        sort(left, idx - 1);
      }
      if (idx < right) {
        sort(idx + 1, right);
      }
}
sort(0,5);
