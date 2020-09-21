<template>
  <header>{{ currentActiveChild.title }}</header>
  <div class="container" ref="containerRef">
    <div
      class="item"
      v-for="item in dataSource"
      :key="item.title"
      :ref="
        (el) => {
          setItemRef(el, item);
        }
      "
    >
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
  computed,
} from "vue";
import { Debounce } from "../utils/streamControl";
import { getDataSource } from "./data";
const myDebounce = new Debounce();
export default defineComponent({
  setup(props) {
    const containerRef = ref(null);
    const itemRefs = ref([]);
    const setItemRef = (el, item) => {
      itemRefs.value.push({ el, item });
    };
    const state = reactive({
      dataSource: [],
    });
    const activeChild = useScroll(containerRef, itemRefs);
    const currentActiveChild = computed(
      () => activeChild.value || { title: "加载中..." }
    );
    watch(
      () => activeChild.value,
      (val) => {
        console.log(val);
      }
    );
    onBeforeUpdate(() => {
      itemRefs.value = [];
    });
    onBeforeMount(() => {
      getDataSource().then((dataSource) => {
        state.dataSource = dataSource;
      });
    });
    return { ...toRefs(state), setItemRef, containerRef, currentActiveChild };
  },
});

function useScroll(containerRef, childrenRefs) {
  const activeChild = ref(null);
  let container;
  const handler = (event) => {
    //节流延迟
    myDebounce.go(() => {
      const children = childrenRefs.value;
      const scrollTop = container.scrollTop;
      const offsetHeight = container.offsetHeight;
      const containerOffsetTop = container.offsetTop;
      const currentActivedItem = children.find((child) => {
        const childOffsetParentTop = child.el.offsetTop - containerOffsetTop;
        return (
          childOffsetParentTop >= scrollTop - offsetHeight &&
          childOffsetParentTop < scrollTop
        );
      });
      if (currentActivedItem) {
        activeChild.value = currentActivedItem.item;
      }
    }, 80);
  };
  onMounted(() => {
    container = containerRef.value;
    container.addEventListener("scroll", handler);
  });
  onUnmounted(() => {
    container.removeEventListener("scroll", handler);
  });
  return activeChild;
}
</script>

<style scoped>
.container {
  height: 600px;
  width: 600px;
  overflow-y: auto;
  margin: 0 auto;
}
.item {
  border-top: 1px solid #888;
}
.children-container {
  background-color: #eee;
  padding: 1rem;
}
</style>
