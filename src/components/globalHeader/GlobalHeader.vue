<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from "vue";
import store from "../../store";
import router from "../../router";
import { useRouter } from "vue-router";
import { Back } from "@element-plus/icons";

//defineProps,defineEmits
const props = defineProps<{ headerTitle: string }>();
const deviceInfo = computed(() => store.state.deviceInfo);
const goBack = () => {
  // if (window.history.length <= 1) {
  // router.push({ path: "/" });
  console.log(deviceInfo.value);
  if (deviceInfo.value === "touch") {
    router.push({ path: "/touchHome" });
  } else {
    router.push({ path: "/home" });
  }

  // return false;
  // } else {
  //   router.back();
  // }
};
</script>
<template>
  <div class="header">
    <div class="back-container" @click="goBack">
      <el-icon :size="deviceInfo === 'mobile' ? 24 : 38">
        <back color="#6990D6" />
      </el-icon>
    </div>
    <div
      class="title"
      :style="{ fontSize: deviceInfo === 'mobile' ? '18px' : '30px' }"
    >
      <span v-if="props.headerTitle"> {{ headerTitle }}</span>
      <slot v-else></slot>
    </div>
    <!-- <div :style="{ width: '80px' }"></div> -->
  </div>
</template>
<style scoped lang="scss">
.header {
  width: 100%;
  height: 50px;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 10px;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
  .back-container {
    // width: 80px;
    height: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
    position: absolute;
    top: 0px;
    left: 10px;
    z-index: 2;
  }
  .title {
    // width: calc(100% - 160px);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6990d6;
  }
}
</style>
