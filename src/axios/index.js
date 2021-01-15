import http from "./tools";
import * as config from "./config";

//消费者获取数据端口
export const getInfoForConumer = params =>
  http.getcon(config.requestIp + "/users/teaInfo/get?teaID=" + params[0], {});

//登录
export const login = params =>
  http.post(config.requestIp + "/users/login", {
    userID: params[0],
    password: params[1],
    type: params[2]
  });

//获取区块页面总体数据
export const getBlockTotalNumber = () =>
  http.getcon(config.requestIp2 + "/api/status/mychannel", {});

//获取24小时交易信息
export const getTransactionData = (params) =>
  http.getcon(config.requestIp2 + "/api/blocksByHour/mychannel/:" + params);

//获取24小时区块信息
export const getBlockData = () =>
  http.getcon(config.requestIp2 + "/api/txByHour/mychannel/1", {});

//获取区块信息
export const getBlockInfo = params =>
  http.getcon(
    config.requestIp2 + "/api/blockAndTxList/mychannel/0/" + params[0] + "/" + params[1],
    {}
  );

//获取交易信息
export const getTransactionInfo = params =>
  http.getcon(
    config.requestIp2 +
    "/api/txList/mychannel/0/0/" +
    params[0] +
    "/" +
    params[1],
    {}
  );

//获取茶农信息
export const getFarmerInfo = params =>
  http.post(config.requestIp + "/management/getFarmerList", params);

//获取茶信息
export const getTeaInfo = params =>
  http.post(config.requestIp + "/management/tea/info", params);

//获取节点
export const getAllNode = params =>
  http.post(config.requestIp + "/management/getImeiList", params);

//获取节点上报数据
export const getNodeData = params =>
  http.post(config.requestIp + "/management/nodeData", params);

//获取节点信息
export const getAllNodeInfo = params =>
  http.post(config.requestIp + "/management/nodeInfo", params);

//添加节点
export const addNode = params =>
  http.post(config.requestIp + "/management/CreateDevice", {
    imei: params[0],
    imsi: params[1],
    gardenID: params[2],
    longitude: params[3],
    latitude: params[4],
    frequency: params[5],
    role: params[6],
    userID: params[7],
    name: params[8]
  });

//删除节点
export const deleteNode = params =>
  http.post(config.requestIp + "/management/DeleteDevice", {
    imei: params[0],
    role: params[1],
    userID: params[2]
  });

//修改上报频率
export const changeFrequency = params =>
  http.post(config.requestIp + "/management/modifyFrequency", {
    imei: params[0],
    frequency: params[1],
    role: params[2],
    userID: params[3]
    ,
  });

//修改ip地址
export const changeIp = params =>
  http.post(config.requestIp + "/management/modifyIP", {
    ip: params[0],
    role: params[1],
    userID: params[2]
  });
//获取报告信息
export const getReport = params =>
  http.post(config.requestIp + "/management/getReportInfo", params)
//获取账户信息
export const getCount = params =>
  http.post(config.requestIp + "/management/userInfo", params)

//添加用户
export const addCount = params =>
  http.post(config.requestIp + "/management/addUser", params)
//删除用户
export const deleteCount = params =>
  http.post(config.requestIp + "/management/deleteUser", params)
//上传文件
export const uploadReport = params =>
  http.postpic(config.requestIp + "/management/uploadReport", params)
//获取茶园信息无token
export const getGardenTotal = () =>
  http.getcon(config.requestIp + "/management/getGardensTote")
//获取茶农视频地址
export const getfarmerVideo = params =>
  http.post(config.requestIp + "/management/getVideoAddress", params)

export const getplatformStyle = params =>
  http.get(config.requestIp + "/users/getPlatformStyle?" + params) 