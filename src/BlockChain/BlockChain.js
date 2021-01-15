import React from "react";
import {

  Layout,
  Row,
  Col,

  Drawer,
  Button,
  Select,
  Carousel
} from "antd";


import {
  getBlockTotalNumber,
  getBlockInfo,
  getBlockData,
  getNodeData,
  getAllNode,
  getFarmerInfo,
} from "../axios";
import "./BlockChain.css";


const { Content,} = Layout;

const Option = Select.Option;
const ReactHighcharts = require("react-highcharts");
const HighCharts = require("highcharts");
var blockNumber = 0;
var transactionNumber = 0;
var peerNumber = 0;
var chaincodeNumber = 0;
var blockChartData = [];
var blockChartCategories = [];
var blockListItems = [];
// var transactionListItems = [];
var temperatureChartData = [];
var temperatureChartCategories = [];
var moistureChartData = [];
var moistureChartCategories = [];
var lightChartData = [];
var lightChartCategories = [];
var pmChartData = [];
var pmChartCategories = [];
var txPieData = [];
const role =localStorage.getItem("role");
const userID =localStorage.getItem("userID");

export default class BlockChain extends React.Component {
  state = {
    garden:[],
    collapsed: false,
    blockNumber: 0,
    transactionNumber: 0,
    peerNumber: 0,
    chaincodeNumber: 0,
    visible: false, 
    placement: 'right',
    AlldataList:[],
    alla:[],
    userList:[],
    gardenList:[],
    imeiList:[],
    AllimeiList:[],
    gardenselectID:undefined,
    imeiselectID:undefined,
    blockChartCategories: [],
    blockChartData: [],
    temperatureChartCategories: [],
    temperatureChartData: [],
    moistureChartCategories: [],
    moistureChartData: [],
    lightChartCategories: [],
    lightChartData: [],
    pmChartCategories: [],
    pmChartData: [],
    timer: null,
    txPieData: [],
    txListItems: null,
    // transactionListItems: null
  };

