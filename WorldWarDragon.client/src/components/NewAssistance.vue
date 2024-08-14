<template>

  <form v-if="account?.id" @submit.prevent="createAssistance()"
    class="col-12 form-container p-3 text-outline-bg px-5 py-4">
    <div class="row mb-3">
      <div class="col-12 mb-2">
        Your Inventory:
      </div>
      <div class="col-12 col-md-4">ATTACK: {{ account.attack }} </div>
      <div class="col-12 col-md-4">SHIELD: {{ account.shield }}</div>
      <div class="col-12 col-md-4">HEAL: {{ account.heal }}</div>
    </div>

    <div class="row mb-3">
      <div class="col-12">Receive 1000 <br> EXP per Assistance</div>

    </div>

    <div class="row">

      <div class="col-12 col-md-4 d-flex justify-content-center form-check">
        <input v-model="editable.body" value="attack" class="form-check-input" type="radio" name="body" id="body1"
          required>
        <label class="form-check-label px-2" for="body1">
          ATTACK
        </label>
      </div>

      <div class="col-12 col-md-4 d-flex justify-content-center form-check">
        <input v-model="editable.body" value="shield" class="form-check-input" type="radio" name="body" id="body2">
        <label class="form-check-label px-2" for="body2">
          SHIELD
        </label>
      </div>

      <div class="col-12 col-md-4 d-flex justify-content-center form-check">
        <input v-model="editable.body" value="heal" class="form-check-input" type="radio" name="body" id="body4">
        <label class="form-check-label px-2" for="body4">
          HEAL
        </label>
      </div>

    </div>

    <div class="row mt-3">
      <button v-if="account[editable.body] > 0" type="submit" class="col-12 btn btn-secondary text-outline text-light">
        Give
        Assist</button>

      <div v-if="!editable.body" class="col-12 btn btn-dark text-outline">Select an
        item</div>

      <div v-if="account[editable.body] == 0" class="col-12 btn btn-danger text-outline">Not enough Items </div>

    </div>


  </form>
</template>


<script>
import { AppState } from "../AppState.js";
import { assistancesService } from "../services/AssistancesService.js";
import Pop from "../utils/Pop.js";
import { computed, ref } from 'vue'
export default {
  setup() {
    const editable = ref({})
    editable.value.roomId = 1

    return {
      editable,
      account: computed(() => AppState.account),
      async createAssistance() {
        try {
          const assistanceData = editable.value
          await assistancesService.createAssistance(assistanceData)
          editable.value = {}
          editable.value.roomId = 1
        } catch (error) {
          Pop.error(error.message, '[]')
        }
      }
    }
  }
}
</script>


<style lang="scss" scoped>
.form-container {
  background-color: var(--bs-background);
  border: solid 2px var(--bs-outline);
  border-radius: 4px;
}
</style>