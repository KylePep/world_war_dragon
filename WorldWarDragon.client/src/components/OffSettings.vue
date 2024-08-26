<script setup>

import { computed } from "vue";
import { AppState } from "../AppState.js";

const account = computed(() => AppState.account)

</script>


<template>

  <button class="fs-5 mb-3 d-flex justify-content-between align-items-center btn btn-dark dropdown-toggle mb-2"
    data-bs-toggle="dropdown" data-bs-auto-close="false" aria-expanded="false">
    Settings
  </button>

  <ul class="dropdown-menu p-2">
    <li class="">
      Volume {{ account?.settings.volume }}
    </li>
    <li class="">
      Volume {{ account?.settings.volume }}
    </li>
    <li class="">
      Volume {{ account?.settings.volume }}
    </li>
  </ul>

</template>


<style lang="scss" scoped></style>