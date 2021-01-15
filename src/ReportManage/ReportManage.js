import React from "react";
import {
  Layout,
  Table,
  Button,
  Card,
  Select,
  Upload,
  message,
  Cascader,
  Alert
} from "antd";
import "./Farmer.css";
import { getFarmerInfo,getReport,uploadReport} from "../axios";
import {downUrl,requestIp} from "../axios/config"
const { Content, Footer, Sider, } = Layout;
const Option = Select.Option;

const role =localStorage.getItem("role");
const userID =localStorage.getItem("userID");
const token =localStorage.getItem("token");


const props = {
  // showUploadList:false,
  name: 'file',
  action:requestIp+"/management/uploadReport",
  headers:{
    authorization: 'Bearer ' + token
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

class ReportM extends React.Component {
  state = {
    isupload:true,
    collapsed: false,
    warning:"none",
    dataSource : [],
    gardensList:[],
    gardenID:null,
    columns :[{
      title: '茶园ID',
      dataIndex: 'gardenID',
    },
    {
      title:'上传时间',
      dataIndex:'create_time'
    },
    {
      title:'报告名称',
      dataIndex:'file_name'
    },
    {
      title: '操作',
      render: (text,record) => (
        <span>
          <a href={downUrl+record.file_address}>下载</a>
        </span>
      ),
    }]
  };




  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };
  FarmerInfo = ()=>{
    getFarmerInfo({
      role,
      userID
    })
    .then(res=>{
      let LIST = res.data.info.map(val=>{
        return{
          value:val.userID,
          label:val.userID,
          children:val.gardens.map(VAL=>{
            return {
              value:VAL.gardenID,
              label:VAL.gardenID
            }
          })
        }
      })
      this.setState({gardensList:LIST})
    })
  }
  componentWillMount() {
    this.FarmerInfo()
    
  }

  componentDidMount() {}

  handleChange=value=> {
    console.log(value)
    if(value.length>0&&role==11){
      this.setState({gardenID:value[value.length-1],
      isupload:false,
      warning:"block"
    })
    }else{
      this.setState({gardenID:value[value.length-1],
        isupload:true,
        warning:"none"
      })
    }
    
    
  }

  searchDate=()=>{
    if(this.state.gardenID){
      getReport({
        role,
        userID,
        gardenID:this.state.gardenID
      })
      .then(res=>{
        console.log(res,123)
        let list = res.data.info.map((val,ind)=>{
          return {
            "gardenID": val.gardenID,
            "create_time": val.create_time,
            "file_name": val.file_name,
            "file_address":val.file_address,
            "userID": val.userID
          }
        })
        this.setState({dataSource:list})
      })
    }
    
  }

  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>

        <Layout>
          <Content style={{ margin: "16px 16px" }} id="Farmer">
            <Card title="报告管理" id="queryFarmer">
            <Cascader options={this.state.gardensList} onChange={this.handleChange} placeholder="选择茶园：用户/茶园ID" />
            {/* <Select
            mode="multiple"
              style={{ width: 300 ,marginBottom:20}}
              placeholder="请输入茶园ID"
              onChange={this.handleChange}
            >
              {this.state.gardensList}
            </Select> */}
            <Button type="primary" style={{ marginLeft:10}} onClick={this.searchDate}>搜索</Button>
            <Upload  {...props} data={{
              role,
              userID,
              gardenID:this.state.gardenID,
            }}
            //  customRequest={(option)=>{
            //   var formData = new FormData();
            //   formData.append('file',option.file);
            //   formData.append('role',role);
            //   formData.append('userID',userID);
            //   formData.append('gardenID',this.state.gardenID[0]);
              
            //   uploadReport(
            //   formData
            //   )
            //   .then(res=>{
            //     console.log(res)
            //   })
            // }}
            >
            <Button type="primary" disabled={this.state.isupload} style={{ marginLeft:10,}} >上传</Button>    
            </Upload>
            <Alert message="注意：请将报告文件整合为一份pdf文档上传，同一茶园一天内只能保存一份报告，系统将保存当天上传的最后一份报告。" style={{marginTop:10,marginBottom:10,display:this.state.warning}} type="warning" showIcon />
            <Table rowKey={record=>record.gardenID} dataSource={this.state.dataSource} columns={this.state.columns} />
            
            </Card>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            longjing ©2018 Created by terabits
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default ReportM;
