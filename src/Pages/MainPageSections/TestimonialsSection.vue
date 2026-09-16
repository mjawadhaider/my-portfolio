<template>
  <section v-if="isLoading || testimonials.length > 0" ref="root" class="testimonials">
    <p class="section-eyebrow">03 &mdash; Feedback</p>
    <h2 class="testimonials__heading">What people say</h2>

    <div v-if="isLoading" class="testimonials__list">
      <figure v-for="n in 2" :key="`testimonial-skeleton-${n}`" class="testimonial-row">
        <div class="testimonial-row__quote testimonial-row__quote--skeleton">
          <span class="skeleton skeleton--text" style="width: 100%; height: 1.5rem;"></span>
          <span class="skeleton skeleton--text" style="width: 85%; height: 1.5rem; margin-top: 10px;"></span>
          <span class="skeleton skeleton--text" style="width: 55%; height: 1.5rem; margin-top: 10px;"></span>
        </div>
        <figcaption class="testimonial-row__author">
          <span class="skeleton skeleton--circle" style="width: 36px; height: 36px;"></span>
          <span class="skeleton skeleton--text" style="width: 140px;"></span>
        </figcaption>
      </figure>
    </div>

    <div v-else class="testimonials__list">
      <figure v-for="(item, index) in testimonials" :key="index" class="testimonial-row">
        <blockquote class="testimonial-row__quote">{{ item.quote }}</blockquote>
        <figcaption class="testimonial-row__author">
          <span class="testimonial-row__mark">{{ initials(item.author) }}</span>
          <span>
            <span class="testimonial-row__name">{{ item.author }}</span>
            <span v-if="item.role" class="testimonial-row__role"> &mdash; {{ item.role }}</span>
          </span>
        </figcaption>
      </figure>
    </div>
  </section>
</template>

<script>
import { gsap, ScrollTrigger } from '@/plugins/gsap';
import { fetchTestimonials } from '@/utils/fetchData';
import { prefersReducedMotion } from '@/utils/motion';

export default {
  data() {
    return {
      isLoading: false,
      testimonials: [],
    };
  },
  methods: {
    initials(name) {
      if (!name) return '';
      return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
    },
    addScrollAnimation() {
      if (prefersReducedMotion()) return;

      ScrollTrigger.batch('.testimonial-row', {
        start: 'top 90%',
        onEnter: (elements) => {
          gsap.fromTo(
            elements,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1 }
          );
        },
      });
    },
  },
  async mounted() {
    this.isLoading = true;
    this.testimonials = await fetchTestimonials();
    this.isLoading = false;

    await this.$nextTick();
    this.addScrollAnimation();
  },
};
</script>

<style scoped lang="scss">
.testimonials {
  max-width: $container-max;
  margin-inline: auto;
  padding: $space-11 clamp(24px, 6vw, 80px);
}

.testimonials__heading {
  margin: $space-3 0 $space-9;
  font-family: $font-display;
  font-size: $fs-h1;
  font-weight: $fw-medium;
  letter-spacing: $ls-tight;
  color: $color-white;
}

.testimonials__list {
  display: flex;
  flex-direction: column;
}

.testimonial-row {
  margin: 0;
  padding-block: $space-8;
  border-bottom: $border-hairline-faint;

  &:last-child {
    border-bottom: none;
  }
}

.testimonial-row__quote {
  margin: 0;
  max-width: 62ch;
  font-family: $font-display;
  font-size: clamp(1.25rem, 1.2vw + 0.9rem, 1.75rem);
  font-style: italic;
  font-weight: $fw-regular;
  line-height: $lh-snug;
  color: $color-white;
}

.testimonial-row__author {
  display: flex;
  align-items: center;
  gap: $space-3;
  margin-top: $space-5;
}

.testimonial-row__mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: $gradient-glow-accent;
  border: $border-hairline;
  border-radius: $radius-circle;
  font-family: $font-mono;
  font-size: $fs-caption;
  color: $color-accent;
  flex: none;
}

.testimonial-row__name {
  font-weight: $fw-medium;
  color: $color-white;
}

.testimonial-row__role {
  color: $color-text-muted;
}
</style>
