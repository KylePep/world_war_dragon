<script setup>
import { useRoute } from "vue-router";
import { AppState } from "../AppState.js";
import { computed } from "vue";


const account = computed(() => AppState.account)
const appState = computed(() => AppState)
const route = useRoute()
</script>


<template>
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
    <div v-if="account?.attack > 0 || account?.attackAid > 0" class="mdi mdi-sword-cross text-danger" title="Attack">
      : {{ account?.attack }} ( {{ account?.attackAid }} )
    </div>
    <div v-if="account?.shield > 0 || account?.shieldAid > 0" class="mdi mdi-shield-sun text-info" title="Shield">
      : {{ account?.shield }} ( {{ account?.shieldAid }} )
    </div>
    <div v-if="account?.heal > 0 || account?.healAid > 0" class="mdi mdi-bottle-tonic-plus text-success" title="Heal">
      : {{ account?.heal }} ( {{ account?.healAid }} )
    </div>

  </section>
</template>


<style lang="scss" scoped>
.stats {
  font-size: 0.75rem;
}
</style>