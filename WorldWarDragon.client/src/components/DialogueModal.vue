<template>
  <div class="modal fade" id="dialogueModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="dialogueModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">

        <div class="modal-header">
          <h1 v-if="account?.id" class="modal-title fs-5" id="dialogueModalLabel">{{ dialogue[pagination].speaker.name
            }}</h1>
          <button @click="closeCheckSeen()" type="button" class="btn-close" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <div class="container-fluid">

            <div class="row">
              <div v-if="account?.id" class="col-6">
                DialogueLength: {{ dialogue.length }} <br>
                DialogueLevel: {{ dialogue[pagination].levelRequirement }} <br>
                Pagination: {{ pagination }} <br>
                DialogueSeen: {{ dialogueSeen }} <br>
                {{ dialogue[pagination].messages[0] }} <br>
                {{ dialogue[pagination].messages[1] }}
              </div>
              <div v-if="account?.id" class="col-6">
                <img class="img-fluid rounded" :src="dialogue[pagination].speaker.img" alt="">
              </div>
            </div>

          </div>
        </div>

        <div class="modal-footer d-flex justify-content-between">
          <button v-if="pagination > 1" @click="handlePagination(-1)" type="button"
            class="btn btn-secondary">Previous</button>
          <button v-else class="btn btn-dark">Previous</button>
          <button v-if="pagination < dialogue.length - 1" @click="handlePagination(1)" type="button"
            class="btn btn-secondary">Next</button>
          <button v-else class="btn btn-dark">Next</button>
        </div>

      </div>
    </div>
  </div>

</template>


<script>
import { computed, onMounted, ref, watchEffect } from "vue";
import { DIALOGUE_DATA } from '../../../shared/constants/index.js'
import { logger } from "../utils/Logger.js";
import { AppState } from "../AppState.js";
import { Modal } from "bootstrap";
import { accountService } from "../services/AccountService.js";
export default {
  setup() {
    const account = computed(() => AppState.account)
    const pagination = ref(0)
    const dialogueSeen = ref(0)

    watchEffect(() => {
      if (account.value && account.value.dialogueSeen !== undefined) {
        pagination.value = account.value.dialogueSeen;
        dialogueSeen.value = account.value.dialogueSeen;
      }
    });
    return {
      pagination,
      dialogueSeen,
      identity: computed(() => AppState.identity),
      account: computed(() => AppState.account),
      dialogue: computed(() => {
        return DIALOGUE_DATA
          .filter(d => d.levelRequirement <= AppState.account?.level)
      }),

      handlePagination(direction) {
        const newValue = pagination.value + direction;

        if (newValue >= 1 && newValue <= this.dialogue.length - 1) {
          pagination.value = newValue;
          if (newValue > dialogueSeen.value) {
            dialogueSeen.value = newValue;
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


<style lang="scss" scoped></style>