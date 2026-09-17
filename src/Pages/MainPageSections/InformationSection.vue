<template>
  <section class="hero">
    <div class="hero__grid">
      <div class="hero__intro">
        <p ref="eyebrow" class="hero__eyebrow">Software&nbsp;Engineer</p>

        <h1 class="hero__name">
          <span class="hero__name-mask"><span ref="nameLine1" class="hero__name-line">Muhammad</span></span>
          <span class="hero__name-mask"><span ref="nameLine2" class="hero__name-line">Jawad Haider</span></span>
        </h1>

        <p ref="statement" class="hero__statement">
          {{ statement }}
        </p>

        <div ref="actions" class="hero__actions">
          <button
            type="button"
            class="hero__cta hero__cta--primary my-cursor-hover"
            @mousemove="handleMouseMove_Small"
            @mouseleave="handleMouseLeave"
            @click="openContactForm"
          >
            <span>Let's talk</span>
            <span class="hero__cta-arrow" aria-hidden="true">&#8594;</span>
          </button>
          <button
            type="button"
            class="hero__cta my-cursor-hover"
            @mousemove="handleMouseMove_Small"
            @mouseleave="handleMouseLeave"
            @click="scrollToSection('projectSectionId')"
          >
            <span>View the work</span>
            <span class="hero__cta-arrow" aria-hidden="true">&#8594;</span>
          </button>
          <a
            v-if="details.resumeLink"
            class="hero__cta my-cursor-hover"
            target="_blank"
            :href="details.resumeLink"
            @mousemove="handleMouseMove_Small"
            @mouseleave="handleMouseLeave"
          >
            <span>R&eacute;sum&eacute;</span>
            <span class="hero__cta-arrow" aria-hidden="true">&#8599;</span>
          </a>
        </div>
      </div>

      <div ref="metaCol" class="hero__aside">
        <dl class="hero__meta">
          <div v-if="heroRole" class="hero__meta-row">
            <dt>Role</dt>
            <dd>{{ heroRole }}</dd>
          </div>
          <div v-if="heroStatus" class="hero__meta-row">
            <dt>Status</dt>
            <dd>{{ heroStatus }}</dd>
          </div>
          <div v-if="focusAreas" class="hero__meta-row">
            <dt>Focus</dt>
            <dd>{{ focusAreas }}</dd>
          </div>
          <div v-if="latestRole" class="hero__meta-row">
            <dt>Currently</dt>
            <dd>{{ latestRole }}</dd>
          </div>
        </dl>

        <div ref="portrait" class="hero__portrait">
          <div class="hero__portrait-frame">
            <img class="hero__portrait-img" :src="require('@/assets/my.png')" alt="Portrait of Muhammad Jawad Haider" />
          </div>
          <span class="hero__portrait-caption">JH &mdash; Portfolio</span>
        </div>
      </div>
    </div>

    <div ref="footRow" class="hero__foot">
      <span class="hero__scroll-cue">
        <span class="hero__scroll-line" />
        Scroll
      </span>
      <social-component icon-size="x-small" />
    </div>
  </section>
</template>

<script>
import { gsap } from '@/plugins/gsap';
import SocialComponent from '@/components/SocialComponent.vue';
import { fetchDetails, fetchExperience, fetchSkills } from '@/utils/fetchData';
import { prefersReducedMotion } from '@/utils/motion';

const ROLE_LINE = 'Software Engineer';
const STATEMENT = 'I build solutions that hold up, not just ones that ship. Thoughtful engineering, not just working code.';

