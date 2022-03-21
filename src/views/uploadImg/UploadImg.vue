<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from "vue";
import api from "../../utils/services";
import store from "../../store";
import router from "../../router";
import axios from "axios";
import GlobalHeader from "../../components/globalHeader/GlobalHeader.vue";
import { dataURLtoBlob, blobToFile } from "../../utils/util";
import moment from "moment";
const deviceInfo = computed(() => store.state.deviceInfo);
//defineProps,defineEmits

const phoneIndex = ref<number>(0);
const uploadTitleArr = ref<string[]>([
  "正面",
  "面部完整呈现",
  "无刘海遮挡",
  "五官清晰",
  "不带眼镜",
  "图像不宜过小",
]);
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
          router.push({ name: "takeImg", params: { type:'choosePhone' }});
        };
      }
    });
};
const getImage = (e: any) => {
  uploadImg(e.target.files[0]);
};

const toTake = () => {
  router.push({ name: "takeImg", params: { type:'takePhone' }});
};
// 关闭摄像头
</script>
<template>
  <GlobalHeader headerTitle="拍照/上传照片" />
  <div class="uploadImg container">
    <!-- <div class="title">您可以直接拍照或上传本地照片</div> -->
    <div class="img">
      <img
        src="../../assets/model.png"
        alt=""
        :style="
          deviceInfo === 'mobile'
            ? { width: '280px', height: '260px' }
            : { height: '55vh' }
        "
      />
    </div>
    <div>
      <div class="text">满足以下要求结果更准确</div>
      <div class="subtitle" v-if="deviceInfo === 'mobile'">
        <el-row :gutter="10">
          <el-col
            :xs="12"
            :sm="12"
            :md="12"
            :lg="4"
            :xl="4"
            v-for="(item, index) in uploadTitleArr"
            :key="index"
          >
            <div class="item">
              {{ item }}
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-else class="subtitle-pc">
        <div class="item" v-for="(item, index) in uploadTitleArr" :key="index">
          {{ item }}
        </div>
      </div>
    </div>
    <div class="button">
      <div
        class="face-button face-button-blue upload-button"
        @click="toTake()"
        v-if="deviceInfo !== 'mobile'"
      >
        立即拍照
      </div>
      <div
        class="face-button face-button-red upload-button"
        v-if="deviceInfo !== 'touch'"
      >
        <label class="upButton">
          本地上传
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
    </div>
    <!-- <el-dialog
      v-model="phoneDialog"
      title="拍照"
      center
      :width="'670px'"
      :height="'550px'"
      show-close
      top="30px"
      @close="closeCamera"
      >       

      <template #footer>
        <span class="dialog-footer">
          <el-button size="mini" type="primary" @click="photograph"
            >拍照</el-button
          >
          <el-button @click="phoneIndex = 0">重新拍照</el-button>
        </span>
      </template>      
    </el-dialog> -->
  </div>
</template>
<style scoped lang="scss">
.uploadImg {
  display: flex;
  justify-content: center;
  // align-content: flex-start;
  flex-wrap: wrap;
  .title {
    width: 100%;
    height: 50px;
    line-height: 30px;
    text-align: center;
    font-size: 16px;
    margin-bottom: 5px;
  }
  .img {
    width: 100%;
    // height: 220px;
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  .text {
    width: 100%;
    height: 20px;
    line-height: 20px;
    font-size: 18px;
    margin-bottom: 20px;
    text-align: center;
  }
  .subtitle {
    width: 80vw;
    .item {
      // background-image: url("@/assets/titleback.png");
      // background-size: 100% 100%;
      // background-repeat: no-repeat;
      background-color: #e8e8e8;
      font-size: 18px;
      padding: 8px 10px;
      text-align: center;
      margin-bottom: 15px;
      border-radius: 18px;
      color: #333;
    }
  }
  .subtitle-pc {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .item {
      background-color: #e8e8e8;
      font-size: 18px;
      padding: 8px 18px;
      text-align: center;
      margin-bottom: 15px;
      margin: 0px 8px;
      border-radius: 18px;
      color: #333;
    }
  }
  .button {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    .upload-button {
      width: 300px;
      height: 60px;
    }
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
}
</style>
