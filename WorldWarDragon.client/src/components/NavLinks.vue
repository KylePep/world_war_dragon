<script setup>
import { useRoute } from "vue-router";
import LoginSmall from "./LoginSmall.vue";
import BossDragon from "./BossDragon.vue";
const emit = defineEmits(['handleClose'])

const route = useRoute()
</script>


<template>
  <section v-if="route.name != 'Game'" class="can-click text-2p text-outline-bg row w-100 mt-0">
    <div class="col-4 d-flex ps-3 py-2 position-relative">
      <LoginSmall />
      <router-link class="d-none d-md-block" :to="{ name: 'Home' }"
        :class="[route.name == 'Home' ? 'nav-btn-off' : 'nav-btn']">Home</router-link>
      <router-link class="d-none d-md-block" :to="{ name: 'Map' }"
        :class="[route.name == 'Map' ? 'nav-btn-off' : 'nav-btn']">Map</router-link>
    </div>

    <div class="col-4 d-flex justify-content-center position-relative">
      <div class="d-flex justify-content-center">
        <BossDragon />
      </div>
    </div>
    <div class="col-4 d-flex justify-content-end pe-0 py-2">

      <router-link class="d-none d-md-block" :to="{ name: 'Account' }"
        :class="[route.name == 'Account' ? 'nav-btn-off' : 'nav-btn']">Character</router-link>
      <router-link class="d-none d-md-block" :to="{ name: 'Score' }"
        :class="[route.name == 'Score' ? 'nav-btn-off' : 'nav-btn']">Hall</router-link>
      <router-link class="d-none d-md-block" :to="{ name: 'Lore' }"
        :class="[route.name == 'Lore' ? 'nav-btn-off' : 'nav-btn']">Lore</router-link>
      <router-link class="d-block d-md-none" :to="{ name: 'Home' }"
        :class="[route.name == 'Home' ? 'nav-btn-off' : 'nav-btn']">Home</router-link>
    </div>
  </section>
  <section v-else class="can-click mt-0">
    <LoginSmall />
  </section>
</template>


<style lang="scss" scoped>
.nav-btn {
  background-color: var(--bs-body-bg);
  color: var(--bs-text);
  padding: 8px;
  border: 2px solid var(--bs-outline);
  border-radius: 6px;
  font-weight: bold;

}

.nav-btn:hover {
  color: var(--bs-secondary);
  cursor: pointer;
}

.nav-btn-off {
  background-color: var(--bs-background);
  padding: 8px;
  border: 2px solid gray;
  border-radius: 6px;
  font-weight: bold;
  color: var(--bs-text);
}

.nav-btn-off {
  cursor: default;
}
</style>