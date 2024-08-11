<template>
  <section class="row mt-3">

    <div class="col-10 mx-auto boons text-outline text-light">
      <h2 class="mb-4">BOONS</h2>
      <p class="text-center text-2p fs-6">Purchase a boon to increase the stats of everyone fighting in
        {{ activeRoom.name }} and gain EXP </p>

    </div>


    <div class="col-11 mx-auto ">
      <NewMessage :messageProp="{ cost: 100 * activeRoom.difficulty }" />
      <div class="p-2 fs-6 room-container ">
        <p class="mb-0">{{ activeRoom.name }} Total Boons</p>
        <span>
          Gold: {{ AppState.goldMod[activeRoom.id] }}
        </span>
        <span>
          Health: {{ AppState.healthMod[activeRoom.id] }}
        </span>
        <span>
          Luck: {{ AppState.luckMod[activeRoom.id] }}
        </span>
        <span>
          Power: {{ AppState.powerMod[activeRoom.id] }}
        </span>
      </div>
      <div class="message-container border border-2 border-light rounded">
        <div v-for="message in messages" :key="message.id"
          class="room-container text-outline-bg px-3 d-flex justify-content-between align-items-center">
          <div>
            <i :class="message.boon == 'power' ? 'mdi mdi-weight-lifter' : 'd-none'"></i>
            <i :class="message.boon == 'luck' ? 'mdi mdi-clover' : 'd-none'"></i>
            <i :class="message.boon == 'health' ? 'mdi mdi-heart' : 'd-none'"></i>
            <i :class="message.boon == 'gold' ? 'mdi mdi-circle-multiple' : 'd-none'"></i>
            <div class="d-none d-md-inline ps-3">
              {{ message.boon }}
            </div>
          </div>
          <div class="ps-2">{{ message.body }}</div>
          <div class="ps-2">{{ message?.creator?.name }}</div>

        </div>
      </div>

    </div>
    <!-- <div class="col-6 room-container border border-light rounded fs-5 fw-bold text-start">
  <p>
    Dragons defeated: 0000

  </p>
  <p>
    Damage done to boss Dragon: 0000

  </p>
  <p>
    Gold collected: 0000

  </p>
  <p>
    Gold lost: 0000

  </p>

  <p>
    Losses: 0000
  </p>
</div> -->

  </section>
</template>


<script>
import { AppState } from "../AppState.js";
import { computed, onMounted, onUnmounted } from "vue";
import { MAP_DATA } from '../../../shared/constants/index.js'
import Pop from "../utils/Pop.js";
import { assistancesService } from "../services/AssistancesService.js";
import { messagesService } from "../services/MessagesService.js";
import { logger } from "../utils/Logger.js";
import NewMessage from "../components/NewMessage.vue";
import NewAssistance from "../components/NewAssistance.vue";
export default {
  setup() {

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

      messages: computed(() => AppState.messages.filter((m) => m.roomId == AppState.activeRoom.id).reverse()),

      activeRoom: computed(() => AppState.activeRoom),
      account: computed(() => AppState.account),
      AppState: computed(() => AppState),

      setActiveRoom,

      async deleteMessage(messageId) {
        try {
          const confirmDelete = await Pop.confirm('Delete?')
          if (!confirmDelete) {
            return
          }
          await messagesService.deleteMessage(messageId)
        } catch (error) {
          Pop.error(error.message, '[]')
        }
      }

    }
  }
}
</script>


<style lang="scss" scoped></style>