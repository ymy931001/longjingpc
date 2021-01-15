import React, { Component } from 'react';
import { } from 'antd';
import './App.css';
import {
  Layout,
  Menu,
  Icon,
  // Card,
} from "antd";
import { Route, Switch,Link } from 'react-router-dom';
import BlockChain from "./BlockChain/BlockChain";
import Farmer from "./Farmer/Farmer";
import NodeData from "./NodeData/NodeData";
import NodeManage from "./NodeManage/NodeManage";
import ReportManage from "./ReportManage/ReportManage";
import CountManage from "./CountManage/CountManage";
import qrcode from './qr.jpg'
const { Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;


const role =localStorage.getItem("role");
const userID =localStorage.getItem("userID");
const title = localStorage.getItem('title')



export default class App extends Component {
  componentDidMount=()=>{
    document.title = title||''+"溯源项目-数据管理平台";
  }
  render() {
    return (

            <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          // collapsed={this.state.collapsed}
          // onCollapse={this.onCollapse}
        >
          <div className="navigationTitle">
            <img
              src={require("./tea.png")}
              style={{ height: "50px" }}
              alt="toppic"
            />
          </div>
          <Menu theme="dark"  mode="inline">
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
                <Icon type="tags" theme="filled" />
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
              <Menu.Item key="4" style={{display:(role==11&&"none")||(role==12&&"none")||(role==13&&"none")||"block"}}>
                <Link to="/app/node/manage">节点管理</Link>
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="5" style={{display:(role==10&&"block")||"none"}}>
              <Link to="/app/count">
                <Icon type="user" />
                <span>账号管理</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="6" style={{display:(role==12&&"none")||"block"}}>
              <Link to="/app/report">
                <Icon type="copy" theme="outlined" />
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
          <div>
              <img src={qrcode} style={{position: 'absolute', width: '90%', bottom: '15%', right: '5%'}}/>
            </div>
        </Sider>

        <Layout >
          <Content  id="Farmer">
            <Switch>
              <Route exact path='/app' component={BlockChain} />
              <Route path="/app/farmer" component={Farmer} />
              <Route path="/app/node/data" component={NodeData}  />
              <Route path="/app/node/manage" component={NodeManage} />
              <Route path="/app/count" component={CountManage} />
              <Route path="/app/report" component={ReportManage} />
            </Switch>
          </Content>
          {/* <Footer style={{ textAlign: "center" }}>
            longjing ©2018 Created by terabits
          </Footer> */}
        </Layout>
      </Layout>


      
    )
  }
}