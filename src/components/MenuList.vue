<template>
  <div class="container" ref="containerRef">
    <div v-for="item in dataSource" :key="item.title" :ref="setItemRef">
      <h3>{{ item.title }}</h3>
      <div class="children-container">
        <p v-for="child in item.children" :key="child">{{ child }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  onBeforeMount,
  onBeforeUpdate,
  ref,
  onMounted,
  onUpdated,
  watch,
  nextTick,
  onUnmounted,
} from "vue";

import { getDataSource } from "./data";
export default defineComponent({
  setup(props) {
    const containerRef = ref(null);
    let itemRefs = ref([]);
    const setItemRef = (el) => {
      itemRefs.value.push(el);
    };
    const state = reactive({
      dataSource: [],
    });
    onBeforeUpdate(() => {
      itemRefs.value = [];
    });
    onBeforeMount(() => {
      getDataSource().then((dataSource) => {
        state.dataSource = dataSource;
      });
    });
    useScroll(containerRef, itemRefs);
    watch(
      () => state.dataSource,
      () => {
        nextTick(() => {
          console.log("containerRef watch:>> ", containerRef, itemRefs);
        });
      }
    );
    return { ...toRefs(state), setItemRef, containerRef };
  },
});

function useScroll(containerRef, childrenRefs) {
  let container;
  function handler(event) {
    const children = childrenRefs.value;
    console.log("useScroll :>> ", event);
  }
  onMounted(() => {
    container = containerRef.value;
    container.addEventListener("scroll", handler);
  });
  onUnmounted(() => {
    container.removeEventListener("scroll", handler);
  });
}
</script>

<style scoped>
.container {
  height: 800px;
  width: 600px;
  overflow-y: auto;
}
.children-container {
  background-color: #eee;
  padding: 1rem;
}
</style>
