<script setup lang="ts">
import {
  computed,
  onBeforeMount,
  onMounted,
  ref,
  watchEffect,
  watch,
} from "vue";
import store from "../../store";
import router from "../../router";
import { useRoute } from "vue-router";
import api from "../../utils/services";
import { ElMessage } from "element-plus";
import copy from "copy-to-clipboard";
import Avatar from "../../components/Avatar.vue";
import Qrcode from "../../components/qrcode/Qrcode.vue";
const route = useRoute();
//defineProps,defineEmits
const deviceInfo = computed(() => store.state.deviceInfo);
const user = computed(() => store.state.user);
const msgVisible = ref<boolean>(false);
const shareDialog = ref<boolean>(false);
const total = ref<number>(0);
const shareUrl = ref<string>(
  `${window.location.protocol}//${window.location.host}/home`
);

onBeforeMount(() => {
  if (!localStorage.getItem("token")) {
    ElMessage.error("请登录");
    router.push("/");
  }
  if (route.name === "touchHome") {
    store.dispatch("setDeviceWidth", {
      deviceWidth: document.documentElement.offsetWidth,
      deviceName: "touch",
    });
    localStorage.setItem("device", "touch");
  } else if (route.name === "home") {
    store.dispatch("setDeviceWidth", {
      deviceWidth: document.documentElement.offsetWidth,
      deviceName: "",
    });
    localStorage.setItem("device", "");
  }
});
onMounted(() => {
  if (user.value.userKey) {
    getHistory();
  }
});
watch(user, (newValue, oldValue) => {
  console.log(newValue);
  if (newValue.userKey) {
    getHistory();
  }
});

const getHistory = async () => {
  let res: any = await api.request("get", api.baseUrl + "userResultWeb", {
    userKey: localStorage.getItem("userKey"),
    page: 1,
    limit: 50,
  });
  if (res.msg === "OK") {
    total.value = res.totals;
  }
};
const shareHistory = async () => {
  copy(shareUrl.value);
  ElMessage.success("复制链接成功");
};

