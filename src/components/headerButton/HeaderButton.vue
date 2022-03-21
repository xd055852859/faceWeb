<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from "vue";
import router from "../../router";
import store from "../../store/index";
import { ElMessage } from "element-plus";
import api from "../../utils/services";
import QRCode from "../../components/qrcode/Qrcode.vue";
import copy from "copy-to-clipboard";
import moment from "moment";

const deviceInfo = computed(() => store.state.deviceInfo);
const reportId = computed(() => store.state.reportId);
//defineProps,defineEmits
const changeObj = ref<any>({});
const subject = ref<string>("");
const saveDialog = ref<boolean>(false);
const shareUrl = ref<string>("");
const shareId = ref<string>("");
const shareDialog = ref<boolean>(false);

watchEffect(() => {
  let redirect = `${window.location.protocol}//${window.location.host}/`;
  shareUrl.value = redirect + "report?reportId=" + reportId.value;
});
const shareHistory = async () => {
  console.log(copy);
  copy(shareUrl.value);
  ElMessage.success("复制链接成功");
};
const toUrl = (name: string) => {
  router.push({ name: name });
};
</script>
<template>
  <div class="header-icon">
    <div class="header-icon-item" @click="shareDialog = true">
      <div class="header-icon-img">
        <img src="../../assets/button1.svg" alt="" />
      </div>
      <div class="header-icon-title">分享</div>
    </div>
    <div class="header-icon-item" @click="toUrl('uploadImg')">
      <div class="header-icon-img">
        <img src="../../assets/button2.svg" alt="" />
      </div>
      <div class="header-icon-title">再玩一次</div>
    </div>
    <div class="header-icon-item" @click="toUrl('home')">
      <div class="header-icon-img">
        <img src="../../assets/button3.svg" alt="" />
      </div>
      <div class="header-icon-title">返回首页</div>
    </div>
  </div>

  <el-dialog
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
        <q-r-code :url="shareUrl"></q-r-code>
        <div class="share-box">
          <div>用微信扫码</div>
          <div>即可在手机上分享给您的好友和朋友圈</div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<style scoped lang="scss">
.header-icon {
  width: 80px;
  position: fixed;
  top: 40px;
  right: 10px;
  z-index: 5;
  font-size: 12px;
  color: #333;

  .header-icon-item {
    width: 100%;
    height: 60px;
    margin-bottom: 10px;
    cursor: pointer;
    .header-icon-img {
      width: 100%;
      height: 35px;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 35px;
        height: 35px;
      }
    }
    .header-icon-title {
      width: 100%;
      height: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top:5px;
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
</style>
