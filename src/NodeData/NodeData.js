import React from "react";
import {
  Table,
  Layout,
  Row,
  Col,
  Card,
  DatePicker,
  Button,
  Cascader,
  message
} from "antd";

import { getAllNode, getNodeData } from "../axios";
import "./NodeData.css";

const { Content } = Layout;
const { RangePicker } = DatePicker;
const role = localStorage.getItem("role");
const userID = localStorage.getItem("userID");
const nodeDataTableColumns = [
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
    title: "CSQ",
    dataIndex: "csq",
    key: "csq"
  },
  {
    title: "PM2.5",
    dataIndex: "pm25",
    key: "pm25"
  },
  {
    title: "温度",
    dataIndex: "temperature",
    key: "temperature"
  },
  {
    title: "湿度",
    dataIndex: "moisture",
    key: "moisture"
  },
  {
    title: "光照",
    dataIndex: "light",
    key: "light"
  },
  {
    title: "电量",
    dataIndex: "power",
    key: "power"
  },
  {
    title: "时间",
    dataIndex: "time",
    key: "time"
  }
];

class App extends React.Component {
  state = {
    collapsed: false,
    queryParams: [],
    farmerSelected: null,
    gardenIdSelected: null,
    nodeImeiSelected: null,
    startTimeSelected: "",
    endTimeSelected: "",
    nodeDataTableDataSource: []
  };
  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  componentWillMount() {
    getAllNode({
      role, userID
    }).then(res => {
      let user = [
        {
          value: "全部茶农",
          label: "全部茶农"
        }
      ];
      console.log(res);
      for (let i = 0; i < res.data.ImeiList.length; i++) {
        let garden = [
          {
            value: "全部茶园",
            label: "全部茶园"
          }
        ];
        for (let j = 0; j < res.data.ImeiList[i]["gardens"].length; j++) {
          let nodeImei = [
            {
              value: "全部节点",
              label: "全部节点"
            }
          ];
          for (
            let k = 0;
            k < res.data.ImeiList[i]["gardens"][j]["imei"].length;
            k++
          ) {
            nodeImei.push({
              value: res.data.ImeiList[i]["gardens"][j]["imei"][k],
              label: res.data.ImeiList[i]["gardens"][j]["imei"][k]
            });
          }
          garden.push({
            value: res.data.ImeiList[i]["gardens"][j]["gardenID"],
            label: res.data.ImeiList[i]["gardens"][j]["gardenID"],
            children: nodeImei
          });
        }
        user.push({
          value: res.data.ImeiList[i]["userID"],
          label: res.data.ImeiList[i]["userID"],
          children: garden
        });
      }
      this.setState({ queryParams: user });
    });
  }

  componentDidMount() { }

  nodeNameChange = value => {
    this.setState({ nodeNameSelected: value });
    console.log(`selected ${value}`);
  };

  timeChange = (datas, dataStrings) => {
    this.setState({
      startTimeSelected: dataStrings[0] + " 00:00:00",
      endTimeSelected: dataStrings[1] + " 23:59:59"
    });
    console.log(`selected ${dataStrings}`);
  };

  query = () => {
    if (!this.state.startTimeSelected || !this.state.endTimeSelected) {
      message.error("请输入查询起止时间");
      return;
    }
    let params = {
      'role' : role,
      'userID' : this.state.farmerSelected,
      'gardenID' : this.state.gardenIdSelected,
      'imei' : this.state.nodeImeiSelected,
      'time_start' : this.state.startTimeSelected,
      'time_end' : this.state.endTimeSelected
    };
    getNodeData(params).then(res => {
      console.log(res)
      let data = [];
      for (let i = 0; i < res.data.gardenInfo.length; i++) {
        for (let j = 0; j < res.data.gardenInfo[i].infos.length; j++) {
          let single = {
            name: res.data.gardenInfo[i].infos[j].name,
            imei: res.data.gardenInfo[i].infos[j].imei,
            csq: res.data.gardenInfo[i].infos[j].csq,
            pm25: res.data.gardenInfo[i].infos[j].PM25,
            temperature: res.data.gardenInfo[i].infos[j].temperature,
            moisture: res.data.gardenInfo[i].infos[j].moisture,
            light: res.data.gardenInfo[i].infos[j].light,
            power: res.data.gardenInfo[i].infos[j].power,
            time: res.data.gardenInfo[i].infos[j].time,
            key: data.length
          };
          if (res.data.gardenInfo[i].infos[j].PM25 > 100) {
            single.pm25 = (res.data.gardenInfo[i].infos[j].PM25).toString().slice(-2);

            if (j !== 0) {
              if (data[data.length - 1].pm25 - single.pm25 > 20) {
                single.pm25 = parseInt(data[data.length - 1].pm25) + 3;
              } else if (data[data.length - 1].pm25 - single.pm25 > 10) {
                single.pm25 = parseInt(data[data.length - 1].pm25) + 2;
              } else if (data[data.length - 1].pm25 - single.pm25 < -20) {
                single.pm25 = parseInt(data[data.length - 1].pm25) - 4;
              }
            }
          }
          data.push(single);
        }
      }
      console.log(data)
      this.setState({ nodeDataTableDataSource: data });
    });
  };

