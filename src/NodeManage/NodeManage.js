import React from "react";
import {
  Table,
  Layout,

  Row,
  Col,
  Card,

  Button,
  Input,
  Modal,
  message,
  Cascader
} from "antd";

import {
  getAllNodeInfo,
  addNode,
  deleteNode,
  changeFrequency,
  changeIp,
  getAllNode
} from "../axios";
import "./NodeManage.css";

const { Content, F } = Layout;


const InputGroup = Input.Group;
const role =localStorage.getItem("role");
const userID =localStorage.getItem("userID");

const nodeInfoTableColumns = [
  {
    title: "节点名称",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "IMEI",
    dataIndex: "imei",
    key: "imei"
  },
  {
    title: "IMSI",
    dataIndex: "imsi",
    key: "imsi"
  },
  {
    title: "茶园ID",
    dataIndex: "gardenID",
    key: "gardenID"
  },
  {
    title: "经度",
    dataIndex: "longitude",
    key: "longitude"
  },
  {
    title: "纬度",
    dataIndex: "latitude",
    key: "latitude"
  },
  {
    title: "上报频率",
    dataIndex: "frequency",
    key: "frequency"
  },
  {
    title: "添加时间",
    dataIndex: "create_time",
    key: "create_time"
  }
];

class App extends React.Component {
  state = {
    collapsed: false,
    nodeNameSelected: [],
    deleteNodeDisabled: true,
    frequencyChangeDisabled: true,
    deleteNodeModalVisible: false,
    changeFrequencyModalVisible: false,
    changeIpModalVisible: false,
    frequencyInput: null,
    ipInput: null,
    portInput: null,
    nodeInfoTableDataSource: [],
    addNodeModalVisible: false,
    addNodenameInput:null,
    addNodeImeiInput: null,
    addNodeImsiInput: null,
    addNodeGardenIDInput: null,
    addNodeLongitudeInput: null,
    addNodeLatitudeInput: null,
    addNodeFrequencyInput: null,
    GardenList: [],
    addNodeGardenIDValue: null
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  componentWillMount() {
    getAllNodeInfo({
      role,
      userID
    }).then(res => {
      console.log(res)
      if(res.data.ImeiList.length>0){
        res.data.ImeiList.forEach((element, index) => {
        element.key = index;
      });
      this.setState({ nodeInfoTableDataSource: res.data.ImeiList });
      }
      
    });
    getAllNode({
      role,userID
    }).then(res => {
      let user = [];
      for (let i = 0; i < res.data.ImeiList.length; i++) {
        let garden = [];
        for (let j = 0; j < res.data.ImeiList[i]["gardens"].length; j++) {
          garden.push({
            value: res.data.ImeiList[i]["gardens"][j]["gardenID"],
            label: res.data.ImeiList[i]["gardens"][j]["gardenID"]
          });
        }
        user.push({
          value: res.data.ImeiList[i]["userID"],
          label: res.data.ImeiList[i]["userID"],
          children: garden
        });
      }
      this.setState({ GardenList: user });
    });
  }

  componentDidMount() {}

  addNodeModel = () => {
    this.setState({ addNodeModalVisible: true });
  };

  addNodeModalHandleOk = () => {
    if (
      !this.state.addNodeImeiInput ||
      this.state.addNodeImeiInput === "" ||
      !this.state.addNodeImsiInput ||
      this.state.addNodeImsiInput === "" ||
      !this.state.addNodeGardenIDInput ||
      this.state.addNodeGardenIDInput === "" ||
      !this.state.addNodeLongitudeInput ||
      this.state.addNodeLongitudeInput === "" ||
      !this.state.addNodeLatitudeInput ||
      this.state.addNodeLatitudeInput === "" ||
      !this.state.addNodeFrequencyInput ||
      this.state.addNodeFrequencyInput === ""||
      !this.state.addNodenameInput ===""|| 
      !this.state.addNodenameInput
     
    ) {
      message.error("请输入完整信息！");
    } else {
      addNode([
        this.state.addNodeImeiInput,
        this.state.addNodeImsiInput,
        this.state.addNodeGardenIDInput,
        this.state.addNodeLongitudeInput,
        this.state.addNodeLatitudeInput,
        this.state.addNodeFrequencyInput,
        role,
        userID,
        this.state.addNodenameInput
      ]).then(res => {
        if (res.data.success) {
          message.success("添加成功！");
          console.log(this.state.addNodeGardenIDInput)
          let date = new Date();
          let line = {
            key: this.state.nodeInfoTableDataSource.length,
            imei: this.state.addNodeImeiInput,
            imsi: this.state.addNodeImsiInput,
            gardenID: this.state.addNodeGardenIDInput,
            longitude: this.state.addNodeLongitudeInput,
            latitude: this.state.addNodeLatitudeInput,
            frequency: this.state.frequencyInput,
            name:this.state.addNodenameInput,
            create_time:
              date.getFullYear() +
              "-" +
              date.getMonth() +
              "-" +
              date.getDay() +
              " " +
              date.getHours() +
              ":" +
              date.getMinutes() +
              ":" +
              date.getSeconds()
          };
          {
            let tempData = [...this.state.nodeInfoTableDataSource];
            tempData.unshift(line);
            console.log(tempData)
            this.setState({ 
              nodeInfoTableDataSource: tempData,
              addNodeImeiInput: null,
              addNodeImsiInput: null,
              addNodeGardenIDInput: null,
              addNodeGardenIDValue: null,
              addNodeLongitudeInput: null,
              addNodeLatitudeInput: null,
              addNodeFrequencyInput: null,
              addNodenameInput:null
             });
          }
        } else {
          message.error("添加失败！");
        }
        this.setState({ addNodeModalVisible: false });
        this.setState({
          addNodeImeiInput: null,
          addNodeImsiInput: null,
          addNodeGardenIDInput: null,
          addNodeLongitudeInput: null,
          addNodeLatitudeInput: null,
          addNodeFrequencyInput: null,
          addNodenameInput:null
        });
      });
    }
  };

  addNodeModalHandleCancel = () => {
    this.setState({ addNodeModalVisible: false });
    this.setState({
      addNodeImeiInput: null,
      addNodeImsiInput: null,
      addNodeGardenIDInput: null,
      addNodeGardenIDValue: null,
      addNodeLongitudeInput: null,
      addNodeLatitudeInput: null,
      addNodeFrequencyInput: null,
      addNodenameInput:null
    });
  };

  deleteNodeModel = () => {
    this.setState({ deleteNodeModalVisible: true });
  };

  deleteNodeModalHandleOk = () => {
    deleteNode([JSON.stringify(this.state.nodeNameSelected),role,userID]).then(res => {
      console.log(res)
      if (res.data.success) {
        message.success("删除成功！");
        let temp = [];
        for (let i = 0; i < this.state.nodeNameSelected.length; i++) {
          temp = this.state.nodeInfoTableDataSource.filter(
            item => item.imei !== this.state.nodeNameSelected[i]
          );
          this.setState({ nodeInfoTableDataSource: temp });
        }
      } else {
        message.error("删除失败！");
      }
      this.setState({ deleteNodeModalVisible: false });
    });
  };

  deleteNodeModalHandleCancel = () => {
    this.setState({ deleteNodeModalVisible: false });
  };

  frequencyChange = () => {
    if (!this.state.frequencyInput || this.state.frequencyInput === "") {
      message.error("请输入上报频率");
    } else {
      this.setState({ changeFrequencyModalVisible: true });
    }
  };

  changeFrequencyModalHandleOk = () => {
    changeFrequency([
      JSON.stringify(this.state.nodeNameSelected),
      this.state.frequencyInput,
      role,
      userID
    ]).then(res => {
      if (res.data.success) {
        message.success("上报频率修改成功！");
      } else {
        message.error("上报频率修改失败！");
      }
      this.setState({ deleteNodeModalVisible: false });
    });
    this.setState({ changeFrequencyModalVisible: false });
  };

  changeFrequencyModalHandleCancel = () => {
    this.setState({ changeFrequencyModalVisible: false });
  };

  ipChange = () => {
    if (
      !this.state.ipInput ||
      this.state.ipInput === "" ||
      !this.state.portInput ||
      this.state.portInput === ""
    ) {
      message.error("请输入连接地址和端口");
    } else {
      this.setState({ changeIpModalVisible: true });
    }
  };

  changeIpModalHandleOk = () => {
    changeIp([this.state.ipInput + ":" + this.state.portInput,role,userID]).then(res => {
      if (res.data.success) {
        message.success("连接地址修改成功！");
      } else {
        console.log(res)
        message.error("连接地址修改失败！"+res.data.message);
      }
      this.setState({ deleteNodeModalVisible: false });
    });
    this.setState({ changeFrequencyModalVisible: false });
    this.setState({ changeFrequencyModalVisible: false });
  };

  changeIpModalHandleCancel = () => {
    this.setState({ changeIpModalVisible: false });
  };

  dataInfoTableRowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      let nodeNameList = selectedRows.map(row => row.imei);
      this.setState({ nodeNameSelected: nodeNameList }, () => {
        if (this.state.nodeNameSelected.length === 0) {
          this.setState({
            deleteNodeDisabled: true,
            frequencyChangeDisabled: true
          });
        } else {
          this.setState({
            deleteNodeDisabled: false,
            frequencyChangeDisabled: false
          });
        }
      });
    }
  };

  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>

        <Layout>
          <Content style={{ margin: "16px 16px" }} id="NodeManage">
            <Card title="节点信息管理" id="nodeManage">
              <div className="gutter-example-nodemanage">
                <Row>
                  <Col className="gutter-row-nodemanage" span={6}>
                    <div className="gutter-box-nodemanage">
                      <div>
                        <Button type="primary" onClick={this.addNodeModel}>
                          添加
                        </Button>
                        <Button
                          disabled={this.state.deleteNodeDisabled}
                          onClick={this.deleteNodeModel}
                          style={{ marginLeft: 10 }}
                        >
                          删除
                        </Button>
                        <Modal
                          title="提示"
                          visible={this.state.deleteNodeModalVisible}
                          onOk={this.deleteNodeModalHandleOk}
                          onCancel={this.deleteNodeModalHandleCancel}
                          cancelText="取消"
                          okText="确定"
                        >
                          <p>确定删除选中节点吗？</p>
                        </Modal>
                      </div>
                    </div>
                  </Col>
                  <Col className="gutter-row-nodemanage" span={8}>
                    <div className="gutter-box-nodemanage">
                      <Input
                        placeholder="输入频率值/s"
                        style={{ width: 130 }}
                        value={this.state.frequencyInput}
                        onChange={e => {
                          this.setState({ frequencyInput: e.target.value });
                        }}
                        type="number"
                      />
                      <Button
                        disabled={this.state.frequencyChangeDisabled}
                        onClick={this.frequencyChange}
                        style={{ marginLeft: 10 }}
                      >
                        修改频率
                      </Button>
                      <Modal
                        title="提示"
                        visible={this.state.changeFrequencyModalVisible}
                        onOk={this.changeFrequencyModalHandleOk}
                        onCancel={this.changeFrequencyModalHandleCancel}
                        cancelText="取消"
                        okText="确定"
                      >
                        <p>确定修改选中节点的上报频率吗？</p>
                      </Modal>
                    </div>
                  </Col>
                  <Col className="gutter-row-nodemanage" span={10}>
                    <div className="gutter-box-nodemanage">
                      <Input
                        placeholder="IP 110.10.10.10"
                        style={{ width: 130 }}
                        value={this.state.ipInput}
                        onChange={e => {
                          this.setState({ ipInput: e.target.value });
                        }}
                        type="text"
                        pattern="[0-9]*"
                      />
                      <Input
                        placeholder="端口 100"
                        style={{ width: 100, marginLeft: 10 }}
                        value={this.state.portInput}
                        onChange={e => {
                          this.setState({ portInput: e.target.value });
                        }}
                        type="number"
                      />
                      <Button
                        onClick={this.ipChange}
                        style={{ marginLeft: 10 }}
                      >
                        修改连接地址
                      </Button>
                      <Modal
                        title="提示"
                        visible={this.state.changeIpModalVisible}
                        onOk={this.changeIpModalHandleOk}
                        onCancel={this.changeIpModalHandleCancel}
                      >
                        <p>确定修改所有节点的连接地址吗？</p>
                      </Modal>
                    </div>
                  </Col>
                </Row>
              </div>
              <div style={{ marginTop: 20 }}>
                <Table
                  rowSelection={this.dataInfoTableRowSelection}
                  dataSource={this.state.nodeInfoTableDataSource}
                  columns={nodeInfoTableColumns}
                />
              </div>
              <div id="addNode">
                <Modal
                  title="添加节点"
                  visible={this.state.addNodeModalVisible}
                  onOk={this.addNodeModalHandleOk}
                  onCancel={this.addNodeModalHandleCancel}
                  cancelText="取消"
                  okText="确定"
                >
                  <InputGroup compact>
                    <Input
                      style={{ width: "15%" }}
                      defaultValue="IMEI"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: "85%" }}
                      placeholder="请输入15位IMEI号"
                      value={this.state.addNodeImeiInput}
                      onChange={e => {
                        this.setState({ addNodeImeiInput: e.target.value });
                      }}
                    />
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: "15%" }}
                      defaultValue="IMSI"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: "85%" }}
                      placeholder="请输入IMSI号"
                      value={this.state.addNodeImsiInput}
                      onChange={e => {
                        this.setState({ addNodeImsiInput: e.target.value });
                      }}
                    />
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: "15%" }}
                      defaultValue="设备名称"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: "85%" }}
                      placeholder="请输入设备名称"
                      value={this.state.addNodenameInput}
                      onChange={e => {
                        this.setState({ addNodenameInput: e.target.value });
                      }}
                    />
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: "15%" }}
                      defaultValue="茶园ID"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Cascader
                      style={{ width: "85%" }}
                      options={this.state.GardenList}
                      onChange={e => {
                        this.setState({
                          addNodeGardenIDInput: e[1],
                          addNodeGardenIDValue: e
                        });
                      }}
                      placeholder="请选择茶园ID"
                      value={this.state.addNodeGardenIDValue}
                    />
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: "15%" }}
                      defaultValue="经度"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: "85%" }}
                      placeholder="请输入经度"
                      value={this.state.addNodeLongitudeInput}
                      onChange={e => {
                        this.setState({
                          addNodeLongitudeInput: e.target.value
                        });
                      }}
                    />
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: "15%" }}
                      defaultValue="纬度"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: "85%" }}
                      placeholder="请输入纬度"
                      value={this.state.addNodeLatitudeInput}
                      onChange={e => {
                        this.setState({ addNodeLatitudeInput: e.target.value });
                      }}
                    />
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: "15%" }}
                      defaultValue="频率"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: "85%" }}
                      placeholder="请输入上报频率"
                      value={this.state.addNodeFrequencyInput}
                      onChange={e => {
                        this.setState({
                          addNodeFrequencyInput: e.target.value
                        });
                      }}
                    />
                  </InputGroup>
                </Modal>
              </div>
            </Card>
          </Content>

        </Layout>
      </Layout>
    );
  }
}

export default App;
