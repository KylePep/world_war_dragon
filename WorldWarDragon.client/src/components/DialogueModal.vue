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

            <div class="row message-container px-0">

              <div v-if="account?.id" class="col-6 p-0 img-container">
                <transition name="fade">
                  <img :key="speaker.img" class="img-fluid rounded" :src="speaker.img" alt="">
                </transition>
              </div>

              <div id="messageContainer" v-if="account?.id" class="col-6 bg-dark position-relative messages p-2 pb-0">
                <div v-for="message, index in dialogue[page.pagination].messages" :key="index">
                  <transition>
                    <div v-if="page.reveal >= index" class="message pb-2">
                      <div v-if="message.includes('%')">
                        <span v-if="!message.split(':')[0].includes('!') && !message.split(':')[0].includes('&')"
                          class="name text-uppercase">{{
                            message.split(':')[0].substring(1) }}:</span>
                        {{ message.split(':')[1] }}
                      </div>
                      <div v-else>
                        {{ message }}
                      </div>

                    </div>
                  </transition>
                </div>
              </div>

              <div class="button-container offset-8 col-4  px-0">
                <transition name="fade">
                  <div @click="handleReveal()" class=" btn btn-secondary continue "
                    v-if="account?.id && page.reveal < dialogue[page.pagination].messages.length - 1">
                    Continue
                  </div>

                  <div v-else class=" disabled btn btn-dark continue ">
                    Continue
                  </div>
                </transition>
              </div>
            </div>

            <div class="row px-0 py-3 d-flex justify-content-between btn-pagination align-items-center">

              <div class="button-container col-4 px-0">
                <transition name="slide-up">
                  <button v-if="page.pagination > 1" @click="handlePagination(-1)" type="button"
                    class="btn btn-secondary btn-pagination">Previous</button>

                  <button v-else class="btn btn-dark disabled btn-pagination">Previous</button>

                </transition>
              </div>

              <div class="col-4 text-center">CHAPTER: {{ page.pagination }}</div>

              <div class="button-container col-4 px-0">
                <transition name="slide-up">

                  <button v-if="page.pagination < dialogue.length - 1" @click="handlePagination(1)" type="button"
                    class="btn btn-secondary btn-pagination">Next</button>

                  <button v-else class="btn btn-dark disabled btn-pagination">Next</button>

                </transition>
              </div>
            </div>

          </div>

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
        if (page.value.reveal == 0) {
          return SPEAKER_DATA.find((s) => s.nickName == DIALOGUE_DATA[page.value.pagination].speaker)
        } else {
          const currentMessage = DIALOGUE_DATA[page.value.pagination].messages[page.value.reveal]
          const match = currentMessage.match(/%[!&]*([^!&:]+):/)
          logger.log(match)
          if (match == null) {
            return SPEAKER_DATA.find((s) => s.nickName == DIALOGUE_DATA[page.value.pagination].speaker)
          } else {
            return SPEAKER_DATA.find((s) => s.nickName == match[1])
          }
        }
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
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  position: absolute;
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.button-container {
  display: inline-block;
  position: relative;
  height: 1rem;

  >button {
    position: absolute;
    width: 100%;
  }
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease-in-out;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-30px);
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

.img-container>img {
  height: 30vh;
  width: auto;
}

.messages {
  height: 30vh;
  overflow-y: scroll;
}

.message {
  font-size: 0.5rem;
}

.name {
  font-size: 0.6rem;
}

.continue {
  font-size: 0.6rem;
  width: 100%;
}

.btn-pagination {
  font-size: 0.6rem;
}
</style>