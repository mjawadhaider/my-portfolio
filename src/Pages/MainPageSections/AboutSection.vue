<template>
  <section ref="root" class="about">
    <div class="about__rail">
      <p class="section-eyebrow">01 &mdash; Background</p>
      <h2 class="about__heading">Experience<br />&amp; toolkit</h2>
      <p class="about__lede">
        A working history of roles and the technologies I reach for most.
      </p>
    </div>

    <div class="about__content">
      <div class="about-block">
        <h3 class="about-block__title">Experience</h3>

        <template v-if="experience.length > 0">
          <div
            v-for="(item, index) in experience"
            :key="index"
            class="timeline-row"
          >
            <span class="timeline-row__period">{{ item.duration }}</span>
            <div class="timeline-row__body">
              <h4 class="timeline-row__role">{{ item.position }}</h4>
              <p class="timeline-row__org">{{ item.company }}</p>
              <ul v-if="item.highlights?.length" class="timeline-row__highlights">
                <li v-for="(highlight, hIndex) in item.highlights" :key="hIndex">
                  {{ highlight }}
                </li>
                <template v-if="expandedRows[index]">
                  <li v-for="(highlight, hIndex) in item.moreHighlights" :key="`more-${hIndex}`">
                    {{ highlight }}
                  </li>
                </template>
              </ul>
              <button
                v-if="item.moreHighlights?.length"
                type="button"
                class="timeline-row__toggle my-cursor-hover"
                @click="toggleRow(index)"
              >
                {{ expandedRows[index] ? 'View less' : `View ${item.moreHighlights.length} more` }}
              </button>
            </div>
          </div>
        </template>
        <template v-else>
          <div v-for="n in 3" :key="`exp-skeleton-${n}`" class="timeline-row">
            <span class="skeleton skeleton--text" style="width: 64%; max-width: 96px;"></span>
            <div class="timeline-row__body">
              <span class="skeleton skeleton--text" style="width: 45%; height: 1.375rem; margin-bottom: 10px;"></span>
              <span class="skeleton skeleton--text" style="width: 30%;"></span>
            </div>
          </div>
        </template>

        <template v-if="education.length > 0">
          <div
            v-for="(item, index) in education"
            :key="index"
            class="timeline-row timeline-row--muted"
          >
            <span class="timeline-row__period">{{ item.duration }}</span>
            <div class="timeline-row__body">
              <h4 class="timeline-row__role">{{ item.degree }}</h4>
              <p class="timeline-row__org">{{ item.institute }}</p>
            </div>
          </div>
        </template>
      </div>

      <div class="about-block">
        <h3 class="about-block__title">Toolkit</h3>
        <skills-network />
      </div>
    </div>
  </section>
</template>

<script>
import { gsap, ScrollTrigger } from '@/plugins/gsap';
import { fetchExperience, fetchEducation } from '@/utils/fetchData';
import { prefersReducedMotion } from '@/utils/motion';
import SkillsNetwork from './SkillsNetwork.vue';

export default {
  components: {
    SkillsNetwork,
  },
  data() {
    return {
      experience: [],
      education: [],
      expandedRows: {},
    };
  },
  methods: {
    toggleRow(index) {
      this.expandedRows[index] = !this.expandedRows[index];
    },
    addScrollAnimation() {
      if (prefersReducedMotion()) return;

      ScrollTrigger.batch('.timeline-row', {
        start: 'top 90%',
        onEnter: (elements) => {
          gsap.fromTo(
            elements,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.08 }
          );
        },
      });

      gsap.fromTo(
        '.skills-network',
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.skills-network', start: 'top 90%' },
        }
      );

      gsap.fromTo(
        this.$refs.root.querySelectorAll('.about__rail > *'),
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.08,
          scrollTrigger: { trigger: this.$refs.root, start: 'top 75%' },
        }
      );
    },
  },
  async mounted() {
    this.addScrollAnimation();
    this.experience = await fetchExperience();
    this.education = await fetchEducation();
  },
};
</script>

<style scoped lang="scss">
.about {
  display: grid;
  grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
  gap: clamp(32px, 6vw, 96px);
  max-width: $container-max;
  margin-inline: auto;
  padding: $space-8 clamp(24px, 6vw, 80px) $space-11;
}

.about__rail {
  position: sticky;
  top: 104px;
  align-self: start;
  display: flex;
  flex-direction: column;
  gap: $space-4;
}

.about__heading {
  margin: 0;
  font-family: $font-display;
  font-size: $fs-h1;
  font-weight: $fw-medium;
  letter-spacing: $ls-tight;
  line-height: $lh-tight;
  color: $color-white;
}

.about__lede {
  max-width: 32ch;
  color: $color-text-muted;
  line-height: $lh-loose;
}

.about__content {
  display: flex;
  flex-direction: column;
  gap: $space-10;
  min-width: 0;
}

.about-block__title {
  font-family: $font-mono;
  font-size: $fs-micro;
  letter-spacing: $ls-wide;
  text-transform: uppercase;
  color: $color-gray;
  margin-bottom: $space-5;
  padding-bottom: $space-3;
  border-bottom: $border-hairline;
}

.timeline-row {
  display: grid;
  grid-template-columns: minmax(120px, 0.9fr) minmax(0, 3fr);
  gap: $space-5;
  padding-block: $space-5;
  border-bottom: $border-hairline-faint;
  transition: opacity $dur-fast $ease-out;

  &:last-child {
    border-bottom: none;
  }
}

.timeline-row--muted {
  opacity: 0.7;
}

.timeline-row__period {
  font-family: $font-mono;
  font-size: $fs-caption;
  color: $color-accent;
  letter-spacing: $ls-wide;
}

.timeline-row__role {
  margin: 0 0 $space-1;
  font-family: $font-display;
  font-size: $fs-h3;
  font-weight: $fw-medium;
  color: $color-white;
}

.timeline-row__org {
  margin: 0;
  color: $color-text-muted;
}

.timeline-row__highlights {
  margin-top: $space-3;
  padding-left: $space-4;
  color: $color-text-muted;
  font-size: $fs-body-sm;
  line-height: $lh-loose;

  li {
    margin-bottom: $space-1;
  }
}

.timeline-row__toggle {
  display: inline-block;
  margin-top: $space-3;
  background: none;
  border: none;
  padding: 0;
  font-family: $font-mono;
  font-size: $fs-micro;
  letter-spacing: $ls-wide;
  text-transform: uppercase;
  // !important: needed to beat Vuetify's `[type=button] { color: inherit }`
  // reset on this equal-specificity single-class selector — see
  // FeedbackForm.vue's .hero__cta comment for the full explanation.
  color: $color-accent !important;
  border-bottom: 1px solid rgba(var(--color-white-rgb), 0.25);
  cursor: inherit;
  transition: border-color $dur-fast $ease-out;

  &:hover {
    border-color: $color-accent;
  }
}

@media (max-width: 960px) {
  .about {
    grid-template-columns: 1fr;
  }

  .about__rail {
    position: static;
    max-width: 56ch;
  }

  .timeline-row {
    grid-template-columns: 1fr;
    gap: $space-2;
  }
}
</style>
