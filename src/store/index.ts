import { createStore, Commit } from "vuex";
import api from "../utils/services";
import { ElMessage } from "element-plus";
import router from "../router";

interface UserProps {
  avatar?: string;
  nickName?: string;
  userKey: string;
}
interface ImgProps {
  src: string;
  scanSrc?: string;
  width?: number;
  height?: number;
}
export interface GlobalDataProps {
  error: GlobalErrorProps;
  token: string;
  user: UserProps;
  img: ImgProps;
  columns: string[];
  loading: boolean;
  uploadToken: string;
  deviceWidth: number;
  deviceInfo: string;
  report: string;
  reportId: string;
}
export interface GlobalErrorProps {
  status: boolean;
  message?: string;
}
const defaultState = {
  count: 0,
};

// Create a new store instance.
export default createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem("token") || "",
    uploadToken: "",
    loading: false,
    user: { userKey: "" },
    img: { src: "" },
    columns: [],
    deviceWidth: 0,
    deviceInfo: "",
    report: "",
    reportId: "",
  },
  mutations: {
    // increment(state: typeof defaultStattte) {
    //   state.count++;
    // },
    setDeviceWidth(
      state,
      deviceInfo: { deviceWidth: number; deviceName: string }
    ) {
      state.deviceWidth = deviceInfo.deviceWidth;
      if (deviceInfo.deviceWidth > 500) {
        state.deviceInfo = "computer";
        if (deviceInfo.deviceName) {
          state.deviceInfo = deviceInfo.deviceName;
        }
      } else {
        state.deviceInfo = "mobile";
      }
    },
    setImg(state, img: ImgProps) {
      state.img = img;
    },
    setReport(state, report: string) {
      state.report = report;
    },
    setReportId(state, reportId: string) {
      state.reportId = reportId;
      localStorage.setItem("reportId", reportId);
    },
    setLoading(state, status) {
      state.loading = status;
    },
    setError(state, e: GlobalErrorProps) {
      state.error = e;
    },
    setUploadToken(state, uploadToken: string) {
      state.uploadToken = uploadToken;
    },
    login(state, userInfo: { token: string; user: UserProps }) {
      state.token = userInfo.token;
      state.user = userInfo.user;

      localStorage.setItem("userKey", userInfo.user.userKey);
    },
  },
  actions: {
    setDeviceWidth(
      { commit },
      deviceInfo: { deviceWidth: number; deviceName: string }
    ) {
      return commit("setDeviceWidth", {
        deviceWidth: deviceInfo.deviceWidth,
        deviceName: deviceInfo.deviceName,
      });
    },
    setImg({ commit }, img: ImgProps) {
      return commit("setImg", img);
    },
    setReport({ commit }, report: string) {
      return commit("setReport", report);
    },
    setReportId({ commit }, reportId: string) {
      return commit("setReportId", reportId);
    },
    async setToken({ commit }, token: string) {
      if (token) {
        localStorage.setItem("token", token);
        const tokenRes: any = await api.request(
          "get",
          "https://baokudata.qingtime.cn/sgbh/account/userinfo",
          { token: token }
        );
        if (tokenRes.msg === "OK") {
          return commit("login", {
            token: token,
            user: {
              avatar: tokenRes.result.profile.avatar,
              nickName: tokenRes.result.profile.nickName,
              userKey: tokenRes.result._key,
            },
          });
        }
      }
    },
  },

  getters: {
    // double(state: typeof defaultState) {
    //   return 2 * state.count;
    // },
    getColumnById: (state) => (id: number) => {
      return "逻辑数据";
    },
  },
});
