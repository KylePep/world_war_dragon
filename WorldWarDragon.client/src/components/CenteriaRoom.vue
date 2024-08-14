<template>
  <section class="row mt-3">

    <div class="col-11 col-md-8 col-lg-7 mx-auto">
      <h2 class="text-light my-4">Assistance</h2>
      <p class="text-center text-2p">Offer items in exchange for experience or claim them to prepare for battle</p>
    </div>

    <div class="col-11 col-md-8 col-lg-7 mx-auto">
      <div class="row">

        <NewAssistance />

        <div class="col-6 pe-1 ps-0 mt-3">
          <div v-for="assistance in uniqueUnclaimedAssistances" :key="assistance.id"
            class="room-container px-3 d-flex align-items-center justify-content-between text-light py-1 mb-2">
            <i :class="assistance.body == 'attack' ? 'mdi mdi-sword-cross' : 'd-none'"></i>
            <i :class="assistance.body == 'shield' ? 'mdi mdi-shield-sun' : 'd-none'"></i>
            <i :class="assistance.body == 'heal' ? 'mdi mdi-bottle-tonic-plus' : 'd-none'"></i>
            <div>{{ assistance.body }}</div>
            <div> {{ assistance?.creator?.name }}</div>

            <button v-if="account?.id && assistance.creatorId != account?.id && assistance
              .claim == false"
              class="selectable d-flex btn justify-content-between align-items-center text-outline text-secondary py-0"
              @click="
                claimAssistance(assistance.id)">
              <i class="mdi mdi-download"></i>
              <div class="d-none d-lg-block ps-3">ClAIM</div>
            </button>
          </div>
        </div>

        <div class="col-6 pe-0 ps-1 mt-3 ">
          <div v-for="assistance in uniqueClaimedAssistances" :key="assistance.id"
            class="room-container background-bg px-3 text-danger d-flex justify-content-between align-items-center mb-2">
            <i :class="assistance.body == 'attack' ? 'mdi mdi-sword-cross' : 'd-none'"></i>
            <i :class="assistance.body == 'shield' ? 'mdi mdi-shield-sun' : 'd-none'"></i>
            <i :class="assistance.body == 'heal' ? 'mdi mdi-bottle-tonic-plus' : 'd-none'"></i>
            <div>{{ assistance.body }}</div>
            <div> {{ assistance?.creator?.name }}</div>
          </div>

        </div>

      </div>


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

      uniqueUnclaimedAssistances: computed(() => {
        const seen = new Set();
        const assistancesClaimed = AppState.assistances.filter((a) => a.claim == false)
        return assistancesClaimed.filter(assistance => {
          const key = `${assistance.creator.name}-${assistance.body}`;
          if (!seen.has(key)) {
            seen.add(key);
            return true;
          }
          return false;
        });
      }),

      uniqueClaimedAssistances: computed(() => {
        const seen = new Set();
        const assistancesClaimed = AppState.assistances.filter((a) => a.claim == true)
        return assistancesClaimed.filter(assistance => {
          const key = `${assistance.creator.name}-${assistance.body}`;
          if (!seen.has(key)) {
            seen.add(key);
            return true;
          }
          return false;
        });
      }),

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
      },
      async deleteAssistance(assistanceId) {
        try {
          const confirmDelete = await Pop.confirm('Delete?')
          if (!confirmDelete) {
            return
          }
          await assistancesService.deleteAssistance(assistanceId)
        } catch (error) {
          Pop.error(error.message, '[]')
        }
      },
      async claimAssistance(assistanceId) {
        try {
          const confirmClaim = await Pop.confirm('Claim?')
          if (!confirmClaim) {
            return
          }
          await assistancesService.claimAssistance(assistanceId)
        } catch (error) {
          Pop.error(error.message, '[]')
        }
      },

    }
  }
}
</script>


<style lang="scss" scoped></style>