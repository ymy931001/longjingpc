import React, { Component } from "react";
import { Button, Input, message, Row, Icon,Tabs,Card } from "antd";
import { login,getplatformStyle } from "../axios";
import "./SignIn.css";

export default class SignIn extends Component {
  state = {
    userID: "",
    password: "",
    userType:"management",
    picPosition:{
      backgroundPosition:"10%  10%"
    },
    signTitle:'龙井茶叶',
    signBackground:"http://lg.terabits.cn/bac.jpg",
    signLogo:'http://lg.terabits.cn/toppic.png',
    platformUrl:null,
  };
  
  callback=(key)=> {
    
    this.setState({
      userType : key
      
    })
  }
  componentWillMount= () =>{
    let url=window.location.href.split('?')
      if(url[1]){
        getplatformStyle(url[1])
        .then(res=>{
          if(res.data.code==200){
            this.setState({
              signTitle:res.data.content.mp_title,
              signBackground:res.data.content.mp_background,
              signLogo:res.data.content.mp_logo,
              platformUrl:url[1]
            })
            document.title = "登录-"+res.data.content.mp_title+"溯源项目-数据管理平台";
            
            localStorage.setItem('title',res.data.content.mp_title)
          }
        })
      }
    
  };

  login = () => {
    // console.log(this.state.userID + this.state.password + this.state.userType,111);
    if(!this.state.userID){
      message.error("请输入用户名");
      return;
    }
    if(!this.state.password){
      message.error("请输入密码");
      return;
    }
    login([this.state.userID, this.state.password,this.state.userType]).then(res => {
      if (res.data.success) {
        message.success("登陆成功");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userID", this.state.userID);
        localStorage.setItem("role", res.data.role);
        if(this.state.platformUrl!==null){
          localStorage.setItem("platform", this.state.platformUrl)
        }
        setTimeout(function () {
          window.location.href = "/app";
        }, 1000);
      } else {
        message.error("用户名或密码错误");
      }
    });
   
  }
  componentDidMount = () => {
    console.log(this.state.signBackground)
};

render() {
  const TabPane = Tabs.TabPane;
  return (

    <div>
      <div style={{display:"flex",flexDirection:'column'}}>
        <div className="SignIn-body" style={{background:"url("+this.state.signBackground+") ",}} >
          <div className="cover">
          <Row type="flex" justify="start">
            <img
              src={this.state.signLogo}
              style={{ height: "300px", marginTop: "5%", marginBottom: "2%",marginLeft:"20%" }}
              alt="toppic"
            />
          </Row>
          <Row type="flex" justify="center">
            <Card
            className="loadpart"
            title={this.state.signTitle+"溯源项目-数据管理平台"} 
          >
            
              <Row type="flex" justify="center">
                <Input
                  size="large"
                  className="SignIn-Input"
                  placeholder="请输入用户名"
                  prefix={<Icon type="user" />}
                  onChange={e => this.setState({ userID: e.target.value })}
                  value={this.state.userID}
                />
              </Row>
              <Row type="flex" justify="center">
                <Input
                  size="large"
                  className="SignIn-Input"
                  placeholder="请输入密码"
                  prefix={<Icon type="lock" />}
                  type="password"
                  onChange={e => this.setState({ password: e.target.value })}
                  value={this.state.password}
                />
              </Row>
              <Row type="flex" justify="center">
                    <Button
                      className="SignIn-requestbutton"
                      onClick={() => {
                        this.login();
                      }}
                    >
                      登录
                      </Button>
              </Row>
            
            
          </Card>
            

          </Row>
            
          </div>
          
        </div>
        
        <Row type="flex" justify="center" style={{paddingTop:'2%',background:"#fff",height:"10vh"}}>
              {this.state.signTitle} ©2018 Created by terabits
        </Row>
      </div>
    </div>
    
  );
}
}
