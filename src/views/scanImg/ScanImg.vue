<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from "vue";
import { ElMessage } from "element-plus";
import api from "../../utils/services";
import store from "../../store";
import router from "../../router";
import GlobalHeader from "../../components/globalHeader/GlobalHeader.vue";
//defineProps,defineEmits
const img = computed(() => store.state.img);
const deviceInfo = computed(() => store.state.deviceInfo);
const scanState = ref<boolean>(false);
const topProgress = ref<number>(0);
const centerProgress = ref<number>(0);
const bottomProgress = ref<number>(0);
const topStatus = ref<string>("");
const centerStatus = ref<string>("");
const bottomStatus = ref<string>("");
const timer = ref<any>(0);
onMounted(() => {
  if (img.value.scanSrc) {
    loadScanImg();
    loadProcess();
  } else {
    router.push({ path: "/uploadImg" });
  }
});
const loadScanImg = async () => {
  let res: any = await api.request("get", api.baseUrl + "readFaceWeb", {
    picPath: img.value.scanSrc,
    picHeight: img.value.height,
    picWidth: img.value.width,
    userKey: localStorage.getItem("userKey"),
  });
  if (res.msg === "OK") {
    scanState.value = true;
    store.dispatch("setImg", {
      src: res.picPath,
      scanSrc: img.value.scanSrc,
      width: img.value.width,
      height: img.value.height,
    });
    store.dispatch("setReport", res.data);
    store.dispatch("setReportId", res.id);
    // router.push({ path: "/report" });
  } else {
    ElMessage.error(res.msg);
    router.push({ path: "/uploadImg" });
  }
};
const loadProcess = () => {
  timer.value = setInterval(function () {
    if (topProgress.value < 100) {
      topProgress.value++;
    } else if (topProgress.value === 100) {
      topStatus.value = "success";
      if (centerProgress.value < 100) {
        centerProgress.value++;
      } else if (centerProgress.value === 100) {
        centerStatus.value = "success";
        if (bottomProgress.value < 100) {
          bottomProgress.value++;
        } else if (bottomProgress.value === 100) {
          bottomStatus.value = "success";
          clearInterval(timer.value);
          timer.value = null;
        }
      }
    }
  }, 15);
};
const toReport = () => {
  router.push({ path: "/report" });
};
</script>
<template>
  <GlobalHeader headerTitle="拍照/上传照片" />
  <div class="scanImg container">
    <div
      class="scanImg-container"
      :style="deviceInfo !== 'mobile' ? { display: 'flex' } : {}"
    >
      <div
        class="box"
        :style="
          deviceInfo !== 'mobile'
            ? { width: '50%', height: '100%' }
            : { width: '100%', height: '50%' }
        "
      >
        <div class="img">
          <div class="line" v-if="!scanState"></div>
          <div class="table" v-if="!scanState"></div>
          <img :src="img.src" alt="" />
          <!-- <img className="scanLine" :src="'../../assets/scanLine.png'" alt="" /> -->
        </div>
      </div>
      <div
        class="process"
        :style="
          deviceInfo !== 'mobile'
            ? {
                width: '50%',
                height: '100%',
                padding: '50px 10px 0px 20px',
                alignItems: 'center',
              }
            : {
                width: '100%',
                height: '50%',
                padding: '10px',
                alignItems: 'flex-start',
              }
        "
      >
        <div class="info">
          <div :style="{ fontSize: deviceInfo === 'mobile' ? '18px' : '26px' }">
            人脸识别定位
          </div>
          <div class="subtitle">
            <el-progress
              :text-inside="true"
              :stroke-width="26"
              :percentage="topProgress"
            />
          </div>
          <div :style="{ fontSize: deviceInfo === 'mobile' ? '18px' : '26px' }">
            五官轮廓分析
          </div>
          <div class="subtitle">
            <el-progress
              :text-inside="true"
              :stroke-width="26"
              :percentage="centerProgress"
            />
          </div>
          <div :style="{ fontSize: deviceInfo === 'mobile' ? '18px' : '26px' }">
            生成面相报告
          </div>
          <div class="subtitle">
            <el-progress
              :text-inside="true"
              :stroke-width="26"
              :percentage="bottomProgress"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="scanImg-button">
      <div
        :class="{
          'face-button': true,
          'face-button-blue':
            bottomStatus === 'success' && scanState ? true : false,
          'face-button-grey':
            bottomStatus === 'success' && scanState ? false : true,
        }"
        :style="{
          cursor:
            bottomStatus === 'success' && scanState ? 'pointer' : 'not-allowed',
          width: '300px',
          height: '60px',
        }"
        @click="bottomStatus === 'success' && scanState ? toReport() : ''"
      >
        {{
          bottomStatus === "success" && scanState
            ? "开启面相报告"
            : "面相探索中"
        }}
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.scanImg {
  .scanImg-container {
    height: 75vh;
    align-items: center;
    .box {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      .img {
        width: 100%;
        height: 280px;
        position: relative;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        background-image: url("@/assets/scanback.svg");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        overflow: hidden;
        .line {
          width: 100%;
          height: 0px;
          background-image: linear-gradient(
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 0.6)
          );
          animation: changeHeight 5s linear infinite;
          position: absolute;
          left: 0px;
          top: 0px;
          z-index: 5;
        }
        .table {
          width: 100%;
          height: 100%;
          background-image: url("@/assets/tableback.png");
          background-size: 100% 100%;
          background-repeat: no-repeat;
          position: absolute;
          left: 0px;
          top: 0px;
          z-index: 4;
        }
        .scanLine {
          width: 135%;
          height: 8px;
          z-index: 5;
          position: absolute;
          top: 0px;
          left: -20%;
          animation: changeImgHeight 5s linear infinite;
        }
        img {
          height: 80%;
          object-fit: cover;
        }
      }
    }
    .process {
      font-size: 12px;
      box-sizing: border-box;
      display: flex;

      .info {
        width: 100%;
        .subtitle {
          width: 100%;
          height: 40px;
          font-size: 8px;
          margin-top: 15px;
        }
      }
    }
  }
  .scanImg-button {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
  }
}
</style>
