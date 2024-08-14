<template>

  <div v-if="account?.id">
    <div v-if="notificationPurpose == 'level' && availableValor >= levelUpRequirement">
      <i class="mdi mdi-alert-circle alert p-0"></i>
    </div>

    <div v-if="notificationPurpose == 'dialogue' && dialogueSeen.id < dialogue.id">
      <i class="mdi mdi-alert-circle alert p-0"></i>
    </div>

    <div v-if="notificationPurpose == 'all' && (availableValor >= levelUpRequirement || dialogueSeen.id < dialogue.id)">
      <i class="mdi mdi-alert-circle alert p-0"></i>
    </div>

  </div>

</template>


<script>
import { DIALOGUE_DATA } from '../../../shared/constants/index.js'
import { computed } from 'vue'
import { AppState } from '../AppState'
import { logger } from "../utils/Logger.js";

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

    const dialogue = computed(() => {
      return DIALOGUE_DATA
        .filter(d => d.levelRequirement <= account.value.level)
        .slice(-1)[0];
    })
    const dialogueSeen = computed(() => {
      logger.log(DIALOGUE_DATA.find((d) => d.id == account.value.dialogueSeen))
      return DIALOGUE_DATA.find((d) => d.id == account.value.dialogueSeen)
    })

    return {
      notificationPurpose,
      account,
      availableValor,
      levelUpRequirement,
      dialogue,
      dialogueSeen

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