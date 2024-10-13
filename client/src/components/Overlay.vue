<template>
  <div v-if="isVisible" class="overlay" @click.self="closeOverlay">
    <div class="overlay-content">
      <button class="close-button" @click="closeOverlay">X</button>
      <h2>Overlay Content</h2>
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyOverlay",
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: "This is the overlay content!",
    },
  },
  methods: {
    closeOverlay() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.overlay-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  text-align: center;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
}
</style>
