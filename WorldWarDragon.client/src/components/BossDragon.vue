<template>
  <div :class="{ scrolled: isScrolled }"
    class="boss-dragon text-outline-bg text-2p position-absolute text-center ms-4  pb-1 px-3 fs-3">
    <img class=" dragon-icon" src="/assets/dragonIcon.png" alt="">
    <div class=" px-3 ">
      <h1 class="fs-5">{{ activeBoss.name }}</h1>
      <h2 class="fs-5">{{ Math.round(activeBoss.hp - activeBoss.damages) }}</h2>
    </div>
  </div>
</template>


<script>
import Pop from "../utils/Pop.js";
import { AppState } from "../AppState.js";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { bossService } from "../services/BossService.js";
import { logger } from "../utils/Logger.js";

export default {
  setup() {
    const isScrolled = ref({})
    async function getBosses() {
      try {
        await bossService.getBosses()
      } catch (error) {
        Pop.error(error.message)
      }
    }

    function setScrollEvent() {
      window.addEventListener('scroll', checkScroll)
      checkScroll();
    }

    function checkScroll() {
      if (window.scrollY == 0) {
        isScrolled.value = false
      } else {
        isScrolled.value = true
      }
    }



    onUnmounted(() => {
      window.removeEventListener('scroll', checkScroll);
    })

    onMounted(() => {
      setScrollEvent()
      getBosses()
    })

    return {
      activeBoss: computed(() => AppState.activeBoss),
      isScrolled
    }
  }
}
</script>


<style lang="scss" scoped>
.dragon-icon {
  max-height: 48px;
  width: auto;
}

.boss-dragon {
  font-weight: 400;
  font-style: normal;
  color: var(--bs-text);
  box-shadow: 2px 0px 10px #0000008c;
  background-color: var(--bs-body-bg);
  border: 1px solid var(--bs-outline);
  border-top: 0px;
  border-radius: 0px 0px 16px 16px;
  padding-top: 1rem;
  transition: background-color 0.3s ease, border 0.3s ease, box-shadow 0.3s ease, padding-top 0.3s ease;


  >div {
    display: none;
    transition: display 0.3s ease;
  }
}

.boss-dragon:hover {
  background-color: black;
  border: 1px solid var(--bs-outline);
  border-top: 0px;
  border-radius: 0px 0px 16px 16px;
  padding-top: 1rem;

  >div {
    display: block
  }

}

.scrolled {
  background-color: rgba(0, 0, 0, 0);
  border: none;
  box-shadow: none;
  padding-top: 0rem;


}
</style>