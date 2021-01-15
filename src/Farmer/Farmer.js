import React from "react";
import {
  Table,
  Layout,
  Cascader,
  Card,
  Button
} from "antd";

import { getFarmerInfo, getTeaInfo } from "../axios";
import "./Farmer.css";

const { Content } = Layout;

const role =localStorage.getItem("role");
const userID =localStorage.getItem("userID");
const farmerInfoTableColumns = [
  {
    title: "茶农",
    dataIndex: "userID",
    key: "userID"
  },
  {
    title: "茶叶类型",
    dataIndex: "tea_type",
    key: "key"
  },
  {
    title: "茶园ID",
    dataIndex: "gardenID",
    key: "gardenID"
  },
  {
    title: "茶ID",
    dataIndex: "teaID",
    key: "teaID"
  },
  {
    title: "采摘",
    dataIndex: "pick",
    key: "pick"
  },
  {
    title: "炒制",
    dataIndex: "fry",
    key: "fry"
  },
  {
    title: "包装",
    dataIndex: "package",
    key: "package"
  },
  {
    title: "炒制师",
    dataIndex: "fry_man",
    key: "fry_man"
  }
];

class App extends React.Component {
  state = {
    collapsed: false,
    queryParams: [],
    farmerSelected: null,
    gardenIdSelected: null,
    teaIdSelected: null,
    farmerInfoTableDataSource: []
  };
  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  componentWillMount() {
    getFarmerInfo({
      role,
      userID
    }).then(res => {
      let user = [
        {
          value: "全部茶农",
          label: "全部茶农"
        }
      ];
      console.log(res);
      for (let i = 0; i < res.data.info.length; i++) {
        let garden = [
          {
            value: "全部茶园",
            label: "全部茶园"
          }
        ];
        for (let j = 0; j < res.data.info[i]["gardens"].length; j++) {
          let tea = [
            {
              value: "全部茶",
              label: "全部茶"
            }
          ];
          for (
            let k = 0;
            k < res.data.info[i]["gardens"][j]["teas"].length;
            k++
          ) {
            tea.push({
              value: res.data.info[i]["gardens"][j]["teas"][k],
              label: res.data.info[i]["gardens"][j]["teas"][k]
            });
          }
          garden.push({
            value: res.data.info[i]["gardens"][j]["gardenID"],
            label: res.data.info[i]["gardens"][j]["gardenID"],
            children: tea
          });
        }
        user.push({
          value: res.data.info[i]["userID"],
          label: res.data.info[i]["userID"],
          children: garden
        });
      }
      this.setState({ queryParams: user });
    });
  }

  query = () => {
    getTeaInfo(
      {role,
      userID:this.state.farmerSelected,
      gardenID:this.state.gardenIdSelected,
      teaID:this.state.teaIdSelected}
    ).then(res => {
      console.log(res)
      res.data.info.forEach((element, index) => {
        element.key = index;
      });
      this.setState({ farmerInfoTableDataSource: res.data.info });
    });
  };
  
  componentDidMount() {}



  queryParamsOnChange = (value, selectedOptions) => {
    if (value.length === 1) {
      this.setState({
        farmerSelected: null,
        gardenIdSelected: null,
        teaIdSelected: null
      });
    } else if (value.length === 2) {
      this.setState({
        farmerSelected: value[0],
        gardenIdSelected: null,
        teaIdSelected: null
      });
    } else if (value.length === 3) {
      this.setState({
        farmerSelected: value[0],
        gardenIdSelected: value[1],
        teaIdSelected: null
      });
      if (value[2] !== "全部茶") {
        this.setState({
          teaIdSelected: value[2]
        });
      }
    }
  };

  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>

        <Layout>
          <Content style={{ margin: "16px 16px" }} id="Farmer">
            <Card title="茶叶信息查询" id="queryFarmer">
              <div className="gutter-example-farmer">
                <Cascader
                
                  options={this.state.queryParams}
                  onChange={this.queryParamsOnChange}
                  placeholder="茶农/茶园/茶"
                  style={{ width: "50%", maxWidth: 200 }}
                />
                <Button
                  type="primary"
                  onClick={this.query}
                  style={{ marginLeft: 10 }}
                >
                  查询
                </Button>
              </div>
              <div style={{ marginTop: 20 }}>
                <Table
                  dataSource={this.state.farmerInfoTableDataSource}
                  columns={farmerInfoTableColumns}
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
