<template>

  <section class="row">
    <div class="col-12 fs-1 fw-bold text-center text-light mt-3 mb-3 text-2p text-outline">
      <h1 v-if="!activeRoom.name || activeRoom.id == 0" class="fs-1 fw-bold text-center text-light">
        Map of Centeria
        <p class="text-center text-2p fs-6">-Select an area-</p>
      </h1>

      <h1 v-else class="fs-1 fw-bold text-center text-light ">
        {{ activeRoom.name }}
        <p class="text-center text-2p fs-6">-The {{ activeRoom.name }} war room-</p>
      </h1>
    </div>
  </section>

  <section v-if="!activeRoom.name || activeRoom.id == 0"
    class="row position-relative map text-2p text-outline mx-auto mx-3">
    <div @click="setActiveRoom(5)" class="position-absolute top-50 start-50 translate-middle map-section map-center">
      Centeria
      <br>
      Assistance
    </div>
    <div @click="setActiveRoom(1)" class="col-6 map-section">
      Toleftios
      <section class="row mx-0 mx-md-2">
        <i class="col-12 col-md-6 mdi mdi-circle-multiple">: {{ AppState.goldMod[1] }}</i>
        <i class="col-12 col-md-6 mdi mdi-heart">: {{ AppState.healthMod[1] }}</i>
        <i class="col-12 col-md-6 mdi mdi-clover">: {{ AppState.luckMod[1] }}</i>
        <i class="col-12 col-md-6 mdi mdi-weight-lifter">: {{ (AppState.powerMod[1]).toFixed(1) }}</i>
      </section>
    </div>
    <div @click="setActiveRoom(2)" class="col-6 map-section">
      Rysto
      <section class="row mx-0 mx-md-2">
        <i class="col-12 col-md-6 mdi mdi-circle-multiple">: {{ AppState.goldMod[2] }}</i>
        <i class="col-12 col-md-6 mdi mdi-heart">: {{ AppState.healthMod[2] }}</i>
        <i class="col-12 col-md-6 mdi mdi-clover">: {{ AppState.luckMod[2] }}</i>
        <i class="col-12 col-md-6 mdi mdi-weight-lifter">: {{ (AppState.powerMod[2]).toFixed(1) }}</i>
      </section>
    </div>
    <div @click="setActiveRoom(3)" class="col-6 map-section">
      Lendbom
      <section class="row mx-0 mx-md-2">
        <i class="col-12 col-md-6 mdi mdi-circle-multiple">: {{ AppState.goldMod[3] }}</i>
        <i class="col-12 col-md-6 mdi mdi-heart">: {{ AppState.healthMod[3] }}</i>
        <i class="col-12 col-md-6 mdi mdi-clover">: {{ AppState.luckMod[3] }}</i>
        <i class="col-12 col-md-6 mdi mdi-weight-lifter">: {{ (AppState.powerMod[3]).toFixed(1) }}</i>
      </section>
    </div>
    <div @click="setActiveRoom(4)" class="col-6 map-section">
      Boghir
      <section class="row mx-0 mx-md-2">
        <i class="col-12 col-md-6 mdi mdi-circle-multiple">: {{ AppState.goldMod[4] }}</i>
        <i class="col-12 col-md-6 mdi mdi-heart">: {{ AppState.healthMod[4] }}</i>
        <i class="col-12 col-md-6 mdi mdi-clover">: {{ AppState.luckMod[4] }}</i>
        <i class="col-12 col-md-6 mdi mdi-weight-lifter">: {{ (AppState.powerMod[4]).toFixed(1) }}</i>
      </section>
    </div>
  </section>

  <section v-else class="row d-flex justify-content-center text-2p text-outline text-center">
    <div class="col-12">
      <button @click="setActiveRoom(0)" class=" btn room-container text-outline-bg text-light">TO
        MAP</button>
    </div>


    <div v-if="activeRoom.id != 5" class=" col-12 d-flex flex-column justify-content-center align-items-center">
      <MapRoom />
    </div>


    <div v-else class="col-12 d-flex flex-column justify-content-center align-items-center">
      <CenteriaRoom />
    </div>
  </section>

</template>


<script>
import { AppState } from "../AppState.js";
import { computed, onMounted, onUnmounted } from "vue";
import { MAP_DATA } from '../../../shared/constants/index.js'
import Pop from "../utils/Pop.js";
import { assistancesService } from "../services/AssistancesService.js";
import { messagesService } from "../services/MessagesService.js";


export default {
  setup() {
    async function getMessages() {
      try {
        await messagesService.getMessages()
      } catch (error) {
        Pop.error(error.message)
      }
    }



    async function getAssistances() {
      try {
        await assistancesService.getAssistances()
      } catch (error) {
        Pop.error(error.message)
      }
    }

    onMounted(() => {
      getMessages()
      getAssistances()
      setBgImg();
      AppState.activeRoom = {}
    });
    onUnmounted(() => {
      setActiveRoom(0)
    })

    let bgImg = 'https://images.unsplash.com/photo-1569470451072-68314f596aec?q=80&w=1031&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
    const setBgImg = () => {
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.style.backgroundImage = `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.90) 100%), url(${bgImg})`;
      }

    }

    function setBg(roomId) {
      if (roomId != 0) {
        bgImg = AppState.activeRoom.bgImage
      }
      else {
        bgImg = 'https://images.unsplash.com/photo-1569470451072-68314f596aec?q=80&w=1031&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      }
    }



    function setActiveRoom(roomId) {
      if (roomId != 0) {
        AppState.activeRoom = MAP_DATA.find((m) => m.id == roomId);
      }
      else {
        AppState.activeRoom = { id: 0 }
      }
      setBg(roomId)
      setBgImg()
    }
    return {

      activeRoom: computed(() => AppState.activeRoom),
      account: computed(() => AppState.account),
      AppState: computed(() => AppState),

      setActiveRoom,


    }
  }
}
</script>


<style lang="scss">
.map {
  font-size: 2vh;
  background-image: url('/assets/map4.jpeg');
  background-position: center;
  background-repeat: none;
  background-size: cover;

  width: auto;
  height: 512px;
  max-width: 1024px;
}

.map-center {
  width: 50%;
}

.map-section {
  cursor: pointer;
  text-align: center;
  font-weight: bolder;
  color: white;
  flex-grow: 1;
  transition: all 300ms ease-in-out;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  >section {
    font-size: .75rem;
    margin-top: 1rem;
    background-color: rgba(0, 0, 0, 0.423);
    border-radius: 4px;
    border: 2px solid white;
    padding: 4px 0px;
    text-align: start;
  }
}

.map-section:hover {
  text-shadow: 3px 3px 5px black;
  background: radial-gradient(circle, rgba(250, 248, 233, 0.248) 0%, rgba(248, 246, 225, 0.083) 17%, rgba(255, 255, 255, 0) 55%, rgba(58, 64, 73, 0) 100%);
}

.room-size {
  max-height: 100vh;
}

.room-container {
  background-color: var(--bs-body-bg);
  border: solid 1px var(--bs-outline);
  border-radius: 4px;
}

.message-container {
  overflow-y: auto;
  max-height: 33vh;
}

.boons {
  font-size: .1rem;
}
</style>
