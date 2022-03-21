<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from "vue";
import QRCode from "qrcode";
//defineProps,defineEmits
const props = defineProps<{ url: string }>();
onMounted(() => {
  QRCode.toCanvas(
    document.getElementById("canvasCode"),
    props.url,
    function (error: any) {
      if (error) console.error(error);
    }
  );
});
</script>
<template>
  <canvas id="canvasCode"></canvas>
  <!-- <div class="qrcode" ref="qrCodeUrl"></div> -->
</template>
<style scoped lang="scss">
#canvasCode {
  width: 250px !important;
  height: 250px !important;
}
</style>