  //******右边栏相关函数***** */


  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };
  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  onChange = (e) => {
    this.setState({
      placement: e.target.value,
    });
  }

  userIdChange=VAL=>{
    let list = null
    let area = null
    this.state.AlldataList.forEach((val,ind)=>{
      if(val.userID==VAL){
        area = val
        list=val.gardens.map(va=>{
          return (
            <Option key={va.gardenID}>{va.gardenID}</Option>
          )
        })
      }
    })
    
    this.setState({gardenselectID:undefined})
    this.setState({imeiselectID:undefined})
    this.setState({AllimeiList:area})
    this.setState({gardenList:list})
  }

  gardenChange=VAL=>{
    
    let list = null
    this.state.AllimeiList.gardens.forEach(val=>{
      if(val.gardenID==VAL){ 
        list=val.imei[0]!==null?val.imei.map(va=>{
          return (
            <Option key={va}>{va}</Option>
          )
        }):undefined
      }
    })
    
    this.setState({gardenselectID:VAL})
    this.setState({imeiList:list})
  }
  imeiChange=val=>{
    this.setState({imeiselectID:val})
  }
  // onCollapse = collapsed => {
  //   console.log(collapsed);
  //   this.setState({ collapsed });
  // };
  ImeiInfo=()=>{
    getAllNode({
      role,
      userID
    })
    // .then(res=>{
    //   let list = res.data.ImeiList.map(val=>{
    //     return (
    //       <Option key={val.userID}>{val.userID}</Option>
    //     )
    //   })
    //   this.setState({AlldataList:res.data.ImeiList})
    //   this.setState({userList:list})
    // })
  }

  switchgarden=()=>{
    this.updateTeaData()
    .then(()=>{
      this.updateData();

    })
  }



  //*****************************/


  itemChange=(key,event)=>{
    console.log(event)
  }

  iframeurl=()=>{
    let url=null
    if(role==13){
      url = "http://datav.aliyun.com/share/fff6927d77a8be192d769f4b24e97a9b"
    }else{
      url = "http://datav.aliyun.com/share/5d8ee5d5e6f08c0ac8ad692af564cdfd"
    }
    return url
  }
  waitForData = () => {
    if (
      blockNumber == 0 ||
      txPieData.length == 0 ||
      blockChartData.length == 0 ||
      blockListItems.length == 0 ||
      // transactionListItems.length == 0 ||
      lightChartData.length == 0
    ) {
      setTimeout(this.waitForData, 500);
    } else {
      setTimeout(this.updateData, 100);
    }
  };

  updateData = () => {
    this.setState(
      {
        blockNumber: 0,
        transactionNumber: 0,
        peerNumber: 0,
        chaincodeNumber: 0,
        txPieData: txPieData,
        blockChartData: blockChartData,
        blockChartCategories: blockChartCategories,
        blockListItems: blockListItems,
        // transactionListItems: transactionListItems,
        temperatureChartData: temperatureChartData,
        temperatureChartCategories: temperatureChartCategories,
        moistureChartData: moistureChartData,
        moistureChartCategories: moistureChartCategories,
        lightChartData: lightChartData,
        lightChartCategories: lightChartCategories,
        pmChartData: pmChartData,
        pmChartCategories: pmChartCategories
      },
      () =>
        this.setState({
          blockNumber: blockNumber,
          transactionNumber: transactionNumber,
          peerNumber: peerNumber,
          chaincodeNumber: chaincodeNumber
        })
    );
  };

  componentWillMount() {

    this.updateTxPieData();
    this.updateTotalNumber();
    this.updateBlockChart();
    this.updateBlockList();
    // this.updateTransactionList();
    this.updateTeaData();
    this.ImeiInfo();
    setTimeout(this.waitForData, 500);
    getFarmerInfo({role,userID})
    .then(res=>{
      if(res.data.code==200){
        let list =res.data.info[0].gardens.map(val=>{
          return{
            garden:val.gardenID
          }
        })
        this.setState({
          garden:list
        })
      }
    })
    
  }
  
  componentDidMount() {
    
    
    this.state.timer = setInterval(() => {
      this.updateTxPieData();
      this.updateTotalNumber();
      this.updateBlockList();
      // this.updateTransactionList();
      this.updateTeaData();
      this.updateBlockChart();
      this.updateData();
    }, 15000);
    window.addEventListener("resize", this.resize);
    HighCharts.theme = {
      chart: {
        backgroundColor: {
          linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
          stops: [[0, "transparent"], [1, "transparent"]]
        },
        style: {
          fontFamily: "'Unica One', sans-serif"
        },
        plotBorderColor: "#606063"
      },
      title: {
        style: {
          color: "#fff",
          textTransform: "none",
          fontSize: "20px"
        }
      },
      xAxis: {
        gridLineColor: "#707073",
        labels: {
          style: {
            color: "#E0E0E3"
          }
        },
        lineColor: "#707073",
        minorGridLineColor: "#505053",
        tickColor: "#707073",
        title: {
          style: {
            color: "#A0A0A3"
          }
        }
      },
      yAxis: {
        gridLineColor: "#707073",
        labels: {
          style: {
            color: "#E0E0E3"
          }
        },
        lineColor: "#707073",
        minorGridLineColor: "#505053",
        tickColor: "#707073",
        tickWidth: 1,
        title: {
          style: {
            color: "#A0A0A3"
          }
        }
      },
      legend: {
        itemStyle: {
          color: "#E0E0E3"
        },
        itemHoverStyle: {
          color: "#FFF"
        },
        itemHiddenStyle: {
          color: "#606063"
        }
      }
    };
    HighCharts.setOptions(HighCharts.theme);
    
    

  }

  resize() {
    this.setState({});
  }

  constructor(props) {
    super();
    this.resize = this.resize.bind(this); //非常重要，保证resize()方法内，this指向的对象不变
  }

  componentWillUnmount() {
    
    if (this.state.timer != null) {
      clearInterval(this.state.timer);
    }
    window.removeEventListener("resize", this.resize);
  }

  updateTxPieData = () => {
    txPieData = [
      {
        name: "orgnization1",
        y: 12.8,
        color: "#BEBEBE"
      },
      {
        name: "orgnization2",
        y: 24,
        color: "#708090",
        sliced: true,
        selected: true
      }
    ];
  };

  updateTotalNumber = () => {
    getBlockTotalNumber().then(res => {
      blockNumber = res.data.data.blockNumber;
      transactionNumber = res.data.data.transactionNumber;
      peerNumber = res.data.data.peerNumber;
      chaincodeNumber = res.data.data.chaincodeNumber;
    });
  };
  //24小时区块数
  updateBlockChart = () => {
    getBlockData().then(res => {
      let data = [];
      let categories = [];
      for (let i = 0; i < res.data.rows.length; i++) {
        data[i] = Number(res.data.rows[i].count);
        let hour =
          (Number(res.data.rows[i].datetime.substring(11, 13)) + 8) % 24;
        hour = hour >= 10 ? hour : "0" + hour;
        categories[i] = hour + res.data.rows[i].datetime.substring(13, 16);
      }
      blockChartData = data;
      blockChartCategories = categories;
    });
  };

  updateBlockList = () => {
    getBlockInfo([100, 0]).then(res => {
      res.data.rows.forEach((element, index) => {
        element.key = index;
      });
      blockListItems = res.data.rows.map(item => {
        let id = item.id;
        let txcount = item.txcount;
        let datahash = item.datahash;
        let maxLength = document.body.clientWidth * 0.25 > 800 ? 20 : 10;
        if (datahash.length > maxLength) {
          datahash = datahash.substring(0, maxLength) + "...";
        }
        let prehash = item.prehash;
        if (prehash.length > maxLength) {
          prehash = prehash.substring(0, maxLength) + "...";
        }
        let createdt = item.createdt;
        createdt = createdt.substring(0, 10) + " " + createdt.substring(11, 19);
        return (
          <Row gutter={16} key={id}>
            <Col span={2}>
              <div>{id}</div>
            </Col>
            <Col span={2}>
              <div>{txcount}</div>
            </Col>
            <Col span={6}>
              <div>{datahash}</div>
            </Col>
            <Col span={6}>
              <div>{prehash}</div>
            </Col>
            <Col span={8}>
              <div>{createdt}</div>
            </Col>
          </Row>
        );
      });
    });
  };


  updateTeaData = () => {
    return new Promise(resolve=>{
      var end = Date.parse(new Date());
      var start = end - 24 * 60 * 60 * 1000;
      this.formatDateTime(start);
      this.formatDateTime(end);
  
      getNodeData({
        role,
        userID:role==13?userID:null,
        gardenID:this.state.gardenselectID,
        imei:this.state.imeiselectID,
        time_start:this.formatDateTime(start),
        time_end:this.formatDateTime(end)

      })
      .then(res => {
          console.log(res,'真实')
          if(role==13){
            let array=[]
            res.data.gardenInfo.forEach((val)=>{
              this.state.garden.forEach((VAL)=>{
                if(val.gardenID==VAL.garden){
                  array.push(val)
                }
              })
            })
            console.log(array,101)
            this.setState({alla:array})
          }else{

            res.data.gardenInfo.forEach((val,ind)=>{
              if(val.gardenID=='WestLakeLongjingGarden001'){
                res.data.gardenInfo.splice(ind,1)
              }
            })
            this.setState({alla:res.data.gardenInfo})
          }
          for (let i = 0; i < res.data.gardenInfo.length; i++) {
            // if(res.data.gardenInfo[i].infos.length==0){
            //   temperatureChartCategories = [
            //     "16:43",
            //     "17:45",
            //     "18:46",
            //     "19:48",
            //     "20:50",
            //     "21:51",
            //     "22.53",
            //     "23:55",
            //     "0:56",
            //     "01:58",
            //     "03:00",
            //     "04:01",
            //     "05:03",
            //     "06:04",
            //     "07:06",
            //     "08:08",
            //     "09:10",
            //     "10:12",
            //     "11:14",
            //     "12:16",
            //     "13:18",
            //     "14:20",
            //     "16:06"
            //   ];
            //   moistureChartCategories = temperatureChartCategories;
            //   lightChartCategories = temperatureChartCategories;
            //   pmChartCategories = temperatureChartCategories;
            //   temperatureChartData[i] = [
            //     11,
            //     11,
            //     11,
            //     11,
            //     11,
            //     12,
            //     12,
            //     13,
            //     12,
            //     12,
            //     12,
            //     12,
            //     12,
            //     12,
            //     11,
            //     11,
            //     10,
            //     10,
            //     9,
            //     9,
            //     9,
            //     9,
            //     9
            //   ]
            //   moistureChartData[i] = [
            //     7,
            //     7,
            //     7,
            //     7,
            //     7,
            //     7,
            //     7,
            //     7,
            //     7,
            //     8,
            //     8.1,
            //     7,
            //     7,
            //     7,
            //     6.8,
            //     6.8,
            //     6.8,
            //     6.7,
            //     6.6,
            //     6.6,
            //     6.6,
            //     6.5,
            //     6.4
            //   ];
            //   lightChartData[i] = [
            //     30077,
            //     10284,
            //     3232,
            //     572,
            //     572,
            //     575,
            //     572,
            //     568,
            //     571,
            //     571,
            //     573,
            //     573,
            //     1389,
            //     18803,
            //     40607,
            //     76210,
            //     127302,
            //     126351,
            //     125913,
            //     94617,
            //     126244,
            //     91918,
            //     66816
            //   ];
            //   pmChartData[i] =[
            //     180,
            //     195,
            //     187,
            //     169,
            //     166,
            //     108,
            //     133,
            //     169,
            //     179,
            //     182,
            //     141,
            //     116,
            //     122,
            //     168,
            //     125,
            //     61,
            //     64,
            //     60,
            //     34,
            //     41,
            //     31,
            //     26,
            //     44
            //   ];
            // }else{
                temperatureChartData[i]=res.data.gardenInfo[i].infos.map(val=>{
                return val.temperature
              })
              moistureChartData[i]=res.data.gardenInfo[i].infos.map(val=>{
                return val.moisture
              })
              lightChartData[i]=res.data.gardenInfo[i].infos.map(val=>{
                return val.light
              })
              pmChartData[i]=res.data.gardenInfo[i].infos.map(val=>{
                return val.PM25
              })
              temperatureChartData[i]=res.data.gardenInfo[i].infos.map(val=>{
                return val.temperature
              })
              for (let j = 0; j < res.data.gardenInfo[i].infos.length; j++) {
                let hour =
                  Number(res.data.gardenInfo[i].infos[j].time.substring(11, 13)) % 24;
                hour = hour >= 10 ? hour : "0" + hour;
                let minute = res.data.gardenInfo[i].infos[j].time.substring(14, 16);
                // temperatureChartData[j] = res.data.gardenInfo[i].infos[j].temperature;
                // moistureChartData[j] = res.data.gardenInfo[i].infos[j].moisture;
                // lightChartData[j] = res.data.gardenInfo[i].infos[j].light;
                // pmChartData[j] = res.data.gardenInfo[i].infos[j].PM25;
                temperatureChartCategories[j] = hour + ":" + minute;
                moistureChartCategories[j] = hour + ":" + minute;
                lightChartCategories[j] = hour + ":" + minute;
                pmChartCategories[j] = hour + ":" + minute;
              }
            // }
            
            
          }
          console.log(temperatureChartData)
        // }
        resolve()
      });

    })
  };

  formatDateTime = timeStamp => {
    var date = new Date();
    date.setTime(timeStamp);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    var d = date.getDate();
    d = d < 10 ? "0" + d : d;
    var h = date.getHours();
    h = h < 10 ? "0" + h : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? "0" + minute : minute;
    second = second < 10 ? "0" + second : second;
    return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
  };



  hours24data=(titleText,seriesText,ChartCategories,ChartData)=>{
    var chartConfig = {
      colors: [
        "#00ffff",
        "#90ee7e",
        "#f45b5b",
        "#7798BF",
        "#aaeeee",
        "#ff0066",
        "#eeaaee",
        "#55BF3B",
        "#DF5353",
        "#7798BF",
        "#aaeeee"
      ],
      chart: {
        height: document.body.clientHeight * 0.22
      },
      title: {
        style: {
          fontSize: document.body.clientHeight * 0.015
        }
      },
      yAxis: {
        title: "",
        minPadding: 1,
        allowDecimals: false
      },
      legend: {
        enabled: false
      },
      // series: [
      //   {
      //     data: this.state.temperatureChartData[0],
      //     name: "温度/°C"
      //   }
      // ],
      credits: {
        enabled: false //不显示LOGO
      }
    };
    return(
       {
        ...chartConfig,
        title: {
          ...chartConfig.title,
          text: titleText
        },
        xAxis: {
          categories: ChartCategories,
          visible: true
        },
        series: [
          {
            data: ChartData,
            name: seriesText
          }
        ]
      }
    )
  }



  render() {


    // var blockChartConfig = {
    //   ...chartConfig,
    //   colors: ["#00ffff"],
    //   chart: {
    //     height: document.body.clientHeight * 0.24
    //   },
    //   xAxis: {
    //     categories: this.state.blockChartCategories,
    //     visible: true
    //   },
    //   title: {
    //     ...chartConfig.title,
    //     text: "近24小时生成区块数"
    //   },
    //   series: [
    //     {
    //       data: this.state.blockChartData,
    //       name: "交易数"
    //     }
    //   ]
    // };

    var pieConfig = {
      title: {
        style: {
          fontSize: document.body.clientHeight * 0.015
        }
      },
      chart: {
        height: document.body.clientHeight * 0.24
      },
      tooltip: {
        headerFormat: "{series.name}<br>",
        pointFormat: "{point.name}: <b>{point.percentage:.1f}%</b>"
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            distance: 0,
            style: {
              color: "white",
              fontSize: document.body.clientHeight * 0.015,
              textShadow: "0px 0px 0px black"
            },
            format: "{point.percentage:.1f}%"
          },
          showInLegend: true // 设置饼图是否在图例中显示
        }
      },
      series: this.state.txPieSeries,
      credits: {
        enabled: false //不显示LOGO
      }
    };

    var txPieConfig = {
      ...pieConfig,
      title: { ...pieConfig.title, text: "各组织交易占比" },
      series: [
        {
          type: "pie",
          name: "区块产生量占比",
          data: this.state.txPieData
        }
      ]
    };




    var blockAnimationSettings = {
      start: 0,
      count: Number(this.state.blockNumber),
      duration: 2000,
      decimals: 0,
      useGroup: true,
      animation: "up"
    };

    var transactionAnimationSettings = {
      start: 0,
      count: Number(this.state.transactionNumber),
      duration: 2000,
      decimals: 0,
      useGroup: true,
      animation: "up"
    };

    var peerAnimationSettings = {
      start: 0,
      count: Number(this.state.peerNumber),
      duration: 2000,
      decimals: 0,
      useGroup: true,
      animation: "up"
    };

    var chaincodeAnimationSettings = {
      start: 0,
      count: Number(this.state.chaincodeNumber),
      duration: 2000,
      decimals: 0,
      useGroup: true,
      animation: "up"
    };

    return (
      <Layout style={{ minHeight: "100vh" }}>
        
        <div className="mainpage">
          <Content >
         
            <div
              className="gutter-example-blockchain"
            > 
              <div className="dataVframe">
                <iframe frameBorder="0"  id="dataV" style={{width:"100%",height:'100vh'}}  src={this.iframeurl()}/>
                

              </div>
             
               
               <Carousel  autoplay >
               {this.state.alla.map((val,key)=>{
                  return(
                  <div key={key}>
                    <div className="spans">
                      <Row
                        gutter={16}
                        style={{
                          marginTop: 0,
                          fontSize: document.body.clientHeight * 0.02,
                          padding: document.body.clientHeight * 0.02
                        }}
                      >
                      {/* <Button onClick={this.showDrawer}>选择茶园</Button> */}
                        <p className="sub-title" style={{ textAlign: "center" }}>
                          {val.name}  近24小时现场监测数据
                        </p>
                        
                        <Col span={6}>
                          <ReactHighcharts
                            config={this.hours24data("温度/Temperature","温度/°C",this.state.temperatureChartCategories,this.state.temperatureChartData[key])}
                            ref="chart"
                          />
                        </Col>
                        <Col span={6}>
                          <ReactHighcharts config={this.hours24data("湿度/Moisture","湿度/%",this.state.moistureChartCategories,this.state.moistureChartData[key])} ref="chart" />
                        </Col>
                        <Col span={6}>
                          <ReactHighcharts config={this.hours24data("光照/Light","光照/Lux",this.state.lightChartCategories,this.state.lightChartData[key])} ref="chart" />
                        </Col>
                        <Col span={6}>
                          <ReactHighcharts config={this.hours24data("PM2.5","PM2.5/μg/m3",this.state.pmChartCategories,this.state.pmChartData[key])} ref="chart" />
                        </Col>
                      </Row>
                    </div>
                    </div>
                  )
                  })}
              </Carousel>

            
              
            </div>
            <Drawer
              title="切换茶园"
              placement={this.state.placement}
              closable={false}
              onClose={this.onClose}
              visible={this.state.visible}
              width={346}
            >
            <Select
              showSearch
              style={{ width: 300 ,marginBottom:20}}
              placeholder="请输入用户ID"
              onChange={this.userIdChange}
            >
              {this.state.userList}
            </Select>
            <Select
              showSearch
              allowClear
              placeholder="请输入茶园ID"
              notFoundContent="暂无设备"
              value={this.state.gardenselectID}
              style={{ width: 300 ,marginBottom:20}}
              
              onChange={this.gardenChange}
            >
              {this.state.gardenList}
            </Select>
            <Select
              showSearch
              allowClear
              placeholder="请输入设备imei号"
              notFoundContent="暂无设备"
              style={{ width: 300 ,marginBottom:20}}
              value={this.state.imeiselectID}
              onChange={this.imeiChange}
            >
              {this.state.imeiList}
            </Select>
            <Button onClick={this.switchgarden}>切换</Button>
            </Drawer>
          </Content>
          
        </div>
      </Layout>
    );
  }
}