const toUrl = (path: string) => {
  router.push({ path: path });
};
</script>
<template>
  <div class="home-mobile" v-if="deviceInfo === 'mobile'">
    <div class="user-box" @click="toUrl('/history')">
      <Avatar
        :index="0"
        :size="24"
        :name="user.nickName"
        :avatar="user.avatar"
        :type="'person'"
      />
      <div class="title">
        {{ user.nickName }} 已创建
        <span :style="{ color: '#6990D6' }">{{ total }}</span> 份面相报告
      </div>
    </div>
    <div class="info-box">
      <div class="title">
        阴阳五行，化生万物。凡有所因，皆有其果。古人从面部特征推算时运，时光科技AI小组利用智能识别技术，根据传统典籍，让用户快速解读面相，洞悉健康状态，将传统文化发扬光大。
      </div>
      <div class="icon">
        <div class="icon-item" @click="msgVisible = true">
          <img src="../../assets/hometitle.svg" alt="" class="img" />
          <div class="title">理论简介</div>
        </div>
        <div class="icon-item" @click="shareDialog = true">
          <img src="../../assets/homeshare.svg" alt="" class="img" />
          <div class="title">分享</div>
        </div>
      </div>
      <div class="face-button face-button-blue" @click="toUrl('/uploadImg')">
        <img src="../../assets/facebutton.svg" alt="" class="img" />
        <div>面相探索</div>
      </div>
    </div>

    <!-- <el-dialog
      v-model="shareDialog"
      title="分享"
      center
      :width="deviceInfo !== 'mobile' ? '700px' : '350px'"
    >
      <div class="share-container">
        <div class="share-input">
          <el-input v-model="shareUrl" disabled style="width: 75%" />
          <el-button
            type="primary"
            plain
            style="width: '50px'"
            @click="shareHistory"
            >复制链接</el-button
          >
        </div>

        <div class="share-code">
          <Qrcode :url="shareUrl"></Qrcode>
          <div class="share-box">
            <div>用微信扫码</div>
            <div>即可在手机上分享给您的好友和朋友圈</div>
          </div>
        </div>
      </div>
    </el-dialog> -->
  </div>
  <div class="home-pc" v-else>
    <div class="header">面相探索</div>
    <div class="content">
      <div class="left">
        <video
          src="../../assets/homeback.mp4"
          autoplay
          muted
          loop
          :style="{ width: '100%', height: '80%', objectFit: 'fill' }"
        ></video>
      </div>
      <div class="right">
        <div class="info-box" :style="{ height: '80%' }">
          <div
            class="title"
            @click="deviceInfo !== 'touch' ? toUrl('/history') : ''"
            :style="deviceInfo !== 'touch' ? { cursor: 'pointer' } : ''"
          >
            已创建
            <span :style="{ color: '#6990D6' }">{{ total }}</span> 份面相报告
          </div>
          <div class="info-content">
            阴阳五行，化生万物。凡有所因，皆有其果。古人从面部特征推算时运，时光科技AI小组利用智能识别技术，根据传统典籍，让用户快速解读面相，洞悉健康状态，将传统文化发扬光大。
          </div>
          <div class="icon">
            <div class="icon-item" @click="msgVisible = true">
              <img src="../../assets/hometitle.svg" alt="" class="img" />
              <div class="icon-title">理论简介</div>
            </div>
            <div class="icon-item" @click="shareDialog = true">
              <img src="../../assets/homeshare.svg" alt="" class="img" />
              <div class="icon-title">分享</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="button">
      <div
        class="face-button face-button-blue face-home-button"
        @click="toUrl('/uploadImg')"
      >
        <img src="../../assets/facebutton.svg" alt="" class="img" />
        <div>面相探索</div>
      </div>
    </div>
  </div>
  <div class="home-dialog" v-if="msgVisible">
    <div
      class="dialog-box"
      :style="{ width: deviceInfo === 'mobile' ? '80vw' : '450px' }"
    >
      <img src="../../assets/dialogback.png" alt="" class="img" />
      <div
        class="title"
        :style="{ fontSize: deviceInfo === 'mobile' ? '18px' : '28px' }"
      >
        理论简介
      </div>
      <div
        class="content"
        :style="
          deviceInfo === 'mobile'
            ? { fontSize: '16px', lineHeight: '20px' }
            : { fontSize: '18px', lineHeight: '45px' }
        "
      >
        相学指的是根据长相、气质、音容笑貌来判断和预知一个人的过去和未来。一切事物都具有时空四维全息性，这是宇宙的法则，也是古人发现的天人合一，万物法一，其理同源。
        面相学构建在阴阳五行理论的基础之上，取法自然，也是几千年来大量前人对各种人体面部特征与人生运势走势之间关系的归纳总结和数理统计结果，也能从当代人体生理学、遗传学中找到立论依据。
      </div>
      <div class="footer">江苏时光信息科技有限公司</div>
      <div class="close-button" @click="msgVisible = false">
        <img src="../../assets/homeclose.svg" alt="" />
      </div>
    </div>
  </div>
  <div class="home-dialog" v-if="shareDialog">
    <div
      class="dialog-box"
      :style="{ width: deviceInfo === 'mobile' ? '80vw' : '450px' }"
    >
      <img src="../../assets/dialogback.png" alt="" class="img" />
      <div
        class="title"
        :style="{ fontSize: deviceInfo === 'mobile' ? '18px' : '28px' }"
      >
        分享面相探索
      </div>
      <div
        class="content"
        :style="
          deviceInfo === 'mobile'
            ? { fontSize: '14px', lineHeight: '20px' }
            : { fontSize: '18px', lineHeight: '45px' }
        "
      >
        <div>用微信扫码，即可把面相探索小应用</div>
        <div>分享给您的好友或朋友圈。</div>
        <div class="code"><Qrcode :url="shareUrl"></Qrcode></div>
      </div>
      <div class="footer">江苏时光信息科技有限公司</div>
      <div class="close-button" @click="shareDialog = false">
        <img src="../../assets/homeclose.svg" alt="" />
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.home-mobile {
  width: 100vw;
  height: 100vh;
  background-image: url("@/assets/homeback.jpg");
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: 160%;
  background-position-x: 30%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  align-content: flex-end;
  .user-box {
    width: 80vw;
    height: 50px;
    border-radius: 8px;
    box-shadow: 0px 0px 10px 0px rgba(73, 73, 73, 0.5);
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    background-image: url("@/assets/report-image.png");
    background-size: 120% 120%;
    background-position: 10% 10%;
    background-repeat: no-repeat;
    padding: 5px 15px 0px 15px;
    box-sizing: border-box;
    cursor: pointer;
    // background-attachment: fixed;
    .title {
      margin-left: 10px;
      font-size: 16px;
    }
  }
  .info-box {
    width: 80vw;
    height: 65vh;
    display: flex;
    justify-content: center;
    align-content: space-between;
    flex-wrap: wrap;
    position: relative;
    z-index: 1;
    border-radius: 8px;
    box-shadow: 0px 0px 10px 0px rgba(73, 73, 73, 0.5);
    background-color: #fff;
    padding: 20px 15px;
    box-sizing: border-box;
    margin-bottom: 30px;
    .title {
      width: 100%;
      // line-height: 30px;
      font-size: 16px;
    }
    .icon {
      width: 160px;
      // height:120px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #6990d6;
      font-size: 16px;
      margin-top: 15px;
      .icon-item {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        cursor: pointer;
        .img {
          &:nth-child(1) {
            height: 23px;
            width: 21px;
          }
          &:nth-child(2) {
            height: 20px;
            width: 20px;
          }
        }
        .title {
          width: 100%;
          text-align: center;
          margin-top: 10px;
        }
      }
    }
  }

  .share-container {
    font-size: 10px;
    .share-input {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
    }
    .share-code {
      display: flex;
    }
    .share-box {
      padding: 5px 0px;
      box-sizing: border-box;
      div {
        margin-bottom: 5px;
      }
    }
  }
  .save-container {
    .desc {
      width: 100%;
      color: #333;
      margin-bottom: 20px;
      .type {
        width: 100%;
        height: 45px;
        line-height: 45px;
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        .icon {
          height: 30px;
          width: 30px;
          margin-right: 20px;
          // margin-top: 10px;
        }
        .name {
          font-size: 30px;
        }
      }
      .desc-info {
        font-size: 12px;
      }
    }
    .save-footer {
      width: 100%;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
      .save-button {
        width: 80px;
        height: 25px;
        border-radius: 15px;
        background-color: #d7ddf1;
        color: #333;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
      }
    }
  }
}
.home-pc {
  width: 100vw;
  height: 100vh;
  .header {
    width: 100%;
    height: 65px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #6990d6;
    font-size: 28px;
  }
  .content {
    width: 100%;
    height: 80vh;
    display: flex;
    justify-content: space-between;
    padding: 0px 5vw;
    box-sizing: border-box;
    .left {
      width: 65%;
      height: 100%;
      display: flex;
      align-items: center;
      video {
        width: 100%;
        height: auto;
      }
    }
    .right {
      width: 30%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-content: center;
      flex-wrap: wrap;

      .info-box {
        width: 100%;
        // height: 65%;
        min-height: 350px;
        position: relative;
        z-index: 1;
        .title {
          width: 100%;
          line-height: 30px;
          font-size: 24px;
          margin-bottom: 30px;
        }
        .info-content {
          width: 100%;
          // line-height: 55px;
          font-size: 20px;
          color: #333333;
        }
        .icon {
          width: 100%;
          display: flex;
          align-items: center;
          color: #6990d6;
          font-size: 16px;
          position: absolute;
          z-index: 2;
          left: 0px;
          bottom: 20px;
          .icon-item {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            cursor: pointer;
            &:nth-child(1) {
              margin-right: 40px;
            }
            .img {
              &:nth-child(1) {
                height: 33px;
                width: 31px;
              }
              &:nth-child(2) {
                height: 30px;
                width: 30px;
              }
            }
            .icon-title {
              width: 100%;
              text-align: center;
              margin-top: 10px;
              font-size: 20px;
            }
          }
        }
      }
    }
  }
  .button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .img {
      width: 30px;
      height: 30px;
      margin-right: 20px;
    }
    .face-home-button {
      font-size: 20px;
      height: 60px;
    }
  }
}
.home-dialog {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  .dialog-box {
    height: 75vh;
    padding: 10px 25px;
    box-sizing: border-box;
    background-image: url("http://cdn-icare.qingtime.cn/1548815240826_home-background-info-image.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-attachment: fixed;
    position: relative;
    z-index: 1;

    .img {
      width: 108%;
      height: 16px;
      position: absolute;
      left: -4%;
      top: -8px;
      z-index: 2;
    }
    .title {
      width: 100%;
      height: 40px;
      text-align: center;
      line-height: 40px;
      margin-bottom: 20px;
      margin-top: 15px;
      font-size: 16px;
    }
    .content {
      color: #333333;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      .code {
        width: 100%;
        height: 300px;
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .footer {
      width: 100%;
      height: 30px;
      text-align: center;
      line-height: 30px;
      margin-top: 30px;
      font-size: 14px;
      color: #666;
      position: absolute;
      left: 0px;
      bottom: 15px;
    }
    .close-button {
      width: 100%;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      left: 0px;
      bottom: -50px;
      z-index: 15;
      img {
        width: 33px;
        height: 33px;
        cursor: pointer;
      }
    }
  }
}
</style>
