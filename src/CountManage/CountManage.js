import React from "react";
import {
  Layout,
  Table,
  Button,
  Card,
  Modal,
  Form, Icon, Input,
  Select,message,Popconfirm
} from "antd";
import "./Farmer.css";
import { getCount,addCount,deleteCount } from "../axios";
const { Content, Footer} = Layout;
const Option = Select.Option;


const role =localStorage.getItem("role");
const userID =localStorage.getItem("userID");
const FormItem = Form.Item;

class conutManage extends React.Component {
  state = {
    isFamer:"none",
    teaRequire:false,
    collapsed: false,
    add:false,
    dataSource : [],
    columns :[{
      title: '用户名',
      dataIndex: 'name',
    },
    {
      title:'用户ID',
      dataIndex:'userID'
    },
    {
      title:'密码',
      dataIndex:'password'
    },
    {
      title:'用户类型',
      dataIndex:'type'
    },
    {
      title:'orgName',
      dataIndex:'orgName'
    },
    {
      title:'描述',
      dataIndex:'description'
    },
    {
      title:'邮箱',
      dataIndex:'email'
    },
    {
      title: '操作',
      render: (text,record) => (
        <Popconfirm title="是否删除该账户" onConfirm={() => this.remove(record)}>
          <a href="javascript:void(0);">删除</a>
        </Popconfirm>
      ),
    }]
  };
  remove=(record)=>{
    deleteCount({
      role,
      userID,
      delete_userID:record.userID
    })
    .then(res=>{
      if(res.data.code===200){

        const dataSource = [...this.state.dataSource];
        this.setState({ dataSource: dataSource.filter(item => item.userID !== record.userID) });
      }
      
    })
  }
  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };
  getCountData=()=>{
    getCount({
      role,
      userID
    })
    .then(res=>{

      if(res.data.code===200){
        console.log(res,123)
        let list = res.data.info.map(val=>{
          return{
          "userID": val.userID,
          "name": val.name,
          "password": val.password,
          "type": val.type,
          "role": val.role,
          "orgName": val.orgName,
          "description": val.description,
          "email": val.email
          }
        })
        this.setState({dataSource:list})
      }
    })
  }
  componentWillMount() {
    this.getCountData()

    
  }

  componentDidMount() {}

  showaddCount=()=>{
    this.setState({
      add: true,
    });
  }


  addCountOk=(e)=>{
    
    this.addCountSubmit(e)

  }
  addCountCancel=()=>{
    this.setState({
      add: false,
    });
  }
  usertypeSelect=(val)=>{
    if(val==="farmer"){
      this.setState({
        teaRequire:true,
        isFamer:"block"
      })
    }else{
      this.setState({
        teaRequire:false,
        isFamer:"none"
      })
    }
  }
  addCountSubmit=()=>{

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values)
        addCount({
          role,
          userID,
          new_userID:values.userId,
          name:values.userName,
          password:values.pwd,
          new_role:values.userType, 
          description:values.desc,
          email:values.mail
        })
        .then(res=>{
          if(res.data.code===200){
            this.getCountData()
            message.info('添加成功');
            this.setState({
              add: false,
            });
          }
        })
      }
    });
  }
  // handleSubmit = (e) => {
  //   e.preventDefault();
  //   this.props.form.validateFields((err, values) => {
  //     if (!err) {
  //       console.log('Received values of form: ', values);
  //     }
  //   });
  // }

 

  render() {
    const { getFieldDecorator } = this.props.form
    
    return (
      <Layout style={{ minHeight: "100vh" }}>

        <Layout>
          <Content style={{ margin: "16px 16px" }} id="Farmer">
            <Card title="账号管理" id="queryFarmer">
            <Button type="primary" style={{ marginBottom:20}} onClick={this.showaddCount}>添加</Button>
            <Modal
              title="添加用户"
              visible={this.state.add}
              onOk={this.addCountOk}
              onCancel={this.addCountCancel}
            >
              <Form className="login-form" onSubmit={this.addCountOk}>
                <FormItem label="用户名" labelCol={{span: 5}} wrapperCol= {{ span:17}}>
                  {getFieldDecorator('userName', {
                    rules: [{ required: true, message: '请输入用户名' }],
                  })(
                    <Input  autoComplete="off" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
                  )}
                </FormItem>
                <FormItem  label="用户ID" labelCol={{span: 5}} wrapperCol= {{ span:17}}>
                  {getFieldDecorator('userId', {
                    rules: [{ required: true, message: '请输入用户ID' }],
                  })(
                    <Input autoComplete="off" prefix={<Icon type="credit-card" style={{ color: 'rgba(0,0,0,.25)' }} />}  placeholder="用户Id" />
                  )}
                </FormItem>
                <FormItem label="密码" labelCol={{span: 5}} wrapperCol= {{ span:17}}>
                  {getFieldDecorator('pwd', {
                    rules: [{ required: true, message: '请输入密码' }],
                  })(
                    <Input autoComplete="off" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}  placeholder="密码" />
                  )}
                </FormItem>
                <FormItem label="用户类型" labelCol={{span: 5}} wrapperCol= {{ span:17}}>
                  {getFieldDecorator('userType', {
                    rules: [{ required: true, message: '请选择用户类型' }],
                  })(
                    <Select  placeholder="选择用户类型" onChange={this.usertypeSelect}>
                      <Option value="admin">超级管理员</Option>
                      <Option value="regulator">监管</Option>
                      <Option value="inspector" >观察员</Option>
                      <Option value="farmer">茶农</Option>
                    </Select>
                  )}
                </FormItem>
                <FormItem label="茶叶种类" labelCol={{span: 5}} wrapperCol= {{ span:17}} style={{display:this.state.isFamer}}>
                {getFieldDecorator('teaType', {
                    rules: [{ required: this.state.teaRequire, message: '请输入茶叶类型' }],
                  })(
                  <Input autoComplete="off" prefix={<Icon type="appstore" style={{ color: 'rgba(0,0,0,.25)' }} />}  placeholder="绿茶/红茶" />
                  )}
                </FormItem>
                <FormItem label="orgName" labelCol={{span: 5}} wrapperCol= {{ span:17}}>
                  {getFieldDecorator('orgName', {
                    rules: [{ required: true, message: '请输入orgName' }],
                  })(
                    <Input autoComplete="off" prefix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }} />}  placeholder="orgName" />
                  )}
                </FormItem>
                <FormItem label="描述信息" labelCol={{span: 5}} wrapperCol= {{ span:17}}>
                {getFieldDecorator('desc', {
                    rules: [{ required: false, message: '请输入描述信息' }],
                  })(
                    <Input autoComplete="off" prefix={<Icon type="form" style={{ color: 'rgba(0,0,0,.25)' }} />}  placeholder="用户描述信息" />
                  )}
                  
                </FormItem>
                <FormItem label="邮箱" labelCol={{span: 5}} wrapperCol= {{ span:17}}>
                  {getFieldDecorator('mail', {
                    rules: [{ required: true, message: '请输入邮箱' }],
                  })(
                    <Input autoComplete="off" prefix={<Icon type="down-square" style={{ color: 'rgba(0,0,0,.25)' }} />}  placeholder="邮箱" />
                  )}
                </FormItem>
                
                <FormItem>
                </FormItem>
              </Form>
            </Modal>
            <Table rowKey={record=>record.userID} dataSource={this.state.dataSource} columns={this.state.columns} />
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


// ReactDOM.render(<WrappedNormalLoginForm />, mountNode);
export default Form.create()(conutManage);
