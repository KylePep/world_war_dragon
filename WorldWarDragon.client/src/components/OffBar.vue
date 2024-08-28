<template>
  <nav class="navbar fixed-top pt-0 disable-click">
    <div class="container-fluid px-0 disable-click">

      <NavLinks />

      <NavStats />

      <div class="can-click offcanvas offcanvas-start " tabindex="-1" id="offcanvasNavbar"
        aria-labelledby="offcanvasNavbarLabel">


        <div class="offcanvas-header mb-1">
          <router-link @click="closeNavbar()" :to="{ name: 'Home' }"
            class=" game-title text-2p text-outline  selectable fw-semibold" id="offcanvasNavbarLabel  ">World War
            Dragon</router-link>
          <button v-if="account?.id" @click="closeNavbar(), checkDialogue()"
            class="position-relative mdi mdi-script-text text-light text-outline btn btn-secondary px-2 py-1"
            data-bs-toggle="modal" data-bs-target="#dialogueModal">
            <NotificationAvailable :notificationProp="'dialogue'" />
          </button>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>


        <div class="offcanvas-body text-2p text-outline-bg">
          <div>
            <Login />
          </div>

          <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">

            <OffStats />

            <OffLinks @handleClose="closeNavbar" />

            <OffSettings />


          </ul>

        </div>
      </div>
    </div>
  </nav>
</template>


<script setup>
import { computed, onMounted, ref, watchEffect } from 'vue';
import { loadState, saveState } from '../utils/Store.js';
import Login from './Login.vue';
import LoginSmall from './LoginSmall.vue';
import NotificationAvailable from './NotificationAvailable.vue'
import { AppState } from "../AppState.js";
import { useRoute } from "vue-router";
import { Offcanvas } from "bootstrap";
import Pop from "../utils/Pop.js";
import { accountService } from "../services/AccountService.js";
import BossDragon from "./BossDragon.vue";
import OffSettings from "./OffSettings.vue";
import OffLinks from "./OffLinks.vue";
import OffStats from "./OffStats.vue";
import NavLinks from "./NavLinks.vue";
import NavStats from "./NavStats.vue";

const theme = ref(loadState('theme') || 'light')
const route = useRoute()

onMounted(() => {
  document.documentElement.setAttribute('data-bs-theme', theme.value)
})

function closeNavbar() {
  Offcanvas.getOrCreateInstance('#offcanvasNavbar').hide()
}

async function updateDialogueSeen() {
  try {
    await accountService.editAccount({ dialogueSeen: AppState.account.dialogueSeen })
  } catch (error) {
    Pop.error(error.message, '[]')
  }
}

function checkDialogue() {
  if (AppState.account.dialogueSeen == 0) {
    AppState.account.dialogueSeen = 1;
    updateDialogueSeen()
  }
}

const account = computed(() => AppState.account)
const appState = computed(() => AppState)

</script>


<style lang="scss" scoped>
.game-title {
  font-weight: 400;
  font-size: 16px;
  font-style: normal;

  color: #ff7300;
}

.disable-click {
  pointer-events: none;

  >.can-click {
    pointer-events: all;
  }
}

@media screen and (min-width: 576px) {
  nav {
    height: 64px;
  }
}
</style>