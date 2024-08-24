<template>
  <div class="full-page d-flex flex-column justify-content-around">
    <section class="row">
      <div class="col-12 col-md-6 offset-0 offset-md-3 text-center d-flex justify-content-center ">
        <h1 class="hero-title text-outline p-3">WORLD <br> WAR <br> DRAGON</h1>
      </div>
      <div class="col-12 col-md-3 text-2p text-outline">
        <p class="mb-0">Latest: </p>
        <div v-if="latestMessage.creator">
          <i :class="{ 'mdi mdi-weight-lifter': latestMessage.boon == 'power' }"></i>
          <i :class="{ 'mdi mdi-clover': latestMessage.boon == 'luck' }"></i>
          <i :class="{ 'mdi mdi-heart': latestMessage.boon == 'health' }"></i>
          <i :class="{ 'mdi mdi-circle-multiple': latestMessage.boon == 'gold' }"></i>
          {{ latestMessage.body }} -
          {{ latestMessage.creator.name }}
        </div>
      </div>
    </section>

    <section class="row g-3">
      <div class="col-12 text-center d-flex justify-content-center">
        <div class="boss-dragon-img border border-2 border-light rounded d-flex flex-column justify-content-end"
          :style="{ backgroundImage: `url(${activeBoss.image})` }">
          <div class="pt-5 text-outline-bg ">
            <h4 class="px-5">{{ activeBoss.name }}</h4>


            <div class=" px-0 progress bg-dark rounded-0" style="height: fit-content;" role="progressbar"
              aria-label="Example 20px high" :title="`${((activeBoss.hp - activeBoss.damages) / activeBoss.hp) * 100}%`"
              aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
              <div class="progress-bar boss-bar py-1"
                :style="{ width: `${((activeBoss.hp - activeBoss.damages) / activeBoss.hp) * 100}%` }">
                <h5 class="mb-0">{{ Math.round(activeBoss.hp - activeBoss.damages) }}</h5>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div class="col-12">

      </div>



    </section>


    <section class="row g-2">

      <div class="col-6 col-md-2 order-2 order-md-1 offset-0 offset-md-2 d-flex justify-content-center ">
        <router-link :to="{ name: 'Map' }" class="btn fight-btn text-outline w-100 p-3 fw-bold">MAP</router-link>
      </div>


      <div class="col-12 col-md-4 order-1 order-md-2">

        <div v-if="account?.id" class="d-flex justify-content-center ">
          <router-link :to="{ name: 'Game' }" class="btn fight-btn text-outline p-3 fs-3 w-100 fw-bold ">JOIN THE
            FIGHT!</router-link>
        </div>

        <div v-else class="d-flex justify-content-center ">
          <div class="btn fight-btn text-outline p-3 fs-1 w-100 fw-bold" @click="login" v-if="!identity">
            Login
          </div>
        </div>

      </div>

      <div class="col-6 col-md-2 order-3 d-flex justify-content-center ">
        <router-link :to="{ name: 'Score' }" class="btn fight-btn text-outline p-3 w-100 fw-bold">HALL OF
          VALOR</router-link>
      </div>

    </section>

  </div>
</template>


<script>
import { AppState } from "../AppState.js";
import Pop from "../utils/Pop.js";
import { computed, onMounted, watchEffect } from "vue";
import { logger } from "../utils/Logger.js";
import { AuthService } from '../services/AuthService'
import { messagesService } from "../services/MessagesService.js";

export default {
  setup() {

    async function getLatestMessage() {
      try {
        await messagesService.getLatestMessage()
      } catch (error) {
        Pop.error(error.message)
      }
    }

    onMounted(() => {
      setBgImg();
      getLatestMessage()
    });

    const setBgImg = () => {
      const mainElement = document.querySelector('main');
      if (mainElement) {
        let bgImg = '/assets/towerbg4.jpeg';
        mainElement.style.backgroundImage = `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.90) 100%), url(${bgImg})`;
      }
    }


    return {
      identity: computed(() => AppState.identity),
      account: computed(() => AppState.account),
      activeBoss: computed(() => AppState.activeBoss),
      latestMessage: computed(() => AppState.latestMessage),
      bosses: computed(() => AppState.bosses),

      async login() {
        AuthService.loginWithRedirect()
      },
      async logout() {
        AuthService.logout({ returnTo: window.location.origin })
      }

    }
  }
}
</script>


<style lang="scss" scoped>
.full-page {
  height: 100vh;
}

.hero-title {
  font-family: "Press Start 2P", system-ui;
  font-weight: 400;
  font-style: normal;
  font-size: 6vh;

  text-shadow: rgb(0, 0, 0) 2px 0px 0px, rgb(0, 0, 0) 1.75517px 0.958851px 0px, rgb(0, 0, 0) 1.0806px 1.68294px 0px, rgb(0, 0, 0) 0.141474px 1.99499px 0px, rgb(0, 0, 0) -0.832294px 1.81859px 0px, rgb(0, 0, 0) -1.60229px 1.19694px 0px, rgb(0, 0, 0) -1.97998px 0.28224px 0px, rgb(0, 0, 0) -1.87291px -0.701566px 0px, rgb(0, 0, 0) -1.30729px -1.5136px 0px, rgb(0, 0, 0) -0.421592px -1.95506px 0px, rgb(0, 0, 0) 0.567324px -1.91785px 0px, rgb(0, 0, 0) 1.41734px -1.41108px 0px, rgb(0, 0, 0) 1.92034px -0.558831px 0px;
  color: #ff7300;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease-in-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.fight-btn {
  background-color: var(--bs-body-bg);
  border: 2px solid white;
  font-family: "Press Start 2P", system-ui;
  color: var(--bs-light);
  display: flex;
  justify-content: center;
  align-items: center;
}

.fight-btn:hover {
  color: var(--bs-secondary);
}

.boss-dragon-img {
  font-family: "Press Start 2P", system-ui;
  font-weight: 400;
  font-style: normal;
  width: auto;
  height: 30vh;

  >div {
    background-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.593) 40%);
  }

  background-position: center;
  background-size: cover;
}

.boss-bar {
  background-color: #c51010;
}
</style>