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
    <br>
    搜索：<input type="text"  @keyup.enter="search" />
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
const start = ref();
const stop = ref();
const last = ref();
const next = ref();

const search = ref();
const tourInterval = ref(10);
let fly, tours;
onMounted(() => {
  const viewer = main.viewer;
  const { camera, clock } = viewer;
  let i = -1;
  Cesium.GeoJsonDataSource.load("点.json", {
    markerSize: 5,
  }).then(function (dataSource) {
    viewer.dataSources.add(dataSource).then((res) => {
      tours = res.entities.values;
      tours.forEach((tour) => {
        tour.billboard = undefined;
        tour.label = new Cesium.LabelGraphics({
          text: tour.name,
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
            10.0,
            999999
          ),
        });
      });
    });
  });
  start.value = () => {
    //清除上一次的漫游并重新开始
    clearInterval(fly);
    fly = setInterval(() => {
      tourFly();
      if (i >= tours.length) {
        clearInterval(fly);
      }
    }, tourInterval.value * 1000);
  };

  stop.value = () => {
    clearInterval(fly);
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
    flyTo(tour)
  }
  function flyTo(tour){
    const p = tour.position;
    //获取笛卡尔坐标
    const v = p.getValue(clock.currentTime);
    const c = Cesium.Cartographic.fromCartesian(v);
    const tourPos = Cesium.Cartesian3.fromRadians(c.longitude, c.latitude, 999);

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

    //将相机飞到当前视图包含提供的边界球的位置
    camera.flyToBoundingSphere(new Cesium.BoundingSphere(tourPos, 4000), {
      easingFunction: Cesium.EasingFunction.LINEAR_NONE, //漫游路径插值与缓动函数
      duration: 1,
      maximumHeight: 0,
      //调整相机的角度
      offset: new Cesium.HeadingPitchRange(0, -0.1, 0),
      complete: () => {
        viewer.selectedEntity = tour;
      },
    });
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