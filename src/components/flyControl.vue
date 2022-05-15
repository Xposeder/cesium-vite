<template>
  <div class="flyControl">
    <button @click="last">上一站</button>
    <button @click="next">下一站</button>
    <button @click="start">开始漫游</button>
    <button @click="stop">停止漫游</button>
    漫游间隔：<input
      style="width: 40px"
      type="number"
      v-model="tourInterval"
    />秒
    <br />
    搜索：<input type="text" @keyup.enter="search" />
  </div>
</template>
<script setup>
import Roaming from "./roam";

import { ref, onMounted } from "vue";
const start = ref();
const stop = ref();
const last = ref();
const next = ref();

const search = ref();
const tourInterval = ref(10);
let fly
onMounted(() => {
  const viewer = main.viewer;
  const { camera, clock } = viewer;
  const tours = main.tours;
  new Roaming(viewer, {
    modeluri: "CesiumAir/Cesium_Air.gltf",
    time: 9900,
    Lines: tours,
    isPathShow: true,
  });
  let i = -1;

  start.value = () => {
     viewer.clock.shouldAnimate =true
  };

  stop.value = () => {
    viewer.clock.shouldAnimate =false
  };

  next.value = () => {
    tourFly();
  };
  last.value = () => {
    tourFly(false);
  };
  console.log();
  search.value = (e) => {
    const { value } = e.target;
    tours.forEach((tour) => {
      if (tour.name.indexOf(value) > -1) {
        return flyTo(tour);
      }
    });
  };
  function tourFly(next = true) {
    //判断前往下个站点还是上个站点
    if (next) {
      i++;
    } else {
      i--;
    }
    //获取当前漫游点
    const tour = tours[i];
    flyTo(tour);
  }
  function flyTo(tour) {

    // 创建说明要素
    const img_url = `/长征图片/${tour.name}.png`;
    const img = new Image();
    img.alt = tour.name;
    img.src = img_url;
    img.style = `width:100%;height:auto;object-fit: cover;`;

    const div = document.createElement("div");
    div.innerHTML = ` 当前站点：${tour.name}<br>
      介绍：${tour.properties.PopupInfo._value}<br>`;
    div.appendChild(img);
    tour.description = div.innerHTML;
viewer.selectedEntity = tour;

  }
});
</script>
<style scoped>
.flyControl {
  position: absolute;
  top: 10;
  left: 10;
  /* display: flex; */
  justify-content: center;
  align-items: center;
  z-index: 999;
  backdrop-filter: blur(2px);
  background: white;
}
</style>