export default {
  components: {
    SocialComponent,
  },
  data() {
    return {
      details: {},
      experience: [],
      skills: [],
      statement: STATEMENT,
    };
  },
  computed: {
    heroRole() {
      return ROLE_LINE.split('|')[0]?.trim() || '';
    },
    heroStatus() {
      return ROLE_LINE.split('|')[1]?.trim() || '';
    },
    focusAreas() {
      return [...this.skills]
        .sort((a, b) => (a.tier ?? 2) - (b.tier ?? 2) || (b.years ?? 0) - (a.years ?? 0))
        .slice(0, 3)
        .map((s) => s.name)
        .join(' · ');
    },
    latestRole() {
      const latest = this.experience[0];
      if (!latest) return '';
      return [latest.position, latest.company].filter(Boolean).join(' @ ');
    },
  },
  methods: {
    scrollToSection(elementId) {
      const el = document.getElementById(elementId);
      if (!el) return;
      const scrollPosition = el.getBoundingClientRect().top + window.scrollY - 35;
      window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
    },
    openContactForm() {
      this.scrollToSection('footerSectionId');
      window.dispatchEvent(new Event('open-contact-form'));
    },
    playEntrance() {
      if (prefersReducedMotion()) return;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.4 });

      tl.fromTo(this.$refs.eyebrow, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 })
        .fromTo(
          [this.$refs.nameLine1, this.$refs.nameLine2],
          { yPercent: 115 },
          { yPercent: 0, duration: 0.9, stagger: 0.1, ease: 'expo.out' },
          '-=0.2'
        )
        .fromTo(this.$refs.statement, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
        .fromTo(this.$refs.actions, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.35')
        .fromTo(
          this.$refs.metaCol,
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          '-=0.5'
        )
        .fromTo(
          '.hero__meta-row',
          { opacity: 0, x: 16 },
          { opacity: 1, x: 0, duration: 0.5, stagger: 0.08 },
          '-=0.4'
        )
        .fromTo(
          this.$refs.portrait,
          { clipPath: 'inset(0 0 100% 0)' },
          { clipPath: 'inset(0 0 0% 0)', duration: 0.9, ease: 'expo.out' },
          '-=0.5'
        )
        .fromTo(this.$refs.footRow, { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.3');
    },
  },
  async mounted() {
    this.playEntrance();

    if (!prefersReducedMotion()) {
      gsap.to(this.$refs.portrait, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: this.$refs.portrait,
          scrub: true,
        },
      });
    }

    const [details, experience, skills] = await Promise.all([
      fetchDetails(),
      fetchExperience(),
      fetchSkills(),
    ]);
    this.details = details;
    this.experience = experience;
    this.skills = skills;
  },
};
</script>

<style lang="scss">
.hero {
  min-height: min(100svh, 960px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(120px, 14vh, 180px) clamp(24px, 6vw, 80px) $space-7;
  max-width: $container-wide;
  margin-inline: auto;
}

.hero__grid {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 4fr);
  gap: clamp(48px, 8vw, 120px);
  align-items: start;
}

.hero__eyebrow {
  font-family: $font-mono;
  font-size: $fs-caption;
  letter-spacing: $ls-wide;
  text-transform: uppercase;
  color: $color-accent;
  margin-bottom: $space-5;
}

.hero__name {
  margin: 0;
}

.hero__name-mask {
  display: block;
  overflow: hidden;
}

.hero__name-line {
  display: block;
  font-family: $font-display;
  font-size: $fs-hero;
  font-weight: $fw-medium;
  letter-spacing: $ls-tight;
  line-height: 1.02;
  color: $color-white;
}

.hero__statement {
  max-width: 46ch;
  margin-top: $space-6;
  font-size: clamp(1.0625rem, 0.4vw + 1rem, 1.25rem);
  line-height: $lh-loose;
  color: $color-text-muted;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: $space-6;
  margin-top: $space-8;
}

.hero__cta {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  background: none;
  border: none;
  padding: 0 0 $space-2;
  font-family: $font-body;
  font-size: $fs-body;
  font-weight: $fw-medium;
  // !important: this is a <button>, and Vuetify's own reset stylesheet
  // carries a same-specificity `[type=button] { color: inherit }` rule
  // that (in this app's build) is injected after our component styles —
  // on an equal-specificity tie it wins, silently falling through to
  // `inherit` instead of this color. See FeedbackForm.vue's .hero__cta
  // override for the full explanation.
  color: $color-white !important;
  text-decoration: none;
  border-bottom: 1px solid rgba(var(--color-white-rgb), 0.25);
  cursor: inherit;
  transition: border-color $dur-fast $ease-out, color $dur-fast $ease-out;
}

