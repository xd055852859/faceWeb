import Axios from "axios";
import store from "../store";
//es
import qs from "qs";
import { ElMessage } from "element-plus";
import router from "../router";

const authUrl = "https://baokudata.qingtime.cn/sgbh";
const baseUrl = "https://facedata.qingtime.cn/";
const APIURL = "https://facedata.qingtime.cn/";
const axios = Axios.create({
  baseURL: baseUrl,
  timeout: 20000, // 请求超时 20s
});
let reqNum = 0;
// 前置拦截器（发起请求之前的拦截）
axios.interceptors.request.use(
  (config: any) => {
    /**
     * 根据你的项目实际情况来对 config 做处理
     * 这里对 config 不做任何处理，直接返回
     */
    store.commit("setLoading", true);
    console.log("store.state.token", store.state.token);
    const token:string = localStorage.getItem('token')
    if (config.url !== "https://baokudata.qingtime.cn/sgbh/account/userinfo") {
      if (!token) {
        ElMessage.error("请登录");
        router.push({ name: "login" });
        return;
      }
      console.log(config.method);
      if (config.method === "get") {
        if (!config.params.token) {
          config.params.token = token;
          // config.params = qs.stringify({
          //   ...config.params,
          // });
        }
      } else {
        let data = qs.parse(config.params);
        console.log(data);
        if (!data.token) {
          data.token = token;
          config.data = {
            ...data,
          };
        }
      }
    }
    console.log(config);
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// 后置拦截器（获取到响应时的拦截）

axios.interceptors.response.use(
  (response: any) => {
    /**
     * 根据你的项目实际情况来对 response 和 error 做处理
     * 这里对 response 和 error 不做任何处理，直接返回
     */
    // if(response)
    console.log(response.data);
    if (response.data.statusCode === "701") {
      localStorage.clear();
      ElMessage.error("请登录");
      router.push({ path: "/" });
    } else if (response.data.statusCode === "201") {
      ElMessage.error(response.data.msg);
    } else if (response.data.errorMessage) {
      ElMessage.error(response.data.errorMessage);
    }
    return response;
  },
  (e: any) => {
    store.commit("setLoading", false);
    const error = e.response.data;
    // store.commit("setError", { status: true, message: error });
    if (error.response && error.response.data) {
      const code = error.response.status;
      const msg = error.response.data.message;
      ElMessage.error(`Code: ${code}, Message: ${msg}`);
      console.error(`[Axios Error]`, error.response);
    } else {
      ElMessage.error(`${error}`);
    }
    return Promise.reject(error);
  }
);

const request = (
  method: any,
  path: string,
  params?: object,
  config?: object
) => {
  return new Promise(async function (resolve, reject) {
    try {
      const response = await axios({
        method: method,
        url: path,
        params: params,
        headers: { ...config },
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};
export default { request, authUrl, baseUrl };
