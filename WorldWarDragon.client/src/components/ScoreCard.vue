<template>

  <section class="row character-card  mt-3 text-center text-V text-outline-bg border border-1 border-outline rounded ">
    <div class="col-4 col-md-3 fs-1 text-outline text-start rounded" :style="{ backgroundImage: `url(${bgIcon})` }"
      style="background-position: 50% 10%; background-size: cover;">{{ index + 1 }}</div>
    <div
      class="col-5 col-md-4 offset-0 offset-md-1 d-flex flex-column flex-md-column justify-content-around fs-1 overflow-x-hidden">
      <div v-if="scoreProp.creator.name.length > 6" :title="scoreProp.creator.name">
        <div class="marquee d-md-none">
          {{ scoreProp.creator.name }}
        </div>
        <div class="d-none d-md-block">
          {{ scoreProp.creator.name }}
        </div>
      </div>
      <div v-else>
        {{ scoreProp.creator.name }}
      </div>
      <div class="fs-6">-{{ scoreProp.creator.title }}-</div>

      <div class="fs-5 d-flex justify-content-center">
        <p class=" my-0 me-3 d-flex flex-column flex-md-row" title="Level">
        <div class="pe-1">Level </div>
        {{ Math.round(scoreProp.creator.level) }}
        </p>
        <p class="my-0 d-flex flex-column flex-md-row" title="Dragons">
        <div class="pe-1">Dragons </div>
        {{ Math.round(scoreProp.creator.dragons) }}
        </p>
      </div>

    </div>
    <div class="col-3 col-md-4 fs-2 d-flex flex-column  align-items-center text-center">
      <p class="my-0 fs-1">
        Damage
      </p>
      <p class="my-0">
        {{ Math.round(scoreProp.dmg) }}
      </p>
    </div>
  </section>

</template>


<script>
import { AppState } from "../AppState.js";
import { computed } from 'vue'

export default {
  props: {
    scoreProp: { type: Object, required: true },
    index: { type: Number }
  },
  setup(props) {
    const accountIcon = computed(() => props.scoreProp.creator.picture);

    const bgIcon = computed(() => {
      const icon = accountIcon.value;
      if (!icon.includes('assets/player/player') && icon.length > 2) {
        return 'assets/player/player0.jpeg';
      } else {
        return icon;
      }
    });

    return {
      accountIcon,
      bgIcon

    }
  }
}
</script>


<style lang="scss" scoped>
.character-card {
  width: 90vw;
  // height: 120px;
  padding: 8px;
  font-weight: bold;
  background-color: var(--bs-background);
}

@media screen and (min-width: 576px) {
  .character-card {
    width: 70vw;
  }
}

.card-icon {
  text-shadow: 2px 2px 16px black;
  text-shadow: -2px -2px 16px black;
}

.marquee {
  white-space: nowrap;
  position: relative;
  animation: marquee 10s linear infinite;
}

@keyframes marquee {
  0% {
    transform: translateX(0%);
  }

  10% {
    transform: translateX(0%);
  }

  100% {
    transform: translateX(-250%);
  }
}
</style>