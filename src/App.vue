<template>
  <v-app>
    <div
      v-if="!$vuetify.display.smAndDown"
      cursor-outline
      class="cursor-outline"
    ></div>
    <app-bar
      id="appBarId"
      :tabs="tabs"
      :isFooterVisible="isFooterVisible"
      @toggleNavigationDrawer="toggleNavigationDrawer"
    />
    <v-main class="main-container">
      <main-page
        :isSnackBarDisabled="disbaleSnackbar"
        @toggleTabIndex="toggleTabIndex"
      />
    </v-main>
    <app-toaster />
  </v-app>
</template>

<script>
import AppBar from '@/components/AppBar.vue';
import MainPage from '@/Pages/MainPage.vue';
import AppToaster from '@/components/AppToaster.vue';

export default {
  name: 'App',
  components: {
    AppBar,
    MainPage,
    AppToaster,
  },
  data: () => {
    return {
      activeTabIndex: 0,
      disbaleSnackbar: false,
      isFooterVisible: false,
      cursorHoverSelector: 'button, .my-cursor-hover',
    };
  },
  computed: {
    tabs() {
      const appBarButtons = [
        {
          title: 'Home',
          componentId: '',
          isActive: true,
        },
        {
          title: 'About Me',
          block: 'center',
          componentId: 'aboutSectionId',
          isActive: false,
        },
        {
          title: 'Projects',
          block: 'start',
          componentId: 'projectSectionId',
          isActive: false,
        },
        {
          title: 'Contact Me',
          componentId: 'footerSectionId',
          isActive: false,
        },
      ];
      return appBarButtons.map((tab, index) =>
        index === this.activeTabIndex
          ? { ...tab, isActive: true }
          : { ...tab, isActive: false }
      );
    },
  },
  methods: {
    toggleTabIndex(element) {
      this.isFooterVisible = element.ref === 'footerSectionId';
      this.activeTabIndex = element?.index || 0;
    },
    toggleNavigationDrawer(toggle) {
      document.documentElement.style.overflow = toggle
        ? 'hidden'
        : '';
      this.disbaleSnackbar = toggle;
    },
    handleCursorMouseMove(e) {
      if (!this.customCursorEl) return;
      this.customCursorEl.style.left = `${e.pageX + 7}px`;
      this.customCursorEl.style.top = `${e.pageY + 7}px`;
    },
    handleCursorClick() {
      if (!this.customCursorEl) return;
      this.customCursorEl.classList.add('large');
      setTimeout(() => {
        this.customCursorEl?.classList.remove('large');
      }, 200);
    },
    isCursorHoverTarget(element) {
      return element?.closest?.(this.cursorHoverSelector) ?? null;
    },
    handleCursorHoverOver(e) {
      if (!this.customCursorEl) return;
      if (!this.isCursorHoverTarget(e.target)) return;
      if (this.isCursorHoverTarget(e.relatedTarget)) return;

      this.customCursorEl.classList.add('large');
      document.body.classList.add('hover');
    },
    handleCursorHoverOut(e) {
      if (!this.customCursorEl) return;
      if (!this.isCursorHoverTarget(e.target)) return;
      if (this.isCursorHoverTarget(e.relatedTarget)) return;

      this.customCursorEl.classList.remove('large');
      document.body.classList.remove('hover');
    },
  },
  created() {
    document.title = 'Jawad Haider';
  },
  mounted() {
    this.customCursorEl = document.querySelector('[cursor-outline]');
    if (!this.$vuetify.display.mdAndUp || !this.customCursorEl) return;

    window.addEventListener('mousemove', this.handleCursorMouseMove);
    window.addEventListener('click', this.handleCursorClick);
    document.addEventListener('mouseover', this.handleCursorHoverOver);
    document.addEventListener('mouseout', this.handleCursorHoverOut);
  },
  beforeUnmount() {
    window.removeEventListener('mousemove', this.handleCursorMouseMove);
    window.removeEventListener('click', this.handleCursorClick);
    document.removeEventListener('mouseover', this.handleCursorHoverOver);
    document.removeEventListener('mouseout', this.handleCursorHoverOut);
  },
};
</script>

<style lang="scss">
* {
  font-family: $font-body;
  color: $color-white;
}

