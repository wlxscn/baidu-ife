/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/
//动画函数
function animation(obj,target){
   obj.timer=setInterval(function(){
        var nowHeight=parseInt(getStyle(obj,'height')),
            speed=(target-nowHeight)/5;
            speed>0?Math.ceil(speed):Math.floor(speed);
            nowHeight+=speed;
            obj.style.height=nowHeight+'px';
            if(nowHeight==target){
              clearInterval(obj.timer);
            }
   },30)
}
//获取元素属性
function getStyle(obj,attr){
   return obj.currentStyle?obj.currentStyle[attr]:window.getComputedStyle(obj,false)[attr];
}
// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: "北京",
  nowGraTime: "day"
}

/**
 * 渲染图表
 */
function renderChart() {
  var chartWrap=document.getElementById('aqi-chart-wrap'),totalHtml='',color='';
  for(var i in chartData){
    color = '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
    totalHtml+='<div title="'+i+":"+chartData[i]+'" style="height:'+0+'px;background-color:'+color+'"></div>';
  }
  chartWrap.innerHTML=totalHtml;
  animationHeight();
}
//给柱状图加动效
function animationHeight(){
    var chartWrap=document.getElementById('aqi-chart-wrap'),oDiv=chartWrap.getElementsByTagName('div');
        for(var j=0;j<oDiv.length;j++){
          var height=parseInt(oDiv[j].getAttribute('title').split(':')[1]);
              animation(oDiv[j],height)
        }  
}
/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(value) {
  // 确定是否选项发生了变化 
  console.log(value);
   if(pageState.nowGraTime!=value){
     pageState.nowGraTime=value;
   }
  // 设置对应数据
   initAqiChartData();
    // 调用图表渲染函数
     renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange(value) {
  // 确定是否选项发生了变化 
   if(pageState.nowSelectCity!=value){
     pageState.nowSelectCity=value;
   }
  // 设置对应数据
   initAqiChartData();
  // 调用图表渲染函数
  renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
   var inputField=document.getElementById('form-gra-time');
       inputField.onclick=function(e){
          var target=e.target;
          if(target.nodeName.toLowerCase()=='input'){
            graTimeChange(target.value);
          }
       }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var citySelect=document.getElementById('city-select'),totalHtml='';
  for(var city in aqiSourceData){
      totalHtml+='<option>'+city+'</option>'
  }
  citySelect.innerHTML=city?totalHtml:'';
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  citySelect.onchange=function(){
    citySelectChange(this.value);
  }
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  var cityData=aqiSourceData[pageState.nowSelectCity];
      chartData={};
  //以天为时间粒度
  if(pageState.nowGraTime=="day"){
    chartData=cityData;
  }
//以周为时间粒度
  if(pageState.nowGraTime=="week"){
    var totalSum=0,totalDay=0,i=0,aveSum=0;
    for(var day in cityData){
      totalSum+=cityData[day];
      totalDay++;
      if(new Date(day).getDay()==6){
         i++;
         aveSum=totalSum/totalDay;
         chartData['第'+i+'周']=Math.floor(aveSum);
         totalSum=0;
         totalDay=0;
      }
    }
    if(totalSum!=0){
      i++;
      chartData['第'+i+'周']=Math.floor(totalSum/totalDay);
    }
  }
//以月为时间粒度
  if(pageState.nowGraTime=="month"){
    var totalSum=0,totalDay=0,i=0,aveSum=0;
    for(var day in cityData){
       if(new Date(day).getMonth()!=i){
         aveSum=totalSum/totalDay;
         chartData['第'+(i+1)+'月']=Math.floor(aveSum);
         totalSum=0;
         totalDay=0;
         i++;
       }
       totalSum+=cityData[day];
       totalDay++;
    }
    if(totalSum>0){
      chartData['第'+(i+1)+'月']=Math.floor(totalSum/totalDay);
    }
  }

}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
  renderChart();
}

init();
