<template>
  <div class="col-12 bg-dark p-3">
    <div>CREATE A BOSS</div>
    <img class="boss-dragon-img" :src="editable.image ? editable.image : '/assets/scales.jpeg'" alt="">
    <form @submit.prevent="createBoss()" class="d-flex align-items-center">
      <input class="form-control" v-model="editable.name" name="name" id="name" placeholder="NAME"></input>
      <input class="form-control" v-model="editable.hp" name="hp" id="hp" placeholder="HP"></input>
      <input class="form-control" v-model="editable.image" name="image" id="image" placeholder="IMAGE"></input>
      <input class="form-check" v-model="editable.active" type="checkbox" name="active" id="active"></input>
      <button type="submit" class="btn btn-success">Create</button>
    </form>

  </div>
</template>


<script>
import { bossService } from "../services/BossService.js";
import Pop from "../utils/Pop.js";
import { ref } from 'vue'
export default {
  setup() {
    const editable = ref({})
    editable.value.active = true

    return {
      editable,

      async createBoss() {
        try {
          const bossData = editable.value
          await bossService.createBoss(bossData)
          editable.value = {}
        } catch (error) {
          Pop.error(error.message, '[]')
        }
      }
    }
  }
}
</script>


<style lang="scss" scoped>
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