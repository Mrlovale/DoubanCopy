var requests = require( '../../requests/request.js' );
var utils = require( '../../utils/util.js' );

Page({
  data:{
    id: null,
    loadingHidden: false,
    bookData: null
  },
  onLoad:function(options){
    this.setData({
      id: options.id
    })
  },
  onReady:function(){
    // 页面渲染完成
    var id = this.data.id;
    var that = this;
    requests.requestBookDokDetail(id, {fields: 'image,summary,publisher,title,rating,pubdate,author,author_intro,catalog'},
      function(data){
        console.log(data)
        that.setData({bookData: data})
      }, function(){
        wx.navigateBack();
      }, function(){
        that.setData({loadidngHidden: true})
      })
  }
})