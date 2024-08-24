<script setup></script>


<template>
  <p class="mb-2 text-light text-2p text-center">
    This website was developed by
  </p>
  <div class="text-box d-flex justify-content-center">
    <a href="https://www.kylepep.dev" target="_blank" class="text-2p btn btn-white">Kyle
      Peppersack</a>
  </div>
</template>


<style lang="scss" scoped>
.kyle-pep {
  color: var(--bs-light);
  background-color: #5c6068;
  border: 3px solid #dc5f00;
}

.btn:link,
.btn:visited {
  text-transform: uppercase;
  text-decoration: none;
  padding: 15px 40px;
  display: inline-block;
  border-radius: 100px;
  transition: all 0.2s;
  position: absolute;
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.btn:active {
  transform: translateY(-1px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}

.btn-white {
  background-color: var(--bs-secondary);
  color: var(--bs-light);
  font-weight: bold;
}

.btn::after {
  content: "";
  display: inline-block;
  height: 100%;
  width: 100%;
  border-radius: 100px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  transition: all 0.4s;
}

.btn-white::after {
  background-color: var(--bs-secondary);
}

.btn:hover::after {
  transform: scaleX(1.4) scaleY(1.6);
  opacity: 0;
}

.btn-animated {
  animation: moveInBottom 5s ease-out;
  animation-fill-mode: backwards;
}

@keyframes moveInBottom {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }

  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
</style>