<template>
  <div class="modal fade" id="dialogueModal" tabindex="-1" aria-labelledby="dialogueModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">

        <div class="modal-header">
          <h1 v-if="account?.id" class="modal-title fs-5" id="dialogueModalLabel">{{ dialogue[pagination].speaker.name
            }}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <div class="container-fluid">

            <div class="row">
              <div v-if="account?.id" class="col-6">
                {{ pagination }}
                {{ dialogueSeen }}
                {{ dialogue[pagination].messages[0] }}
                {{ dialogue[pagination].messages[1] }}
              </div>
              <div v-if="account?.id" class="col-6">
                <img class="img-fluid rounded" :src="dialogue[pagination].speaker.img" alt="">
              </div>
            </div>

          </div>
        </div>

        <div class="modal-footer d-flex justify-content-between">
          <button v-if="pagination > 0" @click="handlePagination(-1)" type="button"
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
export default {
  setup() {
    const account = computed(() => AppState.account)
    const pagination = ref(0)

    watchEffect(() => {
      if (account.value && account.value.dialogueSeen !== undefined) {
        pagination.value = account.value.dialogueSeen;
      }
    });
    return {
      account,
      pagination,
      dialogueSeen: computed(() => AppState.account.dialogueSeen),
      dialogue: computed(() => DIALOGUE_DATA),

      handlePagination(direction) {
        const newValue = pagination.value + direction;
        if (newValue >= 0 && newValue <= this.dialogue.length - 1) {
          pagination.value = newValue;
          if (newValue > AppState.account.dialogueSeen) {
            AppState.account.dialogueSeen = newValue
          }
        }
      }
    }
  }
}
</script>


<style lang="scss" scoped></style>