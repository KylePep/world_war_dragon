<script setup>
import { useRoute } from "vue-router";
const emit = defineEmits(['handleClose'])

const route = useRoute()
function closeNavbar() {
  // Offcanvas.getOrCreateInstance('#offcanvasNavbar').hide()
  emit('handleClose');
}
</script>


<template>
  <li v-if="route.name != 'Game'">
    <router-link class="btn text-light selectable text-uppercase" @click="closeNavbar()" :to="{ name: 'Game' }">
      Join the FIGHT!
    </router-link>
  </li>

  <li>
    <router-link class="btn text-light selectable text-uppercase" @click="closeNavbar()" :to="{ name: 'Home' }">
      HOME
    </router-link>
  </li>

  <li>
    <router-link @click="closeNavbar()" :to="{ name: 'Map' }" class="btn text-light selectable text-uppercase">
      Map
    </router-link>
  </li>

  <li>
    <router-link class="btn text-light selectable text-uppercase" @click="closeNavbar()" :to="{ name: 'Account' }">
      Character
      <NotificationAvailable :notificationProp="'level'" />
    </router-link>
  </li>

  <li>
    <router-link @click="closeNavbar()" :to="{ name: 'Tutorial' }" class="btn text-light selectable text-uppercase">
      Tutorial
    </router-link>
  </li>


  <li>
    <router-link @click="closeNavbar()" :to="{ name: 'Score' }" class="btn text-light selectable text-uppercase">
      Hall of Valor
    </router-link>
  </li>

  <li>
    <router-link @click="closeNavbar()" :to="{ name: 'About' }" class="btn text-light selectable text-uppercase">
      About
    </router-link>
  </li>

  <li>
    <router-link @click="closeNavbar()" :to="{ name: 'Lore' }" class="btn text-light selectable text-uppercase">
      Lore
    </router-link>
  </li>

  <li>
    <router-link @click="closeNavbar()" :to="{ name: 'RoadMap' }" class="btn text-light selectable text-uppercase">
      Changes
    </router-link>
  </li>
</template>


<style lang="scss" scoped>
li {
  padding-bottom: 28px;
}
</style>