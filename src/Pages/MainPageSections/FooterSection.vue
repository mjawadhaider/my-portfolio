<template>
  <section ref="root" class="contact">
    <div class="contact__inner">
      <p class="section-eyebrow">04 &mdash; Contact</p>

      <button
        type="button"
        class="contact__cta my-cursor-hover"
        @click="getInTouch"
      >
        <h2 class="contact__heading">
          Let's build<br />something together
        </h2>
      </button>

      <div class="contact__row">
        <div v-show="!toggleFeedackForm" ref="methods" class="contact__methods">
          <a
            class="contact__method my-cursor-hover"
            @mousemove="handleMouseMove_Small"
            @mouseleave="handleMouseLeave"
            @click="routeToLink('mailto:m.jawadhaider03@gmail.com')"
          >
            m.jawadhaider03@gmail.com
          </a>
          <button
            type="button"
            class="contact__method my-cursor-hover"
            @mousemove="handleMouseMove_Small"
            @mouseleave="handleMouseLeave"
            @click="copyToCipboard('+92497537708')"
          >
            +92 49 7537708
          </button>
        </div>

        <div v-show="toggleFeedackForm" id="feedback-form" ref="form" class="contact__form">
          <feedback-form @onClose="feedbackFormClosed" />
        </div>
      </div>
    </div>

    <div class="contact__foot" :class="{ 'contact__foot--stacked': $vuetify.display.xs }">
      <span class="contact__meta">
        &copy; {{ new Date().getFullYear() }} M Jawad Haider
      </span>
      <social-component icon-size="small" />
    </div>
  </section>
</template>

<script>
import { gsap } from '@/plugins/gsap';
import FeedbackForm from '@/components/FeedbackForm.vue';
import SocialComponent from '@/components/SocialComponent.vue';
import { prefersReducedMotion } from '@/utils/motion';

export default {
  components: {
    FeedbackForm,
    SocialComponent,
  },
  data() {
    return {
      toggleFeedackForm: false,
    };
  },
  methods: {
    copyToCipboard(value) {
      const textField = document.createElement('textarea');
      textField.innerText = value;
      document.body.appendChild(textField);
      textField.select();
      document.execCommand('copy');
      textField.remove();
      this.$toast.info('Copied to clipboard!!');
    },
    getInTouch() {
      if (this.toggleFeedackForm) {
        this.feedbackFormClosed();
        return;
      }
      this.toggleFeedackForm = true;

      if (!prefersReducedMotion()) {
        gsap.fromTo(
          this.$refs.form,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
        );
      }

      setTimeout(() => {
        this.$refs.form?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    },
    feedbackFormClosed() {
      this.toggleFeedackForm = false;
    },
    openContactFormFromEvent() {
      if (!this.toggleFeedackForm) this.getInTouch();
    },
    addScrollAnimation() {
      if (prefersReducedMotion()) return;

      gsap.fromTo(
        this.$refs.root.querySelectorAll('.contact__inner > *, .contact__foot'),
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: { trigger: this.$refs.root, start: 'top 75%' },
        }
      );
    },
  },
  mounted() {
    this.addScrollAnimation();
    window.addEventListener('open-contact-form', this.openContactFormFromEvent);
  },
  beforeUnmount() {
    window.removeEventListener('open-contact-form', this.openContactFormFromEvent);
  },
};
</script>

<style lang="scss">
// The footer reads as a distinct closing "tray" rather than another
// section: rounded top corners reveal a sliver of the page's own
// background behind it (a deliberate, one-off exception to the "flat,
// pill-buttons-only radius" rule — used here because it's the one place
// on the site that benefits from looking like a separate surface), a
// deepened flat base (darker than $color-bg-darkest) instead of the
// same accent-glow treatment every other section uses, and an upward
// shadow that visually separates it from whatever sits above it.
.contact {
  // A single quiet glint in one corner (not the broad wash every other
  // section has) over a deepened flat base — background layers always
  // paint behind content, so this needs no pseudo-element/z-index.
  background:
    radial-gradient(ellipse 32% 40% at 88% 0%, rgba(205, 168, 121, 0.06), transparent 60%),
    darken($color-bg-darkest, 4%);
  border-radius: 28px 28px 0 0;
  box-shadow: 0 -48px 64px -40px rgba(0, 0, 0, 0.65);
  padding: clamp(96px, 14vh, 180px) clamp(24px, 6vw, 80px) $space-7;
  overflow: hidden;
}

.contact__inner {
  max-width: $container-max;
  margin-inline: auto;
}

.contact__cta {
  display: block;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 0;
  cursor: inherit;
  margin-top: $space-4;
}

.contact__heading {
  margin: 0;
  font-family: $font-display;
  font-size: clamp(2.25rem, 5vw + 1rem, 5rem);
  font-weight: $fw-medium;
  letter-spacing: $ls-tight;
  line-height: 1.05;
  color: $color-white;
  transition: color $dur-normal $ease-out;
}

.contact__cta:hover .contact__heading {
  color: $color-accent;
}

.contact__row {
  margin-top: $space-9;
  min-height: 64px;
}

.contact__methods {
  display: flex;
  flex-wrap: wrap;
  gap: $space-7;
}

.contact__method {
  background: none;
  border: none;
  padding: 0 0 $space-2;
  font-family: $font-mono;
  font-size: $fs-body;
  color: $color-white;
  text-decoration: none;
  border-bottom: 1px solid rgba(242, 240, 236, 0.25);
  cursor: inherit;
  transition: border-color $dur-fast $ease-out, color $dur-fast $ease-out;

  &:hover {
    color: $color-accent;
    border-color: $color-accent;
  }
}

.contact__form {
  max-width: 560px;
}

.contact__foot {
  max-width: $container-max;
  margin: clamp(64px, 10vh, 120px) auto 0;
  padding-top: $space-5;
  border-top: $border-hairline;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.contact__foot--stacked {
  flex-direction: column;
  align-items: flex-start;
  gap: $space-4;
}

.contact__meta {
  font-family: $font-mono;
  font-size: $fs-micro;
  letter-spacing: $ls-wide;
  text-transform: uppercase;
  color: $color-gray;
}
</style>
