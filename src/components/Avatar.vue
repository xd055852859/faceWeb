<template>
  <div
    :style="{
      borderRadius: type === 'person' ? '50%' : '8px',
      width: size + 'px',
      height: size + 'px',
    }"
    class="avatar-content"
  >
    <img
      :alt="name"
      :src="
        avatar.indexOf('imageMogr2') !== -1 && avatar.indexOf('.svg') !== -1
          ? avatar + '?imageMogr2/auto-orient/thumbnail/80x'
          : avatar
      "
      class="avatar-img"
      v-if="avatar"
    />
    <div class="avatar-img" :style="{ backgroundColor: bgColor }" v-else>
      {{ name ? name.substring(0, 1) : "无" }}
    </div>
    )}
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import defaultPersonPng from "../assets/defaultPerson.png";
import defaultGroupPng from "../assets/defaultGroup.png";
export default defineComponent({
  name: "Avatar",
  props: {
    index: Number,
    size: Number,
    name: String,
    avatar: String,
    type: String,
  },
  setup(props) {
    const BgColorArray = [
      "#1890ff",
      "rgb(0,170,255)",
      "rgb(143,126,230)",
      "rgb(179,152,152)",
      "rgb(242,237,166)",
    ];
    const bgColor = BgColorArray[(props.index ? props.index : 0) % 5];
    const avatar = ref<any>("");
    const name = ref<any>("");
    onMounted(() => {
      avatar.value = props.avatar;
      name.value = props.name;
    });
    watch(
      () => props.avatar,
      (newValue) => {
        /* ... */
        avatar.value = newValue;
      }
    );
    watch(
      () => props.name,
      (newValue) => {
        /* ... */
        name.value = newValue;
      }
    );
    return {
      bgColor,
      ...props,
      avatar,
      name,
      defaultPersonPng,
      defaultGroupPng,
    };
  },
});
</script>

<style>
.avatar-content {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.avatar-img {
  width: 100%;
  height: 100%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  object-fit: cover;
}
</style>
