<template>
  <v-snackbar
    id="custom-snackbar"
    v-model="toggleSnackbar"
    location="right bottom"
    min-width="6"
    variant="text"
    :timeout="-1"
    :style="snackBarStyling"
  >
    <template v-slot:actions>
      <button
        v-show="!isSnackBarDisabled"
        type="button"
        class="scroll-top-btn my-cursor-hover"
        aria-label="Back to top"
        :disabled="isSnackBarDisabled"
        @click="scrollToTop"
      >
        <v-icon size="20">mdi-arrow-up</v-icon>
      </button>
    </template>
  </v-snackbar>
</template>

<script>
import { gsap } from '@/plugins/gsap';
import { prefersReducedMotion } from '@/utils/motion';

export default {
  props: {
    isSnackBarDisabled: Boolean,
    snackbarVisible: Boolean,
  },
  computed: {
    toggleSnackbar: {
      get() { return this.snackbarVisible; },
      set() { }
    },
    snackBarStyling() {
      return this.$vuetify.display.mdAndUp
        ? { 'margin-bottom': '80px', 'margin-right': '56px' }
        : { 'margin-bottom': '40px', 'margin-right': '24px' };
    },
  },
  methods: {
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  },
  mounted() {
    if (prefersReducedMotion()) return;

    gsap.fromTo('#custom-snackbar', {
      opacity: 0,
      scale: 0.5,
      y: 400,
      x: 500,
    }, {
      y: 0,
      x: 0,
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: 'power2.out',
    });
  },
};
</script>

<style scoped lang="scss">
.scroll-top-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: $radius-circle;
  border: $border-hairline;
  background-color: $color-bg-darkest;
  color: $color-white;
  cursor: inherit;
  transition: border-color $dur-fast $ease-out, color $dur-fast $ease-out,
    transform $dur-fast $ease-out;

  &:hover {
    border-color: $color-accent;
    color: $color-accent;
    transform: translateY(-2px);
  }
}
</style>