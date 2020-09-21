<template>
  <h1>暗号： see you next time</h1>
  <header>{{ currentActiveChild.title }}</header>
  <div class="container" ref="containerRef">
    <div
      :class="{ item: true, active: item === activeChild }"
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
  onUnmounted,
  computed,
} from "vue";
import { Debounce } from "../utils/streamControl";
import { getDataSource } from "./data";
const myDebounce = new Debounce();
/**
 * 随着滚动 当某一章节到滚动区域的可是区域则变色 并 激活该章节 可用于做 以后可以用于目录定位什么的
 */
export default defineComponent({
  setup(props) {
    // 滚动盒子
    const containerRef = ref(null);
    // 章节item
    const itemRefs = ref([]);
    // 填充章节元素和对应的数据
    const setItemRef = (el, item) => {
      itemRefs.value.push({ el, item });
    };
    // 响应式数据
    const state = reactive({
      dataSource: [],
    });
    // 监听滚动逻辑 并返回当前激活的章节 ref
    const activeChild = useScroll(containerRef, itemRefs);

    // 通过计算属性返回正确的标题
    const currentActiveChild = computed(() => {
      if (activeChild.value) {
        return activeChild.value;
      }
      return { title: "加载中..." };
    });
    // 当数据源发生变化是默认标题为数组的第一项
    watch(
      () => state.dataSource,
      (val) => {
        if (val.length) {
          activeChild.value = val[0];
        }
      }
    );
    // 更新时清空章节refs容器
    onBeforeUpdate(() => {
      itemRefs.value = [];
    });
    // 获取异步数据
    onBeforeMount(() => {
      getDataSource().then((dataSource) => {
        state.dataSource = dataSource;
      });
    });
    return {
      ...toRefs(state),
      setItemRef,
      containerRef,
      activeChild,
      currentActiveChild,
    };
  },
});
/**
 * 注册滚动事件逻辑 返回 激活章节的ref
 */
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
          scrollTop >= childOffsetParentTop - 100 &&
          scrollTop < childOffsetParentTop + child.el.offsetHeight - 100
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
.active {
  color: red;
}
.children-container {
  background-color: #eee;
  padding: 1rem;
}
</style>
