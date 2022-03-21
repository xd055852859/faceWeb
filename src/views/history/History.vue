<script setup lang="ts">
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import router from "../../router";
import store from "../../store";
import api from "../../utils/services";
import GlobalHeader from "../../components/globalHeader/GlobalHeader.vue";
import { ElMessage } from "element-plus";
import qs from "qs";
const user = computed(() => store.state.user);
const page = ref<number>(1);
const total = ref<number>(0);
const historyArray = ref<any>([]);
const deleteKey = ref<string>("");
const deleteIndex = ref<number>(0);
const deleteDialog = ref<boolean>(false);
//defineProps,defineEmits
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
    userKey: user.value.userKey,
    page: page.value,
    limit: 50,
  });
  if (res.msg === "OK") {
    historyArray.value.push(...res.data);
    total.value = res.totals;
  }
};
const scrollLoading = (e: any) => {
  let scrollHeight: number = e.target.scrollHeight;
  //滚动条滚动距离
  let scrollTop: number = e.target.scrollTop;
  //窗口可视范围高度
  let clientHeight: number = e.target.clientHeight;
  if (
    clientHeight + scrollTop >= scrollHeight - 1 &&
    historyArray.value.length < total.value
  ) {
    page.value += 1;
    getHistory();
  }
};
const toReport = (reportId: string) => {
  localStorage.setItem("reportId", reportId);
  router.push({ name: "report" });
};
const deleteReport = async () => {
  let res: any = await api.request("post", api.baseUrl + "deleteReport", {
    recordIdArr: [deleteKey.value],
  });
  if (res.msg === "OK") {
    ElMessage.success("面相报告删除成功");
    historyArray.value.splice(deleteIndex.value, 1);
    total.value = total.value < 2 ? 0 : total.value - 1;
    deleteDialog.value = false;
  } else {
    ElMessage.error(res.msg);
  }
};
</script>
<template>
  <GlobalHeader headerTitle="历史" />
  <div class="history container" @scroll="scrollLoading">
    <el-row :gutter="10" v-if="historyArray.length > 0">
      <el-col
        :xs="8"
        :sm="6"
        :md="4"
        :lg="4"
        :xl="4"
        v-for="(item, index) in historyArray"
        :key="index"
      >
        <div class="history-item" @click="toReport(item._key)">
          <img :src="item.filePath" alt="" class="img" />
          <div
            class="deleteIcon"
            @click="
              (e) => {
                e.stopPropagation();
                deleteKey = item._key;
                deleteDialog = true;
                deleteIndex = index;
              }
            "
          >
            <img src="../../assets/delete.svg" alt="" />
          </div>
        </div>
      </el-col>
    </el-row>

    <div class="history-empty" v-if="historyArray.length === 0">
      <img src="../../assets/empty.png" class="image" alt="" />
      <div class="text">您还没有测过面相</div>
      <div class="text">快去上传照片试试吧</div>
    </div>
    <el-dialog v-model="deleteDialog" title="删除" :width="'350px'">
      <div class="single-dialog">是否删除该报告</div>
      <div slot="footer" class="dialog-footer dialog-right">
        <el-button @click="deleteDialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteReport">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style scoped lang="scss">
.history {
  .history-item {
    width: 100%;
    height: 200px;
    margin-bottom: 10px;
    position: relative;
    z-index: 1;
    .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .deleteIcon {
      width: 35px;
      height: 35px;
      position: absolute;
      right: 5px;
      bottom: 5px;
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 5;
      background-color: #999;
      border-radius: 50%;
      cursor: pointer;
      img {
        width: 35px;
        height: 35px;
      }
    }
    &:hover .deleteIcon {
      display: flex;
    }
  }
  .single-dialog {
    font-size: 12px;
    margin: 10px 0px 20px 0px;
  }
  .dialog-right {
    display: flex;
    justify-content: flex-end;
  }
  .history-empty {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    align-content: center;
    .image {
      width: 107px;
      height: 100px;
      margin-left: 25px;
    }
    .text {
      width: 100%;
      font-size: 12px;
      text-align: center;
      margin-top: 20px;
    }
  }
}
</style>
