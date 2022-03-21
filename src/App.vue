<script setup lang="ts">
import { onMounted, ref, watchEffect, computed } from "vue";
import store from "./store";
import { useRouter } from "vue-router";
import { getSearchParamValue } from "./utils/util";
import faceSvg from "./assets/face.svg";
import closeSvg from "./assets/close.svg";
//defineProps,defineEmits
const router = useRouter();
const token = computed(() => store.state.token);
const deviceInfo = computed(() => store.state.deviceInfo);
const chatVisible = ref<boolean>(false);
onMounted(() => {
  let url = window.location.href;
  //自动切换为https
  if (url.indexOf("http://localhost") == -1 && url.indexOf("https") < 0) {
    url = url.replace("http:", "https:");
    window.location.replace(url);
  }
  if (document.documentElement.offsetWidth) {
    if (localStorage.getItem("device") === "touch") {
      store.dispatch("setDeviceWidth", {
        deviceWidth: document.documentElement.offsetWidth,
        deviceName: "touch",
      });
    } else {
      store.dispatch("setDeviceWidth", {
        deviceWidth: document.documentElement.offsetWidth,
        deviceName: "",
      });
    }
  }
  if (token.value) {
    console.log("token", token.value);
    store.dispatch("setToken", token.value);
    // router.push("/home");
  }
  console.log(token.value);
});
const changeChatState = () => {
  chatVisible.value = !chatVisible.value;
};
</script>

<template>
  <router-view></router-view>
  <div class="chat-button" v-if="deviceInfo !== 'mobile' && token">
    <img
      :src="faceSvg"
      alt=""
      @click="changeChatState"
      :style="{ width: '40px', height: '40px' }"
    />
  </div>
  <div
    v-show="chatVisible"
    class="chat-container"
    :style="{ width: '400px', height: '520px' }"
  >
    <iframe
      title=""
      :src="`https://agent.workfly.cn/?token=${token}&groupKey=2279578754&treeKey=2165231802&device=computer`"
      frameBorder="0"
    ></iframe>
    <img
      :src="closeSvg"
      alt=""
      class="chat-closeButton"
      @click="chatVisible = false"
    />
  </div>
</template>

<style lang="scss">
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
@media screen and (min-width: 375px) {
  body {
    line-height: 35px;
  }
}
// @media screen and (min-width: 414px) {
//   body {
//     line-height: 30px;
//   }
// }
// @media screen and (min-width: 768px) {
//   body {
//     line-height: 30px;
//   }
// }
@media screen and (min-width: 1024px) {
  body {
    line-height: 45px;
  }
}
#app,
body,
html {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  overflow-x: hidden;
  overflow-y: auto;
  font-family: "Microsoft YaHei", "黑体", "宋体", sans-serif;
}
*::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 10px;
}
*::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  background-color: #409eff;
  background-image: -webkit-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.2) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.2) 75%,
    transparent 75%,
    transparent
  );
}
*::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #ededed;
  border-radius: 10px;
}
.container {
  width: 100vw;
  height: calc(100vh - 50px);
  padding: 0px 10px;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
}
.face-button {
  width: 250px;
  height: 40px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  .img {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
}
.chat-button {
  position: fixed;
  left: 10px;
  bottom: 10px;
  z-index: 6;
  img {
    width: 40px;
    height: 40px;
  }
}
.chat-container {
  position: fixed;
  left: 10px;
  bottom: 48px;
  z-index: 5;
  .chat-closeButton {
    position: absolute;
    top: 20px;
    right: 10px;
  }
  iframe {
    width: 100%;
    height: 100%;
  }
}
.face-button-blue {
  background-image: url("@/assets/buttonbackblue.svg");
}
.face-button-red {
  background-image: url("@/assets/buttonbackred.svg");
}
.face-button-grey {
  background-image: url("@/assets/buttonbackgrey.svg");
}
.face-button-white {
  background-image: url("@/assets/buttonbackwhite.svg");
}
.el-dialog__body {
  padding: 10px !important;
  box-sizing: border-box !important;
}
.el-dialog__header {
  padding: 10px !important;
  box-sizing: border-box !important;
}
.el-dialog__title {
  font-size: 12px !important;
}
.el-input,
.el-input__inner,
.el-button {
  font-size: 12px !important;
  height: 30px !important;
  line-height: 30px !important;
  min-height: 30px !important;
}
.el-button {
  padding: 0px 10px !important;
  display: flex;
  align-items: center;
  justify-content: center;
}
.el-button span {
  font-size: 12px !important;
  height: 30px !important;
}
.el-message {
  height: 15px !important;
  font-size: 12px !important;
}
.uploadImg .el-dialog__header,
.uploadImg .el-dialog__body {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}
@keyframes changeHeight {
  0% {
    height: 0px;
  }

  100% {
    height: 280px;
  }

  /* 100% {
        height: 0px;
    } */
}
@keyframes changeImgHeight {
  0% {
    top: 0px;
  }

  100% {
    top: 5.4px;
  }

  /* 
    100% {
        top: 0px;
    } */
}
</style>
