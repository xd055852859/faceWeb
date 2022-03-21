<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  ref,
  watchEffect,
} from "vue";
import api from "../../utils/services";
import store from "../../store";
import router from "../../router";
import { useRoute } from "vue-router";
import axios from "axios";
import GlobalHeader from "../../components/globalHeader/GlobalHeader.vue";
import { dataURLtoBlob, blobToFile } from "../../utils/util";
import moment from "moment";
const route = useRoute();
const deviceInfo = computed(() => store.state.deviceInfo);
//defineProps,defineEmits
const img = computed(() => store.state.img);
const phoneIndex = ref<number>(0);
const canvasRef = ref<any>(null);
const videoRef = ref<any>(null);
const dialogCamera = ref<boolean>(false);
const width = ref<number>(0);
const height = ref<number>(0);
const time = ref<number>(3);
const timeoutRef = ref<any>(null);
const intervalRef = ref<any>(null);
onMounted(() => {
  if (route.params.type === "takePhone") {
    callCamera();
  }
  width.value = document.documentElement.offsetWidth;
  height.value = document.documentElement.offsetHeight;
  console.log(width.value, height.value);
});
onBeforeUnmount(() => {
  clearInterval(intervalRef.value);
  intervalRef.value = null;
  clearTimeout(timeoutRef.value);
  timeoutRef.value = null;
  if (videoRef.value) {
    closeCamera();
  }
});
const getImage = (e: any) => {
  uploadImg(e.target.files[0]);
};
const callCamera = () => {
  phoneIndex.value = 0;
  // H5调用电脑摄像头API
  navigator.mediaDevices
    .getUserMedia({
      video: true,
    })
    .then((success) => {
      // 摄像头开启成功
      console.log();
      videoRef.value.srcObject = success;
      // 实时拍照效果
      videoRef.value.play();
      photograph();
    })
    .catch((error) => {
      console.log(error);
      console.error("摄像头开启失败，请检查摄像头是否可用！");
    });
};
// 拍照
const photograph = () => {
  intervalRef.value = setInterval(() => {
    time.value = time.value - 1;
    if (time.value === 0) {
      clearInterval(intervalRef.value);
      intervalRef.value = null;
    }
  }, 1000);
  timeoutRef.value = setTimeout(() => {
    phoneIndex.value = 1;
    let ctx = canvasRef.value.getContext("2d");
    // 把当前视频帧内容渲染到canvas上
    ctx.drawImage(
      videoRef.value,
      width.value * 0.06,
      -10,
      width.value * 0.94 - 10,
      height.value + 120
    );
    // 转base64格式、图片格式转换、图片质量压缩
    let imgBase64 = canvasRef.value.toDataURL("image/jpeg", 1);
    let blob = dataURLtoBlob(imgBase64);
    let file = blobToFile(
      blob,
      "face" + localStorage.getItem("userKey") + "_" + moment().valueOf()
    );
    uploadImg(file);
  }, 3000);

  // // 由字节转换为KB 判断大小
  // let str = imgBase64.replace("data:image/jpeg;base64,", "");
  // let strLength = str.length;
  // let fileLength = parseInt(strLength - (strLength / 8) * 2 + "");
  // // 图片尺寸  用于判断
  // let size = (fileLength / 1024).toFixed(2);
  // console.log(size);
  // // 上传拍照信息  调用接口上传图片 .........
  // // 保存到本地
  // dialogCamera.value = false;
};
const closeCamera = () => {
  if (!videoRef.value.srcObject) {
    dialogCamera.value = false;
    return;
  }
  let stream = videoRef.value.srcObject;
  let tracks = stream.getTracks();
  tracks.forEach((track) => {
    track.stop();
  });
  videoRef.value.srcObject = null;
};
const uploadImg = (file: any) => {
  let formData = new FormData();
  formData.append("file", file);
  let config = {
    headers: { "Content-Type": "multipart/form-data" },
  };
  axios
    .post(api.baseUrl + "upload/picture", formData, config)
    .then(async (res: any) => {
      console.log(res);
      if (res.data && res.data.msg === "OK") {
        let img = new Image();
        img.src =
          "https://face2.qingtime.cn/" +
          res.data.picPath
            .replace(/\\/g, "/")
            .replace("/home/work/service/face_node/public/", "");
        console.log("图片地址", img.src);
        img.onload = async function () {
          store.dispatch("setImg", {
            src: img.src,
            scanSrc: res.data.picPath,
            width: img.width,
            height: img.height,
          });
          // toScan();
        };
      }
    });
};
const toScan = () => {
  console.log(111);
  router.push({ name: "scanImg" });
};
</script>
<template>
  <GlobalHeader
    :headerTitle="
      route.params.type === 'choosePhone'
        ? '上传完成'
        : route.params.type === 'takePhone'
        ? time === 0
          ? '拍照完成'
          : ''
        : '上传照片'
    "
  >
    拍照中<span class="header-time">{{ time }}</span></GlobalHeader
  >
  <div class="box" v-if="route.params.type === 'choosePhone'">
    <img
      :src="img.src"
      alt=""
      :style="deviceInfo === 'mobile' ? { width: '80%' } : {}"
    />
  </div>
  <div class="box" v-else>
    <canvas
      ref="canvasRef"
      :width="width"
      :height="height + 50"
      v-show="phoneIndex === 1"
    ></canvas
    >            
    <video
      ref="videoRef"
      :width="width"
      autoplay
      v-show="phoneIndex === 0"
      :style="{ width: '100%', height: height + 100, objectFit: 'fill' }"
    ></video>
           
  </div>
  <div class="button">
    <div
      class="face-button face-button-red upload-button"
      v-if="route.params.type === 'choosePhone' || !route.params.type"
      :style="
        deviceInfo === 'mobile'
          ? { width: '250px', height: '50px' }
          : { width: '300px', height: '60px' }
      "
    >
      <label class="upButton">
        {{ route.params.type === "choosePhone" ? "重新选一张" : "选择照片" }}
        <input
          type="file"
          accept="image/*"
          @change="
            (files) => {
              getImage(files);
            }
          "
        />
      </label>
    </div>
    <div
      class="face-button face-button-red upload-button"
      v-if="route.params.type === 'takePhone'"
      @click="
        time = 4;
        phoneIndex = 0;
        photograph();
      "
      :style="{ width: '300px', height: '60px' }"
    >
      重新拍照
    </div>
    <div
      class="face-button face-button-blue upload-button"
      @click="toScan()"
      :style="
        deviceInfo === 'mobile'
          ? { width: '250px', height: '50px' }
          : { width: '300px', height: '60px' }
      "
    >
      开始探索
    </div>
  </div>
</template>
<style scoped lang="scss">
.header-time {
  width: 45px;
  height: 45px;
  line-height: 45px;
  text-align: center;
  border-radius: 50%;
  overflow: hidden;
  background-color: #6990d6;
  color: #fff;
  font-size: 24px;
  margin-left: 8px;
}
.box {
  width: 100%;
  height: calc(100vh - 55px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  z-index: 1;
  img{
    width:100%;
    height:100%;
    object-fit: contain;
  }
}
.button {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 10;
  left: 0px;
  bottom: 40px;
  .upButton {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    input {
      display: none;
      position: absolute;
      top: 0px;
      left: 0px;
      right: 0px;
      bottom: 0px;
      z-index: 2;
    }
  }
}
</style>
