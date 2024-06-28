<template>
  <div class="scryer-container">
    <h1>scryer</h1>
    <div class="input-container">
      <div class="link">
        <img src="@/assets/link.svg" alt="link" />
        <div class="input-wrapper">
          <input v-model="link" placeholder="paste the link here" />
          <span class="underline"></span>
        </div>
      </div>
      <div class="clipboard">
        <button @click="pasteLink">
          <img src="@/assets/clipboard.svg" alt="clipboard" /> paste
        </button>
      </div>
    </div>
  </div>
  <div class="footer-buttons">
    <button>
      <img src="@/assets/alien_monster.svg" alt="clipboard" /> about
    </button>
    <button>
      <img src="@/assets/sparkling_heart.svg" alt="clipboard" /> donate
    </button>
    <button><img src="@/assets/email.svg" alt="clipboard" /> feedback</button>
    <button><img src="@/assets/gear.svg" alt="clipboard" /> settings</button>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      link: "",
    };
  },
  methods: {
    pasteLink() {
      navigator.clipboard.readText().then((text) => {
        this.link = text;
      });
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Electrolize&display=swap");
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: floralwhite;
}

body {
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100vw;
}

* {
  font-family: "Electrolize";
  font-weight: 400;
  font-style: normal;
  background-color: #010100;
}

.scryer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  justify-content: center;
}

h1 {
  font-size: 1.5em;
  margin-bottom: 1.5em;
}

.input-container {
  display: flex;
  align-items: center;
}

.input-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}

input {
  background: none;
  border: none;
  outline: none;
  color: inherit;
  font-size: inherit;
  width: 100%;
  margin: 0 10px 10px 0;
}

.underline {
  width: 35rem;
  height: 2px;
  background-color: #555;
  transition: background-color 0.3s;
}
input:focus + .underline {
  background-color: #ff9800;
}
@media screen and (max-width: 768px) {
  .underline {
    width: 100%;
  }
}

button {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  margin-left: 15px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  background-color: #181819;
  color: floralwhite;
}
button:hover {
  opacity: 0.8;
}

img {
  height: 25px;
  width: auto;
  margin-right: 10px;
}

.link,
.clipboard {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.footer-buttons {
  display: flex;
  justify-content: center;
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 30px 0;
}
</style>
