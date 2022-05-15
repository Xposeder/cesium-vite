<template></template>
<script setup>
import Roaming from "./roam";
const viewer = main.viewer;
// Cesium.Resource.fetchJson("线.json").then((res) => {
//   console.log(res);
// });
// Cesium.GeoJsonDataSource.load("线.json").then(function (dataSource) {
//   viewer.dataSources.add(dataSource).then((res) => {
//     const path = res.entities.values[0];
//     console.log(path);
//     // viewer.trackedEntity = path;
//     // viewer.flyTo(path, {
//     //   duration: 1,
//     // });
//     let roaming = new Roaming(viewer, {
//       modeluri: "CesiumAir/Cesium_Air.gltf",
//       time: 200,
//       Lines: path.polyline.positions._value.splice(0, 1000),
//       isPathShow: true,
//     });
//   });
// });.
const tours = main.tours;
let roaming = new Roaming(viewer, {
  modeluri: "CesiumAir/Cesium_Air.gltf",
  time: 9900,
  Lines: tours,
  isPathShow: true,
});
console.log(roaming, roaming.path.material);
</script>