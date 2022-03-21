<script setup lang="ts">
import { onMounted, ref, watchEffect, computed } from "vue";
import router from "../../router";
import store from "../../store";
import { getSearchParamValue } from "../../utils/util";
const deviceInfo = computed(() => store.state.deviceInfo);
//defineProps,defineEmits

onMounted(() => {
  if (getSearchParamValue(window.location.search, "token")) {
    store.dispatch(
      "setToken",
      getSearchParamValue(window.location.search, "token")
    );
    router.push({ path: "/home" });
  }
});
const toLogin = () => {
  if (localStorage.getItem("token")) {
    store.dispatch("setToken", localStorage.getItem("token"));
    if (deviceInfo.value === "touch") {
      router.push({ path: "/touchHome" });
    } else {
      router.push({ path: "/home" });
    }
  } else {
    let redirect = `${window.location.protocol}//${window.location.host}/`;
    let href: string = `https://account.qingtime.cn?apphigh=32&redirect=${redirect}&logo=https://faceview.qingtime.cn/images/icon.png`;
    window.location.href = href;
  }
};
</script>
<template>
  <div
    class="login-mobile-container"
    :style="
      deviceInfo !== 'mobile'
        ? { backgroundSize: '50% 100%', alignItems: 'center' }
        : {
            backgroundSize: '100% 50%',
            alignItems: 'flex-end',
          }
    "
    v-if="deviceInfo === 'mobile'"
  >
    <!-- <img src="../../assets/yijing.svg" alt="" class="login-img" /> -->
    <div class="login-box">
      <img src="../../assets/facefont.svg" alt="" class="login-img" />
      <div class="face-button face-button-blue button" @click="toLogin()">
        <img src="../../assets/facebutton.svg" alt="" class="img" />
        <div>开始探索</div>
      </div>
    </div>
    <!-- <el-button type="primary" @click="toLogin()">登录</el-button> -->
  </div>
  <div v-else class="login-pc-container">
    <div class="left">
      <img src="../../assets/faceloginImg.jpg" alt="" class="img" />
    </div>
    <div class="right">
      <div class="login-box">
        <img src="../../assets/facebackImg.svg" alt="" class="img" />
        <div class="face-button face-button-blue button" @click="toLogin()">
          开始
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.login-mobile-container {
  width: 100%;
  height: 100%;
  background-image: url("@/assets/faceback.png");
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: right top;
  display: flex;
  position: relative;
  z-index: 1;
  .login-box {
    width: 100%;
    height: 350px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 10px;
    position: absolute;
    bottom: 20px;
    .login-img {
      width: 80%;
    }
    .button {
      margin-top: 10px;
      // background-image:url('@/assets/buttonbackblue.svg')
    }
  }
}
.login-pc-container {
  width: 100%;
  height: 100%;
  // background-image: url("@/assets/facebackpc.jpg");
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: 100%;
  display: flex;
  .left {
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background-color: #081a6a;
    .img {
      max-width: 100%;
      object-fit: cover;
    }
  }
  .right {
    width: 50%;
    height: 100%;
    display: flex;
    justify-content: center;
    .login-box {
      width: 50%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-content: space-between;
      flex-wrap: wrap;
      img {
        height: 70vh;
      }

      .button {
        width: 100%;
        height: 80px;
        margin-bottom: 7vh;
        background-size: 100% 100%;
        font-size: 28px;
      }
    }
  }
}
</style>
