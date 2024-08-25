<template>
  <nav class="navbar  fixed-top pt-0">
    <div class="container-fluid px-0 disable-click">

      <section class="can-click text-2p text-outline-bg row w-100 mt-0  mt-0">
        <div class="col-4 d-flex  ps-3 py-2 position-relative">
          <LoginSmall />
          <router-link class="d-none d-md-block" v-if="route.name != 'Game'" :to="{ name: 'Home' }"
            :class="[route.name == 'Home' ? 'nav-btn-off' : 'nav-btn']">Home</router-link>
          <router-link class="d-none d-md-block" v-if="route.name != 'Game'" :to="{ name: 'Map' }"
            :class="[route.name == 'Map' ? 'nav-btn-off' : 'nav-btn']">Map</router-link>
        </div>
        <div class="col-4 d-flex justify-content-center position-relative">
          <div v-if="route.name != 'Game'" class="d-flex justify-content-center">
            <BossDragon />
          </div>
        </div>
        <div class="col-4 d-flex justify-content-end pe-0 py-2">

          <router-link class="d-none d-md-block" v-if="route.name != 'Game'" :to="{ name: 'Account' }"
            :class="[route.name == 'Account' ? 'nav-btn-off' : 'nav-btn']">Character</router-link>
          <router-link class="d-none d-md-block" v-if="route.name != 'Game'" :to="{ name: 'Score' }"
            :class="[route.name == 'Score' ? 'nav-btn-off' : 'nav-btn']">Hall</router-link>
          <router-link class="d-none d-md-block" v-if="route.name != 'Game'" :to="{ name: 'Lore' }"
            :class="[route.name == 'Lore' ? 'nav-btn-off' : 'nav-btn']">Lore</router-link>
          <router-link class="d-block d-md-none" v-if="route.name != 'Game'" :to="{ name: 'Home' }"
            :class="[route.name == 'Home' ? 'nav-btn-off' : 'nav-btn']">Home</router-link>
        </div>
      </section>

      <section v-if="account?.id && route.name != 'Game'"
        class="d-none d-md-block row ps-2 d-flex disable-click fw-bold stats text-outline-bg text-2p">
        <div class="mdi mdi-circle-multiple " title="Gold">
          : {{ account?.gold }}
        </div>
        <div class="mdi mdi-medal" title="Experience">
          : {{ account?.valor - appState.account?.valorSpent }}
        </div>
        <div class="mdi mdi-heart" title="Health">
          : {{ account?.health }}
          <!-- ( {{ appState.healthMod[appState.activeRoom.id] }} ) -->
        </div>
        <div class="mdi mdi-weight-lifter" title="Power">
          : {{ account?.power }}
          <!-- ( {{ appState.powerMod[appState.activeRoom.id] }} ) -->
        </div>
        <div v-if="account?.attack > 0 || account?.attackAid > 0" class="mdi mdi-sword-cross text-danger"
          title="Attack">
          : {{ account?.attack }} ( {{ account?.attackAid }} )
        </div>
        <div v-if="account?.shield > 0 || account?.shieldAid > 0" class="mdi mdi-shield-sun text-info" title="Shield">
          : {{ account?.shield }} ( {{ account?.shieldAid }} )
        </div>
        <div v-if="account?.heal > 0 || account?.healAid > 0" class="mdi mdi-bottle-tonic-plus text-success"
          title="Heal">
          : {{ account?.heal }} ( {{ account?.healAid }} )
        </div>

      </section>



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

            <ul class="d-none d-md-block p-2">
              <div class="stat-block">

                <div class="mdi mdi-circle-multiple " title="Gold">
                  Gold: {{ account?.gold }}
                </div>
                <div class="mdi mdi-medal" title="Experience">
                  Experience: {{ account?.valor - appState.account?.valorSpent }}
                </div>
                <div class="mdi mdi-heart" title="Health">
                  Health: {{ account?.health }}
                  <!-- ( {{ appState.healthMod[appState.activeRoom.id] }} ) -->
                </div>
                <div class="mdi mdi-weight-lifter" title="Power">
                  Power: {{ account?.power }}
                  <!-- ( {{ appState.powerMod[appState.activeRoom.id] }} ) -->
                </div>
              </div>
            </ul>

            <ul class="d-none d-md-block p-2 mb-3">
              <div class="stat-block">
                <div class="mdi mdi-sword-cross text-danger" title="Attack">
                  Attack: {{ account?.attack }} ( {{ account?.attackAid }} )
                </div>
                <div class="mdi mdi-shield-sun text-info" title="Shield">
                  Shield: {{ account?.shield }} ( {{ account?.shieldAid }} )
                </div>
                <div class="mdi mdi-bottle-tonic-plus text-success" title="Heal">
                  Heal: {{ account?.heal }} ( {{ account?.healAid }} )
                </div>
              </div>
            </ul>

            <button
              class="fs-5 mb-3 d-flex d-md-none justify-content-between align-items-center btn btn-dark dropdown-toggle mb-2"
              data-bs-toggle="dropdown" data-bs-auto-close="false" aria-expanded="false">
              STATS
            </button>
            <ul class="dropdown-menu p-2">
              <div class="stat-block">

                <div class="mdi mdi-circle-multiple " title="Gold">
                  Gold: {{ account?.gold }}
                </div>
                <div class="mdi mdi-medal" title="Experience">
                  Experience: {{ account?.valor - appState.account?.valorSpent }}
                </div>
                <div class="mdi mdi-heart" title="Health">
                  Health: {{ account?.health }}
                  <!-- ( {{ appState.healthMod[appState.activeRoom.id] }} ) -->
                </div>
                <div class="mdi mdi-weight-lifter" title="Power">
                  Power: {{ account?.power }}
                  <!-- ( {{ appState.powerMod[appState.activeRoom.id] }} ) -->
                </div>
              </div>
            </ul>

            <button
              class="fs-5 mb-3 d-flex d-md-none justify-content-between align-items-center btn btn-dark dropdown-toggle mb-2"
              data-bs-toggle="dropdown" data-bs-auto-close="false" aria-expanded="false">
              Inventory
            </button>
            <ul class="dropdown-menu p-2">
              <div class="stat-block">
                <div class="mdi mdi-sword-cross text-danger" title="Attack">
                  Attack: {{ account?.attack }} ( {{ account?.attackAid }} )
                </div>
                <div class="mdi mdi-shield-sun text-info" title="Shield">
                  Shield: {{ account?.shield }} ( {{ account?.shieldAid }} )
                </div>
                <div class="mdi mdi-bottle-tonic-plus text-success" title="Heal">
                  Heal: {{ account?.heal }} ( {{ account?.healAid }} )
                </div>
              </div>
            </ul>

            <li v-if="route.name != 'Game'">
              <router-link class="btn text-light selectable text-uppercase" @click="closeNavbar()"
                :to="{ name: 'Game' }">
                Join the FIGHT!
              </router-link>
            </li>

            <li>
              <router-link class="btn text-light selectable text-uppercase" @click="closeNavbar()"
                :to="{ name: 'Home' }">
                HOME
              </router-link>
            </li>

            <li>
              <router-link @click="closeNavbar()" :to="{ name: 'Map' }"
                class="btn text-light selectable text-uppercase">
                Map
              </router-link>
            </li>

            <li>
              <router-link class="btn text-light selectable text-uppercase" @click="closeNavbar()"
                :to="{ name: 'Account' }">
                Character
                <NotificationAvailable :notificationProp="'level'" />
              </router-link>
            </li>

            <li>
              <router-link @click="closeNavbar()" :to="{ name: 'Tutorial' }"
                class="btn text-light selectable text-uppercase">
                Tutorial
              </router-link>
            </li>


            <li>
              <router-link @click="closeNavbar()" :to="{ name: 'Score' }"
                class="btn text-light selectable text-uppercase">
                Hall of Valor
              </router-link>
            </li>

            <li>
              <router-link @click="closeNavbar()" :to="{ name: 'About' }"
                class="btn text-light selectable text-uppercase">
                About
              </router-link>
            </li>

            <li>
              <router-link @click="closeNavbar()" :to="{ name: 'Lore' }"
                class="btn text-light selectable text-uppercase">
                Lore
              </router-link>
            </li>

            <li>
              <router-link @click="closeNavbar()" :to="{ name: 'RoadMap' }"
                class="btn text-light selectable text-uppercase">
                Changes
              </router-link>
            </li>



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

