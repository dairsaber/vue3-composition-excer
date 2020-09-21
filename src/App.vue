<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3.0 + Vite" />
  <MenuList />
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import MenuList from "./components/MenuList.vue";
export default {
  name: "App",
  components: {
    HelloWorld,
    MenuList,
  },
};
</script>
