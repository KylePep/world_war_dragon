<template>
  <section class="row text-outline text-2p  g-3 px-5 pt-5 mx-5">

    <div class="col-12 bg-dark p-2">
      <div
        class="boss-dragon-img border border-2 border-light rounded d-flex flex-column justify-content-end text-light"
        :style="{ backgroundImage: `url(${activeBoss.image})` }">
        <div>
          <h1>{{ activeBoss.name }}</h1>
          <h2>{{ activeBoss.hp - activeBoss.damages }}</h2>
        </div>
      </div>
    </div>

    <NewBoss />

    <div class="col-12 bg-dark p-2">
      <p class="my-2">A list of all bosses</p>
      <div v-for="boss in bosses" :key="boss.id" class="d-flex justify-content-between">
        <div>{{ boss.name }} | {{ boss.hp }}</div>
        <button @click="setBossActivity(boss.id)" class="btn btn-secondary">activate: {{ boss.active }}</button>
      </div>
    </div>

    <div class="col-12">
      <div class=" rounded">
        MESSAGES
        <div v-for="message in messages" :key="message.id" class="d-flex justify-content-between bg-dark mb-2">
          <div>{{ message.body }} Room: {{ message.roomId }}</div>
          <div>Creator: {{ message.creator.name }}</div>

          <button class="btn btn-dark text-danger" @click="deleteMessage(message.id)">delete</button>
        </div>
      </div>
    </div>

    <div class="col-12">
      <div class=" rounded">
        ASSISTANCES
        <div v-for="assistance in assistances" :key="assistance.id" class="d-flex justify-content-between bg-dark mb-2">
          <div>{{ assistance.body }}</div>
          <div>Creator: {{ assistance.creator.name }}</div>
          <button class="btn btn-dark text-danger" @click="deleteAssistance(assistance.id)">delete</button>
        </div>
      </div>
    </div>

  </section>
</template>


<script>
import { assistancesService } from "../services/AssistancesService.js";
import { AppState } from "../AppState.js";
import NewMessage from "../components/NewMessage.vue";
import { messagesService } from "../services/MessagesService.js";
import Pop from "../utils/Pop.js";
import { computed, onMounted, watchEffect } from "vue";
import { bossService } from "../services/BossService.js";
import { logger } from "../utils/Logger.js";
import { bossDamageService } from "../services/BossDamageService.js";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();

    onMounted(() => {
      setBgImg();
    });


    const checkAdmin = (activeUserId) => {
      if (!activeUserId) {
        return
      }
      const activeUser = AppState.identity
      logger.log('USER', activeUser, 'ROLE', activeUser.role)

      if (activeUser.role.length == 0 || !activeUser.role.includes('admin')) {
        router.push({ name: "Home" })
      }
    }


    watchEffect(() => {
      checkAdmin(AppState.identity.id)
    })

    const setBgImg = () => {
      const mainElement = document.querySelector('main');
      if (mainElement) {
        let bgImg = '/assets/dragonCave2.jpeg';
        mainElement.style.backgroundImage = `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.90) 100%), url(${bgImg})`;
      }
    }

    async function getMessages() {
      try {
        await messagesService.getMessages()
      } catch (error) {
        Pop.error(error.message)
      }
    }



    async function getAssistances() {
      try {
        await assistancesService.getAssistances()
      } catch (error) {
        Pop.error(error.message)
      }
    }

    async function getBosses() {
      try {
        await bossService.getBosses()
      } catch (error) {
        Pop.error(error.message)
      }
    }

    async function getBossDamageByBossId() {
      try {
        if (AppState.activeBoss.id != null) {
          logger.log('[ActiveBossId]', AppState.activeBoss.id)
          await bossDamageService.getBossDamageByBossId(AppState.activeBoss.id)
        }
      } catch (error) {
        Pop.error(error.message, '[]')
      }
    }

    async function setBossActivity(bossId) {
      try {
        await bossService.setBossActivity(bossId)
      } catch (error) {
        Pop.error(error.message, '[]')
      }
    }

    onMounted(() => {
      getMessages()
      getAssistances()
      getBosses()
      getBossDamageByBossId()
    })


    return {
      async deleteMessage(messageId) {
        try {
          const confirmDelete = await Pop.confirm('Delete?')
          if (!confirmDelete) {
            return
          }
          await messagesService.deleteMessage(messageId)
        } catch (error) {
          Pop.error(error.message, '[]')
        }
      },
      async deleteAssistance(assistanceId) {
        try {
          const confirmDelete = await Pop.confirm('Delete?')
          if (!confirmDelete) {
            return
          }
          await assistancesService.deleteAssistance(assistanceId)
        } catch (error) {
          Pop.error(error.message, '[]')
        }
      },
      messages: computed(() => AppState.messages),
      assistances: computed(() => AppState.assistances),
      activeBoss: computed(() => AppState.activeBoss),
      bosses: computed(() => AppState.bosses),
      setBossActivity

    }
  }
}
</script>


<style lang="scss" scoped>
p {
  padding: 0;
  margin: 0;
}

section {
  font-size: .75rem;
}

.boss-dragon-img {
  font-weight: 400;
  font-style: normal;
  width: 100%;
  height: 40vh;

  >div {
    background-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.593) 40%);
  }

  background-position: center;
  background-size: cover;
}
</style>

<!-- Zarathos the Devourer
Nerathul the Doombringer
Thrakadon the Eternal Flame
Xandros the Night Terror
Gorgathor the Annihilator
Vorgoth the Voidcaller
Mordrath the Desolation
Balroth the Infernal
Draconis the Shadowbane
Azarok the Unyielding -->