.v-application {
  // Longhand + !important: Vuetify's own theme CSS sets a background
  // shorthand on this same selector, and load order between the two
  // isn't guaranteed — this must win without depending on it.
  background-image: $gradient-page-bg !important;
  background-repeat: no-repeat !important;
  // min-height only (never height/max-height — those clamp this box to
  // exactly one viewport tall, which used to cut the gradient off
  // partway down the page on any view taller than 100vh, e.g. the hero's
  // stacked mobile layout. min-height just guarantees full coverage on
  // short pages without capping how tall this box is allowed to grow.
  min-height: 100vh;
}

// Shared skeleton-loading primitive. Composed on a per-section basis to
// mirror that section's real layout (see AboutSection/ProjectSection/
// TestimonialsSection) rather than a generic placeholder shape — the
// shimmer sweep doubles as one of the app's premium gradient accents.
@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton {
  display: block;
  background: linear-gradient(
    100deg,
    rgba(242, 240, 236, 0.06) 0%,
    rgba(242, 240, 236, 0.06) 35%,
    rgba(205, 168, 121, 0.16) 50%,
    rgba(242, 240, 236, 0.06) 65%,
    rgba(242, 240, 236, 0.06) 100%
  );
  background-size: 250% 100%;
  animation: skeleton-shimmer 2.4s ease-in-out infinite;
  border-radius: $radius-sm;
}

@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: none;
    background-position: 0 0;
  }
}

.skeleton--text {
  height: 0.85em;
}

.skeleton--circle {
  border-radius: $radius-circle;
  flex: none;
}

::selection {
  background-color: $color-accent;
  color: $color-ink;
}

.v-btn,
.v-tab,
.upper-case {
  text-transform: uppercase !important;
}

.font-18 {
  font-size: 18px;
}

.font-16 {
  font-size: 16px;
}

.text-h1 {
  font-family: $font-heading;
  font-size: $fs-h1;
  font-weight: $fw-bold;
  line-height: $lh-tight;
}

.text-h2 {
  font-family: $font-heading;
  font-size: $fs-h2;
  font-weight: $fw-semibold;
  line-height: $lh-tight;
}

.text-h3 {
  font-family: $font-heading;
  font-size: $fs-h3;
  font-weight: $fw-semibold;
  line-height: $lh-tight;
}

.text-body-loose {
  font-size: $fs-body;
  line-height: $lh-loose;
}

// Shared small uppercase mono label used to open every major section
// ("01 — Work", "Toolkit", etc.) — the recurring wayfinding device that
// ties the editorial sections together.
.section-eyebrow {
  font-family: $font-mono;
  font-size: $fs-caption;
  letter-spacing: $ls-wide;
  text-transform: uppercase;
  color: $color-accent;
}

.text-darkGray {
  color: $color-bg-darkest;
}

.text-gray {
  color: $color-gray;
}

.text-lightGray {
  color: $color-surface;
}

.text-myprimary {
  color: $color-bg-base;
}

.text-mysecondary {
  color: $color-accent !important;
}

.text-mywhite {
  color: $color-white !important;
}

.main-container {
  padding-top: 0 !important;

  @media (max-width: 960px) {
    overflow: hidden;
  }
}

/* Hide scrollbar for Chrome, Safari and Opera */
body::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
body {
  /* IE and Edge */
  -ms-overflow-style: none;
  /* Firefox */
  scrollbar-width: none;
  cursor: url('assets/cursor-dot.png'), auto;
}

body.hover {
  cursor: url('assets/cursor-hover.png'), auto !important;
}

body.card {
  cursor: url('assets/card-cursor.png'), auto !important;
}

button:hover {
  cursor: url('assets/cursor-hover.png'), auto !important;
}

a:hover {
  cursor: url('assets/cursor-hover.png'), auto !important;
}

.cursor-outline {
  width: 40px;
  height: 40px;
  border: 2px solid hsla(0, 0%, 100%, 0.5);
  position: absolute;
  transition: width 300ms, height 300ms;

  top: 0;
  left: 0;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  z-index: 2499;
  pointer-events: none;
}

.cursor-outline.large {
  width: 55px;
  height: 55px;
}

.cursor-outline.hover {
  cursor: url('assets/cursor-hover.png'), auto !important;
}

/* width */
::-webkit-scrollbar {
  width: 4px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 5px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
