<template>
  <div class="modal fade" id="dialogueModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="dialogueModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content border-3 border-light rounded-2 text-2p">

        <div class="p-3 d-flex justify-content-between align-items-center">
          <h1 v-if="account?.id" class="modal-title fs-6" id="dialogueModalLabel">{{
            speaker.name
          }}</h1>
          <button @click="closeCheckSeen()" type="button" class="btn-close" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <div class="container-fluid">

            <div class="row message-container">

              <div v-if="account?.id" class="col-6 ">
                <img class="img-fluid rounded" :src="speaker.img" alt="">


              </div>

              <div id="messageContainer" v-if="account?.id" class="col-6 bg-dark position-relative messages p-2 pb-0">
                <div v-for="message, index in dialogue[page.pagination].messages" :key="index">
                  <div v-if="page.reveal >= index" class="message">
                    {{ message }}
                  </div>
                </div>
              </div>
              <div @click="handleReveal()" class="offset-6 col-6 btn btn-secondary continue"
                v-if="account?.id && page.reveal < dialogue[page.pagination].messages.length - 1">
                Continue
              </div>

              <div v-else class="offset-6 col-6 disabled btn btn-dark continue">
                Continue
              </div>
            </div>

          </div>
        </div>

        <div class="p-3 d-flex justify-content-between btn-pagination align-items-center">
          <button v-if="page.pagination > 1" @click="handlePagination(-1)" type="button"
            class="btn btn-secondary">Previous</button>
          <button v-else class="btn btn-dark disabled btn-pagination">Previous</button>
          <div>CHAPTER: {{ page.pagination }}</div>
          <button v-if="page.pagination < dialogue.length - 1" @click="handlePagination(1)" type="button"
            class="btn btn-secondary">Next</button>
          <button v-else class="btn btn-dark disabled btn-pagination">Next</button>
        </div>

      </div>
    </div>
  </div>

</template>


<script>
import { computed, onMounted, ref, watchEffect } from "vue";
import { DIALOGUE_DATA, SPEAKER_DATA } from '../../../shared/constants/index.js'
import { logger } from "../utils/Logger.js";
import { AppState } from "../AppState.js";
import { Modal } from "bootstrap";
import { accountService } from "../services/AccountService.js";
export default {
  setup() {
    const account = computed(() => AppState.account)
    const page = ref({ pagination: 0, reveal: 0 })
    const dialogueSeen = ref(0)

    watchEffect(() => {
      if (account.value && account.value.dialogueSeen !== undefined) {
        page.value.pagination = account.value.dialogueSeen;
        dialogueSeen.value = account.value.dialogueSeen;
      }
    });
    return {
      page,
      dialogueSeen,
      identity: computed(() => AppState.identity),
      account: computed(() => AppState.account),
      dialogue: computed(() => {
        return DIALOGUE_DATA
          .filter(d => d.levelRequirement <= AppState.account?.level)
      }),
      speaker: computed(() => {
        return SPEAKER_DATA.find((s) => s.nickName == DIALOGUE_DATA[page.value.pagination].speaker)
      }),

      handlePagination(direction) {
        const newValue = page.value.pagination + direction;

        if (newValue >= 1 && newValue <= this.dialogue.length - 1) {
          page.value.pagination = newValue;
          page.value.reveal = 0;
          if (newValue > dialogueSeen.value) {
            dialogueSeen.value = newValue;
          }
        }
      },
      handleReveal() {
        page.value.reveal++
        const element = document.getElementById('messageContainer')
        if (element) {
          const isScrollable = element.scrollHeight > element.clientHeight;
          if (isScrollable) {
            element.scrollTop = element.scrollHeight; // Scroll to the bottom
          }
        }
      },

      async updateDialogueSeen() {
        try {
          const dialogueSeen = this.dialogueSeen
          await accountService.editAccount({ dialogueSeen: dialogueSeen })
        } catch (error) {
          Pop.error(error.message, '[]')
        }
      },

      closeCheckSeen() {
        if (AppState.account.dialogueSeen < dialogueSeen.value) {
          this.updateDialogueSeen()
        }
        Modal.getOrCreateInstance('#dialogueModal').hide()
      }


    }
  }
}
</script>


<style lang="scss" scoped>
.message-container {
  // height: 20vh;
}

.messages {
  height: 30vh;
  overflow-y: scroll;
}

.message {
  font-size: 0.5rem;
}

.continue {
  font-size: 0.6rem;
}

.btn-pagination {
  font-size: 0.6rem;
}
</style>