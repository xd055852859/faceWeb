import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "@/views/home/Home.vue";
import Login from "@/views/login/Login.vue";
// import Explain from "@/views/explain/Explain.vue";
// import AskHtml from "@/views/askHtml/AskHtml.vue";
// import FastGet from "@/views/fastGet/FastGet.vue";
// import Ask from "@/views/ask/Ask.vue";
// import AskAnswer from "@/views/askAnswer/AskAnswer.vue";
import Report from "@/views/report/Report.vue";
import ScanImg from "@/views/scanImg/ScanImg.vue";
import TakeImg from "@/views/takeImg/TakeImg.vue";
import UploadImg from "@/views/uploadImg/UploadImg.vue";
import History from "@/views/history/History.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/touchHome",
    name: "touchHome",
    component: Home,
  },
  {
    path: "/home",
    name: "home",
    component: Home,
  },
  {
    path: "/uploadImg",
    name: "uploadImg",
    component: UploadImg,
  },
  {
    path: "/takeImg",
    name: "takeImg",
    component: TakeImg,
  },
  {
    path: "/scanImg",
    name: "scanImg",
    component: ScanImg,
  },
  {
    path: "/report",
    name: "report",
    component: Report,
  },
  //   {
  //     path: "/askHtml",
  //     name: "askHtml",
  //     component: AskHtml,
  //   },
  //   {
  //     path: "/fastGet",
  //     name: "fastGet",
  //     component: FastGet,
  //   },
  //   {
  //     path: "/ask",
  //     name: "ask",
  //     component: Ask,
  //   },
  //   {
  //     path: "/history",
  //     name: "history",
  //     component: History,
  //   },
  //   {
  //     path: "/askAnswer",
  //     name: "askAnswer",
  //     component: AskAnswer,
  //   },
  //   {
  //     path: "/askMsg",
  //     name: "askMsg",
  //     component: AskMsg,
  //   },
  {
    path: "/history",
    name: "history",
    component: History,
  },
  {
    path: "/",
    name: "login",
    component: Login,
  },

  // {
  //   path: "/columnDetail/:id",
  //   name: "columnDetail",
  //   component: () => import("@/components/ColumnDetail.vue"), // 懒加载组件
  //   meta: { requiredLogin: true },
  // },
];
const routerHistory = createWebHistory();
const router = createRouter({
  history: routerHistory,
  routes,
});
//全局前置守卫
// router.beforeEach((to, from, next) => {
//   const { user, token } = store.state;
//   const { redirectAlreadyLogin, requiredLogin } = to.meta;
//   console.log(user);
//   console.log(token);
//   if (!user.isLogin) {
//     if (token) {
//       next("/");
//     } else {
//         next("login");
//     }
//     // } else if (redirectAlreadyLogin) {
//     //   next("/");
//   } else {
//     next();
//   }
// });
export default router;
