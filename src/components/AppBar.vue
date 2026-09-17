<template>
  <div>
    <div class="scroll-progress" :style="{ transform: `scaleX(${scrollProgress})` }" />

    <header
      id="appBar"
      class="site-nav"
      :class="{ 'site-nav--scrolled': isScrolled, 'site-nav--open': toggle }"
    >
      <div class="site-nav__inner">
        <button
          class="nav-mark my-cursor-hover"
          type="button"
          aria-label="Scroll to top"
          @click="scrollToTop"
        >
          <span class="nav-mark__full">Jawad&nbsp;Haider</span>
          <span class="nav-mark__short">JH</span>
        </button>

        <div class="site-nav__actions">
          <nav v-if="$vuetify.display.mdAndUp" class="nav-links" aria-label="Primary">
            <a
              v-for="(tab, index) in tabs"
              :key="index"
              href="#"
              class="nav-link my-cursor-hover"
              :class="{ 'nav-link--active': tab.isActive }"
              @click.prevent="scrollToSection(tab)"
            >
              {{ tab.title }}
            </a>
          </nav>

          <button
            type="button"
            class="theme-toggle my-cursor-hover"
            :aria-label="isLightTheme ? 'Switch to dark mode' : 'Switch to light mode'"
            @click="onToggleTheme"
          >
            <v-icon size="18">{{ isLightTheme ? 'mdi-weather-night' : 'mdi-white-balance-sunny' }}</v-icon>
          </button>

          <button
            v-if="!$vuetify.display.mdAndUp"
            class="nav-toggle my-cursor-hover"
            type="button"
            :aria-expanded="toggle"
            aria-label="Toggle navigation menu"
            @click="toggleNavigationDrawer"
          >
            <span class="nav-toggle__bar" />
            <span class="nav-toggle__bar" />
          </button>
        </div>
      </div>
    </header>

    <div
      v-if="$vuetify.display.smAndDown"
      ref="overlay"
      class="nav-overlay"
      :class="{ 'nav-overlay--active': toggle }"
      :aria-hidden="!toggle"
    >
      <div class="nav-overlay__list">
        <a
          v-for="(tab, index) in tabs"
          :key="index"
          href="#"
          class="nav-overlay__link"
          :class="{ 'nav-overlay__link--active': tab.isActive }"
          @click.prevent="scrollToSection(tab)"
        >
          <span class="nav-overlay__index">{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="nav-overlay__label">{{ tab.title }}</span>
        </a>
      </div>
      <div class="nav-overlay__footer">
        <span class="nav-overlay__meta">Find me online</span>
        <social-component icon-size="default" />
      </div>
    </div>
  </div>
</template>

<script>
import SocialComponent from './SocialComponent.vue';
import { gsap } from '@/plugins/gsap';
import { prefersReducedMotion } from '@/utils/motion';
import { themeState, toggleTheme } from '@/utils/theme';

export default {
  components: {
    SocialComponent,
  },
  props: {
    tabs: {
      type: Array,
      default: () => [],
    },
    isFooterVisible: Boolean,
  },
  data: () => {
    return {
      toggle: false,
      isScrolled: false,
      scrollProgress: 0,
      themeState,
    };
  },
  computed: {
    isLightTheme() {
      return this.themeState.theme === 'light';
    },
  },
  watch: {
    toggle(newValue) {
      this.$emit('toggleNavigationDrawer', newValue);
      this.animateOverlay(newValue);
    },
  },
  methods: {
    onToggleTheme() {
      toggleTheme();
    },
    toggleNavigationDrawer() {
      this.toggle = !this.toggle;
    },
    scrollToSection(btn) {
      this.toggle = false;
      if (!btn?.componentId) {
        this.scrollToTop();
        return;
      }
      const component = document.getElementById(btn.componentId);
      if (!component) return;
      const scrollPosition = component.getBoundingClientRect().top + window.scrollY - 35;
      window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    animateOverlay(open) {
      const el = this.$refs.overlay;
      if (!el) return;
      gsap.killTweensOf(el);
      document.documentElement.style.overflow = open ? 'hidden' : '';

      if (prefersReducedMotion()) {
        gsap.set(el, { clipPath: open ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)' });
        return;
      }

      if (open) {
        gsap.fromTo(
          el,
          { clipPath: 'inset(0 0 100% 0)' },
          { clipPath: 'inset(0 0 0% 0)', duration: 0.7, ease: 'expo.out' }
        );
        gsap.fromTo(
          '.nav-overlay__link',
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'power2.out', stagger: 0.06 }
        );
      } else {
        gsap.to(el, { clipPath: 'inset(0 0 100% 0)', duration: 0.5, ease: 'power3.inOut' });
      }
    },
    handleScroll() {
      this.isScrolled = window.scrollY > 24;

      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      this.scrollProgress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    },
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    this.handleScroll();

    if (!prefersReducedMotion()) {
      gsap.fromTo(
        '#appBar',
        { opacity: 0, y: -24 },
        { opacity: 1, y: 0, duration: 0.9, delay: 0.3, ease: 'power2.out' }
      );
    }
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    document.documentElement.style.overflow = '';
  },
};
</script>

<style lang="scss">
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: $gradient-accent;
  transform-origin: left center;
  transform: scaleX(0);
  z-index: 2600;
  pointer-events: none;
}

.site-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2400;
  padding-block: $space-5;
  transition: padding $dur-normal $ease-out, background-color $dur-normal $ease-out,
    border-color $dur-normal $ease-out, backdrop-filter $dur-normal $ease-out;
  border-bottom: 1px solid transparent;
}

