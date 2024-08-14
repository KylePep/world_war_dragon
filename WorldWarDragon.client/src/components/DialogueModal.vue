<template>
  <div class="modal fade" id="dialogueModal" tabindex="-1" aria-labelledby="dialogueModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">

        <div class="modal-header">
          <h1 class="modal-title fs-5" id="dialogueModalLabel">{{ dialogue[pagination].speaker.name }}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <div class="container-fluid">

            <div class="row">
              <div class="col-6">
                {{ dialogue[pagination].messages[0] }}
                {{ dialogue[pagination].messages[1] }}
              </div>
              <div class="col-6">
                <img class="img-fluid rounded" :src="dialogue[pagination].speaker.img" alt="">
              </div>
            </div>

          </div>
        </div>

        <div class="modal-footer d-flex justify-content-between">
          <button @click="handlePagination(-1)" type="button" class="btn btn-secondary">Previous</button>
          <button @click="handlePagination(1)" type="button" class="btn btn-secondary">Next</button>
        </div>

      </div>
    </div>
  </div>

</template>


<script>
import { computed, ref } from "vue";
import { DIALOGUE_DATA } from '../../../shared/constants/index.js'
import { logger } from "../utils/Logger.js";
export default {
  setup() {
    const pagination = ref(0)
    return {
      pagination,
      dialogue: computed(() => DIALOGUE_DATA),

      handlePagination(direction) {
        logger.log('here')
        pagination.value += direction;
      }
    }
  }
}
</script>


<style lang="scss" scoped></style>