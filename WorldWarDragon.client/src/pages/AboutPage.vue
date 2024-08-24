<template>
  <section class="row g-3 mx-5 text-V text-outline-bg">

    <div class="col-12 text-2p text-outline fs-1 fw-bold text-center ">
      About World War Dragon
    </div>

    <div class="col-12 d-flex flex-column align-items-center">
      <section class="row lore-card border border-2 border-light rounded-4 ">
        <!-- <div class="col-12 col-md-6 px-0">
          <img class="img-fluid rounded-4" src="/assets/dragonPortal.jpeg" alt="">
        </div> -->
        <div class="col-12 col-md-12 lore-content p-3 pb-0">
          <h3>WWD began as an entry in CodeWorks 2024 Summer Hackathon</h3>
          <p>
            It took second place in the hackathon, it had a LOT less polish and features at the time.
          </p>
          <p>
            I've continued to work on it because, well because I really enjoyed it. It's a fairly in depth fullstack
            application and has been an excellent training ground for some more of my unique niche bits of code. With a
            brand new project I might be able to start a little cleaner or try a new technology but with WWD I've
            learned things about Vue MongoDb and Phaser along the way that just scraping the surface doesn't get you.
          </p>
        </div>

      </section>
    </div>

    <div class="col-12 d-flex flex-column align-items-center">
      <section class="row lore-card border border-2 border-light rounded-4 ">
        <div class="col-12 col-md-12 lore-content p-3 pb-0">
          <h3>AI and WWD</h3>
          <p>
            You might have noticed that there is a lot of AI art in this application, That's absolutely correct. I have
            come to prefer Microsoft's AI art generator. It's quick easy and has given me somewhat consistent results.
          </p>
          <p>
            I wanted to use AI art because I wanted this to be a showcase of how well I can assemble things. From Vue to
            Phaser and MongoDb, I have created something unique. If I had stuck to creating the art by hand or
            collecting it from random places on the internet this project could not have made it as far as it has.
          </p>
        </div>

      </section>
    </div>

    <div class="col-12 d-flex flex-column align-items-center">
      <section class="row lore-card border border-2 border-light rounded-4 ">
        <div class="col-12 col-md-12 lore-content p-3 pb-0">
          <h3>WW-WWD-D?</h3>
          <p>
            What will World War Dragons Do? I think it is beginning to reach the end of it's dev cycle for now. Unless I
            think of a new feature I want to tackle.
          </p>
          <p>
            Besides that I want to make this more accessible. Odds are you waited what seems like 5 minutes for Render
            to serve this up to you and I'd like to fix that.
          </p>
          <p>
            Either way I have made somewhat of a platform here and it makes me wonder if I can use it to help some
            others out. I'm hoping to have someone do some writing on tne dialogue for WWD, They could put that on a
            resume and become a writer one day. That'd be pretty cool.
          </p>
        </div>

      </section>
    </div>

  </section>
</template>


<script>
import { onMounted } from "vue";

export default {
  setup() {
    onMounted(() => {
      setBgImg();
    });

    const setBgImg = () => {
      const mainElement = document.querySelector('main');
      if (mainElement) {
        let bgImg = 'https://images.unsplash.com/photo-1569470451072-68314f596aec?q=80&w=1031&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
        mainElement.style.backgroundImage = `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.90) 100%), url(${bgImg})`;
      }
    }
    return {}
  }
}
</script>


<style lang="scss" scoped>
.lore-content {
  >h3 {
    font-weight: bold;
  }

  >p {
    font-size: x-large;
    padding: 8px;
  }
}

.lore-card {
  background-color: var(--bs-body-bg);
  max-width: 1200px;
}
</style>