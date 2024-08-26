<script setup>
import { computed } from "vue";
import { AppState } from "../AppState.js";

const account = computed(() => AppState.account)
const appState = computed(() => AppState)
</script>


<template>

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
      </div>
      <div class="mdi mdi-weight-lifter" title="Power">
        Power: {{ account?.power }}
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
      </div>
      <div class="mdi mdi-weight-lifter" title="Power">
        Power: {{ account?.power }}
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

</template>


<style lang="scss" scoped>
.stat-block {
  font-size: .75rem;
}
</style>