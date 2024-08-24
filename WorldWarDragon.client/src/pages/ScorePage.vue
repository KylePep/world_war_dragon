<template>
  <section class="row">
    <div class="col-12 text-2p text-outline fs-1 fw-bold text-center text-light">
      Hall of Valor
    </div>
    <p class="text-center text-2p">-Top Damage Players-</p>
  </section>
  <section class="row">
    <div class="col-12 d-flex justify-content-center" v-for="score, index in bossDamages" :key="score.id">
      <ScoreCard :scoreProp="score" :index="index" />

    </div>
  </section>
</template>


<script>
import Pop from "../utils/Pop.js";
import { bossDamageService } from "../services/BossDamageService.js";
import { computed, onMounted } from "vue";
import { AppState } from "../AppState.js";

export default {
  setup() {
    onMounted(() => {
      setBgImg();
      getBossDamages();
    });

    async function getBossDamages() {
      try {
        await bossDamageService.getBossDamages()
      } catch (error) {
        Pop.error(error.message)
      }
    }

    const setBgImg = () => {
      const mainElement = document.querySelector('main');
      if (mainElement) {
        let bgImg = '/assets/HallOfValor.jpeg';
        mainElement.style.backgroundImage = `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.90) 100%), url(${bgImg})`;
      }
    }
    return {
      bossDamages: computed(() => AppState.bossDamages.filter((b) => b.bossId == AppState.activeBoss.id).sort((a, b) => b.dmg - a.dmg))
    }
  }
}
</script>


<style lang="scss" scoped></style>