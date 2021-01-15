import axios from "axios";
import qs from "qs";
import { message } from "antd";

axios.interceptors.request.use(
  config => {
    // 发送请求之前做什么
    //如果有token给所有的headers加入token参数
    if (config.method === "post") {
      if (localStorage.getItem("token") && localStorage.getItem("userID")) {

        config.headers.authorization = `Bearer ${localStorage.getItem(
          "token"
        )}`;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error.response);
  }
);

function checkStatus(response) {
  // 如果http状态码正常，则直接返回数据
  if (response && response.status === 200 && response.data.code === 200) {
    return response;
  } else if (
    response &&
    response.status === 200 &&
    response.data.code === 401
  ) {
    //token过期或不合法,跳转登录
    //清除token缓存
    localStorage.removeItem("token");
    message.error("会话已过期，请重新登陆");
    setTimeout(function () {
      window.location.href = "/";
    }, 500);
  } else {
    message.error("网络异常");
    // 异常状态下，把错误信息返回去
    return {
      status: -404,
      msg: "网络异常"
    };
  }
}

export default {
  post(url, data, adata) {
    return axios({
      method: "post",
      url,
      data: qs.stringify(data),
      timeout: 50000,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      }
    }).then(response => {
      return checkStatus(response);
    });
  },
  postpic(url, data) {
    return axios({
      method: "post",
      url,
      data: data,
      timeout: 50000,
      processData: false,
      contentType: false,
      async: false,
      headers: {
        "Content-Type": "multipart/form-data; charset=UTF-8"
      }
    }).then(response => {
      return checkStatus(response);
    });
  },
  get(url, data, adata) {
    return axios({
      method: "get",
      url,
      timeout: 50000,
      data: qs.stringify(data),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      }
    }).then(response => {
      return checkStatus(response);
    });
  },
  getcon(url, data, adata) {
    return axios({
      method: "get",
      url,
      data: qs.stringify(data),
      timeout: 50000
    }).then(response => {
      return response;
    });
  }
};