// App.vue's global `* { color: $color-white }` matches these buttons'
// label/arrow <span>s directly (a universal-selector match always wins
// over plain inheritance, regardless of specificity elsewhere), so
// without this the spans ignore whatever color the button itself
// resolved to and always show the theme's plain white/ink text color
// instead. Harmless here (both colors are theme-reactive and the hero
// background flips with them), but this same button+span pattern is
// reused by FeedbackForm.vue's Send/Cancel buttons inside the footer's
// permanently-dark tray — there the span's theme-reactive color goes
// invisible against that fixed-dark background once the site is in
// light mode. `inherit` (not `!important`) is enough: specificity
// 0-0-1-1 already beats the universal selector's 0-0-0-0.
.hero__cta > span {
  color: inherit;
}

.hero__cta-arrow {
  transition: transform $dur-fast $ease-out;
}

.hero__cta:hover {
  border-color: $color-white;
}

.hero__cta:hover .hero__cta-arrow {
  transform: translate(3px, -3px);
}

.hero__cta--primary {
  position: relative;
  color: $color-accent !important;
  border-color: transparent;
}

.hero__cta--primary::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 1px;
  background: $gradient-accent;
  opacity: 0.55;
  transition: opacity $dur-fast $ease-out;
}

.hero__cta--primary:hover::after {
  opacity: 1;
}

.hero__aside {
  display: flex;
  flex-direction: column;
  gap: $space-9;
  padding-top: $space-2;
}

.hero__meta {
  display: flex;
  flex-direction: column;
  gap: $space-4;
  padding-top: $space-3;
  border-top: $border-hairline;
}

.hero__meta-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: $space-4;
  font-size: $fs-body-sm;

  dt {
    font-family: $font-mono;
    font-size: $fs-micro;
    letter-spacing: $ls-wide;
    text-transform: uppercase;
    color: $color-gray;
    white-space: nowrap;
  }

  dd {
    margin: 0;
    text-align: right;
    color: $color-white;
  }
}

.hero__portrait {
  position: relative;
  align-self: flex-end;
  width: min(100%, 280px);
}

.hero__portrait::before {
  content: '';
  position: absolute;
  inset: -28px;
  background: $gradient-glow-accent;
  filter: blur(6px);
  z-index: -1;
  pointer-events: none;
}

.hero__portrait-frame {
  position: relative;
  border: $border-hairline;
  padding: $space-2;
}

.hero__portrait-img {
  display: block;
  width: 100%;
  height: auto;
  filter: grayscale(0.55) contrast(1.02);
  transition: filter $dur-slow $ease-out;
}

.hero__portrait:hover .hero__portrait-img {
  filter: grayscale(0);
}

.hero__portrait-caption {
  display: block;
  margin-top: $space-3;
  font-family: $font-mono;
  font-size: $fs-micro;
  letter-spacing: $ls-wide;
  text-transform: uppercase;
  color: $color-gray;
  text-align: right;
}

.hero__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: clamp(56px, 8vh, 110px);
  padding-top: $space-5;
  border-top: $border-hairline;
}

.hero__scroll-cue {
  display: flex;
  align-items: center;
  gap: $space-3;
  font-family: $font-mono;
  font-size: $fs-micro;
  letter-spacing: $ls-wide;
  text-transform: uppercase;
  color: $color-gray;
}

.hero__scroll-line {
  width: 32px;
  height: 1px;
  background: $color-gray;
}

@media (max-width: 960px) {
  .hero__grid {
    grid-template-columns: 1fr;
    gap: $space-8;
  }

  .hero__aside {
    flex-direction: column-reverse;
  }

  .hero__portrait {
    align-self: flex-start;
    width: min(60%, 220px);
  }

  .hero__meta-row dd {
    text-align: right;
  }
}

@media (max-width: 600px) {
  .hero {
    padding-top: 110px;
  }

  .hero__statement {
    max-width: 100%;
  }

  .hero__foot {
    flex-direction: column;
    align-items: flex-start;
    gap: $space-4;
  }
}
</style>
