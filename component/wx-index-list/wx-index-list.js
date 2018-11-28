// component/wx-index-list/wx-index-list.js
//获取应用实例
const app = getApp();
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) { 
        this.resetRight(newVal);
      }
    },
    myCity: {
      type: String,
      value: "北京1",
    },
    // 用于外部组件搜索使用
    search:{
      type:String,
      value:"",
      observer: function (newVal, oldVal) { 
        //console.log(newVal)
        this.value = newVal;
        this.searchMt();
      }
    }
  },

  data: {
    list: [],
    rightArr: [],// 右侧字母展示
    jumpNum: '',//跳转到那个字母
    myCityName: '请选择' // 默认我的城市
  },
  ready() {
    let data = this.data.data;
    let that = this;
    this.resetRight(data);
    if (this.data.myCity) {
      // this.getCity(this)
      console.log(this);
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          that.latitude = res.latitude;
          that.longitude = res.longitude;
          that.locationMt(that)
        }
      })

    }
  },
  methods: {
    // 数据重新渲染
    resetRight(data) {
      let rightArr = []
      for (let i in data) {
        rightArr.push(data[i].title.substr(0, 1));
      }
      this.setData({
        list: data,
        rightArr
      })
    },

    // 右侧字母点击事件
    jumpMt(e) {
      let jumpNum = e.currentTarget.dataset.id;
      this.setData({ jumpNum });
    },
    // 列表点击事件
    detailMt(e) {
      let detail = e.currentTarget.dataset.detail || {'name':e._relatedInfo.anchorTargetText, 'key': 'myLocation'}
      let myEventOption = {
        bubbles: false,//事件是否冒泡
        composed: false,//事件是否可以穿越组件边界
        capturePhase: false //事件是否拥有捕获阶段
      } // 触发事件的选项
      this.triggerEvent('detail', detail, myEventOption)

    },
    // 获取搜索输入内容
    input(e) {
      this.value = e.detail.value;
      // 基础搜索功能
      this._search();
    },

    _search(){
      let data = this.data.data;
      let newData = [];
      for (let i = 0; i < data.length; i++) {
        let itemArr = [];
        for (let j = 0; j < data[i].item.length; j++) {
          if (data[i].item[j].name.indexOf(this.value) > -1) {
            let itemJson = {};
            for (let k in data[i].item[j]) {
              itemJson[k] = data[i].item[j][k];
            }
            itemArr.push(itemJson);
          }
        }
        if (itemArr.length === 0) {
          continue;
        }
        newData.push({
          title: data[i].title,
          type: data[i].type ? data[i].type : "",
          item: itemArr
        })
      }
      this.resetRight(newData);
    },
    // 城市定位
    locationMt(that) {
      if(that.type != 'tap'){
        // 实例化API核心类
        var qqMap = new QQMapWX({
          key: app.globalData.qqmap_key
        });
        // 当前城市信息
        qqMap.reverseGeocoder({
          location: {
            latitude: that.latitude,
            longitude: that.longitude
          },
          success: function (res) {
            // 设置当前城市
            that.setData({
              myCity: res.result.address_component.city
            })
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            console.log(res);
          }
        });
      } else {
        console.log('fuck')
      }
      
    }

  }
})