.site-nav--scrolled {
  padding-block: $space-3;
  background-color: rgba(var(--color-bg-darkest-rgb), 0.72);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: $border-hairline-faint;
}

.site-nav__inner {
  max-width: $container-wide;
  margin-inline: auto;
  padding-inline: $space-6;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 600px) {
    padding-inline: $space-4;
  }
}

.nav-mark {
  background: none;
  border: none;
  padding: 0;
  font-family: $font-mono;
  font-size: $fs-caption;
  letter-spacing: $ls-wide;
  text-transform: uppercase;
  // !important: needed to beat Vuetify's `[type=button] { color: inherit }`
  // reset on this equal-specificity single-class selector — see
  // FeedbackForm.vue's .hero__cta comment for the full explanation.
  color: $color-white !important;
  cursor: inherit;
}

.nav-mark__short {
  display: none;
}

.site-nav__actions {
  display: flex;
  align-items: center;
  gap: $space-6;
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: $space-2;
  margin: -$space-2;
  // !important: needed to beat Vuetify's `[type=button] { color: inherit }`
  // reset on this equal-specificity single-class selector — see
  // FeedbackForm.vue's .hero__cta comment for the full explanation.
  color: $color-text-muted !important;
  cursor: inherit;
  transition: color $dur-fast $ease-out;

  // The icon is a <v-icon> with no color of its own, which (like every
  // element) is directly caught by App.vue's global `* { color:
  // $color-white }` rather than actually inheriting from this button —
  // see the matching note in SocialComponent.vue for the full mechanism.
  .v-icon {
    color: inherit !important;
  }

  &:hover {
    color: $color-accent !important;
  }
}

.nav-links {
  display: flex;
  align-items: center;
  gap: $space-7;
}

.nav-link {
  position: relative;
  font-family: $font-mono;
  font-size: $fs-caption;
  letter-spacing: $ls-wide;
  text-transform: uppercase;
  color: $color-text-muted;
  text-decoration: none;
  padding-block: $space-1;
  transition: color $dur-fast $ease-out;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 100%;
    height: 1px;
    background: $color-accent;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform $dur-normal $ease-out;
  }

  &:hover {
    color: $color-white;

    &::after {
      transform: scaleX(1);
    }
  }
}

.nav-link--active {
  color: $color-accent;

  &::after {
    transform: scaleX(1);
  }
}

.nav-toggle {
  background: none;
  border: none;
  padding: $space-2;
  display: flex;
  flex-direction: column;
  gap: 5px;
  cursor: inherit;
}

.nav-toggle__bar {
  width: 22px;
  height: 1px;
  background: $color-white;
  transition: transform $dur-fast $ease-out, opacity $dur-fast $ease-out;
}

.site-nav--open .nav-toggle__bar:first-child {
  transform: translateY(3px) rotate(45deg);
}

.site-nav--open .nav-toggle__bar:last-child {
  transform: translateY(-3px) rotate(-45deg);
}

.nav-overlay {
  position: fixed;
  inset: 0;
  z-index: 2300;
  background: $color-bg-darkest;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: $space-10 $space-5 $space-7;
  clip-path: inset(0 0 100% 0);
  pointer-events: none;
}

.nav-overlay--active {
  pointer-events: auto;
}

.nav-overlay__list {
  display: flex;
  flex-direction: column;
  gap: $space-2;
}

.nav-overlay__link {
  display: flex;
  align-items: baseline;
  gap: $space-4;
  text-decoration: none;
  padding-block: $space-3;
  border-bottom: $border-hairline-faint;
}

.nav-overlay__index {
  font-family: $font-mono;
  font-size: $fs-caption;
  color: $color-accent;
}

.nav-overlay__label {
  font-family: $font-display;
  font-size: clamp(2rem, 6vw + 1rem, 3rem);
  font-weight: $fw-medium;
  color: $color-white;
  letter-spacing: $ls-tight;
}

.nav-overlay__link--active .nav-overlay__label {
  color: $color-accent;
}

.nav-overlay__footer {
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.nav-overlay__meta {
  font-family: $font-mono;
  font-size: $fs-micro;
  letter-spacing: $ls-wide;
  text-transform: uppercase;
  color: $color-gray;
}

@media (max-width: 380px) {
  .nav-mark__full {
    display: none;
  }

  .nav-mark__short {
    display: inline;
  }
}
</style>
