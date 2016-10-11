//index.js
var requests = require( '../../requests/request.js' );
var utils = require( '../../utils/util.js' );

//刷新动态球颜色
var iconColor = [
  '#353535', '#888888'
];

//获取应用实例
var app = getApp()
Page({
  data: {
    pageIndex: 0, //页码
    totalRecord: 0, //图书总数
    isInit: true, //是否第一次进入应用
    loadingMore: false, //是否正在加载更多
    footerIconColor: iconColor[ 0 ], //下拉刷新球初始颜色
    pageData: [], //图书数据
    searchKey: null //搜索关键字
  },

  onShow: function(options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.data.scrollHeight = res.windowHeight - 50; //50为顶部搜索框区域高度 
      }
    })
  },
  
  //搜索按钮点击事件
  searchClickEvent: function() {
    console.log("查询")
    if (!this.data.searchKey) return;
    this.setData({pageIndex: 0, pageData: []});
    requestData.call(this);
  },

  //搜索输入框输入取值
  searchInputEvent: function(e) {
    this.setData({searchKey: e.detail.value});
  },

  //下拉请求数据
  scrollLowerEvent: function( e ) {
    requestData.call( this );
  },

  // 跳转到详细页面
  toDetailPage: function(e) {
    console.log(e)
    var bid = e.currentTarget.dataset.bid; //图书id [data-bid]
    wx.navigateTo({
      url: '../detail/detail?id=' + bid
    })
  }

})

// 请求图书信息
function requestData() {
  var that = this;
  var q = this.data.searchKey;
  var start = this.data.pageIndex;
  this.setData({loadingMore: true, isInit: false });
  updateRefreshBall.call(this);

  requests.requestSearchBook({ q: q, start: start }, function(data){
    console.log("---------")
    console.log(data)
    if(data.total == 0) {
      that.setData( { totalRecord: 0 });
    } else {
      that.setData( {
        pageData: that.data.pageData.concat( data.books ),
        pageIndex: start + 1,
        totalRecord: data.total
      });
    }
  }, function(){
    that.setData( { totalRecord: 0 });
  }, function(){
    that.setData( { loadingMore: false });
  })

}

// 刷新下拉效果变色球
function updateRefreshBall() {
  console.log("刷新下拉效果变色球")
  var cIndex = 0;
  var that = this;
  var timer = setInterval(function(){
    if(!that.data['loadingMore']) {
      clearInterval(timer);
    }
    if(cIndex >= iconColor.length) {
      cIndex = 0;
    }
    that.setData({footerIconColor: iconColor[ cIndex++ ]})
  },100)
}
