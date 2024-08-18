<template>

  <section class="row mt-3">
    <div class="col-12 fs-5 text-center fs-4 text-2p fw-bold">
      UNLOCKS
    </div>
    <div v-for="index in 9" :key="index" class="col-4">
      {{ index }}
    </div>
  </section>

</template>


<script>
export default {
  setup() {
    return {}
  }
}
</script>


<style lang="scss" scoped></style>