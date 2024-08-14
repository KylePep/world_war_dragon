<template>

  <div v-if="account?.id">

    <div v-if="notificationPurpose == 'level' && availableValor >= levelUpRequirement">
      <i class="mdi mdi-alert-circle alert p-0"></i>
    </div>

    <div v-if="notificationPurpose == 'dialogue'">
      <i class="mdi mdi-alert-circle alert p-0"></i>
    </div>

    <div v-if="notificationPurpose == 'all' && (availableValor >= levelUpRequirement)">
      <i class="mdi mdi-alert-circle alert p-0"></i>
    </div>

  </div>

</template>


<script>
import { computed } from 'vue'
import { AppState } from '../AppState'

export default {
  props: {
    notificationProp: { type: String }
  },

  setup(props) {
    const notificationPurpose = computed(() => props.notificationProp)
    const account = computed(() => AppState.account)
    const availableValor = computed(() => {
      const valor = account.value.valor || 0;
      const valorSpent = account.value.valorSpent || 0;
      return valor - valorSpent;
    });

    const levelUpRequirement = computed(() => {
      const level = account.value.level || 0;
      return Math.round(((level) * 2 + 1) * 100);
    });
    return {
      notificationPurpose,
      account,
      availableValor,
      levelUpRequirement
    }
  }
}
</script>


<style lang="scss" scoped>
.alert {
  position: absolute;
  top: -10px;
  right: -5px;
  color: rgb(64, 255, 0);
  text-shadow: 1px 1px black;
}
</style>