const theme = ref(loadState('theme') || 'light')
const route = useRoute()

onMounted(() => {
  document.documentElement.setAttribute('data-bs-theme', theme.value)
})


// function toggleTheme() {
//   theme.value = theme.value == 'light' ? 'dark' : 'light'
//   document.documentElement.setAttribute('data-bs-theme', theme.value)
//   saveState('theme', theme.value)
// }

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
a:hover {
  text-decoration: none;
}

li {
  padding-bottom: 32px;
}

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

.stats {
  color: var(--bs-text);
}

.stat-block {
  font-size: .75rem;
}

.game-title {
  // font-family: "Metal Mania", system-ui;
  font-weight: 400;
  font-size: 16px;
  font-style: normal;

  color: #ff7300;

  // border: 2px solid white;
  // border-radius: 8px;

  // text-shadow: 4px 4px 4px black;
}

.text-shadow {
  text-shadow: 2px 2px 0px black;
}

.disable-click {
  pointer-events: none;

  >.can-click {
    pointer-events: all;
  }
}

.nav-link {
  text-transform: uppercase;
}

.navbar-nav .router-link-exact-active {
  border-bottom: 2px solid var(--bs-secondary);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;

}

@media screen and (min-width: 576px) {
  nav {
    height: 64px;
  }
}
</style>