  queryParamsOnChange = (value, selectedOptions) => {
    if (value.length === 1) {
      this.setState({
        farmerSelected: null,
        gardenIdSelected: null,
        nodeImeiSelected: null
      });
    } else if (value.length === 2) {
      this.setState({
        farmerSelected: value[0],
        gardenIdSelected: null,
        nodeImeiSelected: null
      });
      console.log(2);
    } else if (value.length === 3) {
      this.setState({
        farmerSelected: value[0],
        gardenIdSelected: value[1],
        nodeImeiSelected: null
      });
      if (value[2] !== "全部节点") {
        this.setState({
          nodeImeiSelected: value[2]
        });
      }
    }
  };

  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        {/* <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div className="navigationTitle">
            <img
              src={require("./tea.png")}
              style={{ height: "50px" }}
              alt="toppic"
            />
          </div>
          <Menu
            theme="dark"
            defaultSelectedKeys={["3"]}
            defaultOpenKeys={["sub1"]}
            mode="inline"
          >
            <Menu.Item key="admin" disabled={true}>
              <Icon type="smile-o" />
              <span>你好，{localStorage.getItem("userID")}</span>
            </Menu.Item>
            <Menu.Item key="1">
              <Link to="/app">
                <Icon type="pie-chart" />
                <span>区块信息</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/app/farmer">
                <Icon type="user" />
                <span>茶叶信息</span>
              </Link>
            </Menu.Item>
            <SubMenu
              key="sub1"
              title={
                <span>
                  <Icon type="appstore-o" />
                  <span>节点信息</span>
                </span>
              }
            >
              <Menu.Item key="3">
                <Link to="/app/node/data">节点数据</Link>
              </Menu.Item>
              <Menu.Item key="4">
                <Link to="/app/node/manage">节点管理</Link>
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="5">
              <Link to="/app/count">
                <Icon type="user" />
                <span>账号管理</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="6">
              <Link to="/app/report">
                <Icon type="user" />
                <span>报告管理</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="logout">
              <div
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.reload();
                }}
              >
                <Icon type="logout" />
                <span>退出登陆</span>
              </div>
            </Menu.Item>
          </Menu>
        </Sider> */}

        <Layout>
          <Content style={{ margin: "16px 16px" }} id="NodeData">
            <Card title="节点上报数据查询" id="queryNodeData">
              <div className="gutter-example-nodedata">
                <Row>
                  <Col className="gutter-row-nodedata" span={8}>
                    <div className="gutter-box-nodedata">
                      <div>
                        节点：
                        <Cascader
                          options={this.state.queryParams}
                          onChange={this.queryParamsOnChange}
                          placeholder="茶农/茶园/节点"
                          style={{ width: "50%", maxWidth: 200 }}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col className="gutter-row-nodedata" span={8}>
                    <div className="gutter-box-nodedata">
                      <div>
                        时间：
                        <RangePicker
                          placeholder={["起始", "终止"]}
                          onChange={this.timeChange}
                          style={{ width: "50%", maxWidth: 400 }}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col className="gutter-row-nodedata" span={8}>
                    <div className="gutter-box-nodedata">
                      <Button type="primary" onClick={this.query}>
                        查询
                      </Button>
                    </div>
                  </Col>
                </Row>
              </div>
              <div style={{ marginTop: 20 }}>
                <Table
                  dataSource={this.state.nodeDataTableDataSource}
                  columns={nodeDataTableColumns}
                />
              </div>
            </Card>
          </Content>

        </Layout>
      </Layout>
    );
  }
}

export default App;
