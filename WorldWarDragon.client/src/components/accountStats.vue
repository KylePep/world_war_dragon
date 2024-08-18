<template>

  <section class="row mt-3">
    <div class="col-12 col-md-6 fs-5 text-center">
      <div class="fs-4 text-2p fw-bold">
        STATS
      </div>
      <div class="mdi mdi-crown">
        Dragons Defeated: {{ account?.dragons || 0 }}
      </div>
      <div class="mdi mdi-circle-multiple">
        Gold: {{ account?.gold || 0 }}
      </div>
      <div class="mdi mdi-medal">
        Valor (Career Exp) : {{ account?.valor || 0 }}
      </div>
      <div class="mdi mdi-medal">
        EXP: {{ availableValor - valorSpend }}
      </div>
      <div class="mdi mdi-heart">
        Health: {{ account?.health || 0 }}
      </div>
      <div class="mdi mdi-weight-lifter">
        Power: {{ account?.power || 0 }}
      </div>
    </div>
    <div class="col-12 col-md-6 fs-5 text-center">
      <div class="fs-4 text-2p fw-bold">
        INVENTORY
      </div>
      <div class="mdi mdi-sword-cross">
        Attack: {{ account?.attack }}
      </div>
      <div class="mdi mdi-shield-sun">
        shield: {{ account?.shield }}
      </div>
      <div class="mdi mdi-bottle-tonic-plus">
        heal: {{ account?.heal }}
      </div>
    </div>
  </section>

</template>


<script>
import { AppState } from "../AppState.js";
import { computed } from "vue";

export default {
  props: {
    statProp: { type: Object }
  },
  setup(props) {
    const valorSpend = computed(() => props.statProp.valorSpend)
    return {
      valorSpend,
      account: computed(() => AppState.account),
      availableValor: computed(() => {
        if (AppState.account?.valor) {
          return AppState.account.valor - AppState.account.valorSpent
        } else return 0
      }),
    }
  }
}
</script>


<style lang="scss" scoped></style>