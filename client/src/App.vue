<template>
  <div class="app-wrapper">
    <div id="message">UI inspired by cobalt.tools</div>
    <div class="scryer-container">
      <h1>.scryer</h1>
      <div class="input-container">
        <div class="link">
          <img src="@/assets/link.svg" alt="link" />
          <input v-model="link" placeholder="Paste the link here" />
        </div>
        <div class="clipboard">
          <button @click="handleButtonClick">
            <img src="@/assets/clipboard.svg" alt="clipboard" />
            {{ link ? "Submit" : "Paste" }}
            <!-- Change button text based on input -->
          </button>
        </div>
      </div>
      <span class="underline"></span>
    </div>
    <div class="footer-buttons">
      <button>
        <img src="@/assets/alien_monster.svg" alt="about" /> About
      </button>
      <button>
        <img src="@/assets/sparkling_heart.svg" alt="donate" /> Donate
      </button>
      <button><img src="@/assets/email.svg" alt="feedback" /> Feedback</button>
      <button><img src="@/assets/gear.svg" alt="settings" /> Settings</button>
    </div>
  </div>
</template>

<script>
import { inject } from "@vercel/analytics";
import axios from "axios"; // Import Axios for HTTP requests

inject();
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
    handleButtonClick() {
      if (this.link) {
        this.submitLink(); // Call your submit logic here
      } else {
        this.pasteLink(); // Call the paste logic if link is empty
      }
    },
    async submitLink() {
      try {
        // Send a POST request to your server
        const response = await axios.post(
          "https://scryer-server.vercel.app/api/crawl",
          {
            url: this.link,
          }
        );
        console.log("Response from server:", response.data); // Log the server response
        // Optionally, clear the input after submission
        this.link = ""; // Reset link after submission
      } catch (error) {
        console.error("Error submitting link:", error); // Log any errors
        // Optionally, you can show an error message to the user here
      }
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

.app-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
}

#message {
  padding: 5px;
  font-size: 1em;
  background-color: #0ef64c;
  color: #181819;
}

.scryer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1 {
  font-size: 1.5em;
  margin-bottom: 1.5em;
}

.input-container {
  width: 40rem;
  display: flex;
  justify-content: space-between;
}

input {
  background: none;
  border: none;
  outline: none;
  color: inherit;
  font-size: inherit;
  width: 100%;
}

.underline {
  width: 40rem;
  height: 2px;
  background-color: #555;
  transition: background-color 0.3s;
}
input:focus + .underline {
  background-color: #0ef64c;
}

button {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border-radius: 10px;
  border: #555 0.1px solid;
  cursor: pointer;
  background-color: #181819;
  color: floralwhite;
}
button:hover {
  opacity: 0.8;
}

img {
  height: 20px;
  width: auto;
  margin-right: 10px;
}

.link,
.clipboard {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.link {
  width: 80%;
}

.footer-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  bottom: 0;
  width: 100%;
  padding: 30px 0;
}
.footer-buttons button {
  margin: 0 5px;
}
@media screen and (max-width: 768px) {
  .underline {
    width: 100%;
  }
  .input-container {
    width: 100%;
  }
  .footer-buttons button {
    margin: 5px;
    width: 40%;
  }
  button {
    padding: 7px 12px;
  }
  .scryer-container {
    padding: 0 20px;
  }
}
</style>
