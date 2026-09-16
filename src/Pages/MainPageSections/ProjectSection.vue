<template>
  <section ref="root" class="projects">
    <div class="projects__head">
      <p class="section-eyebrow">02 &mdash; Selected work</p>
      <h2 class="projects__heading">Projects</h2>
    </div>

    <div v-if="isLoading">
      <div class="project-feature project-feature--skeleton">
        <div class="project-feature__info">
          <span class="skeleton skeleton--text" style="width: 24px;"></span>
          <span class="skeleton skeleton--text" style="width: 70%; height: 2.25rem; margin-top: 12px;"></span>
          <span class="skeleton skeleton--text" style="width: 90%; margin-top: 16px;"></span>
          <span class="skeleton skeleton--text" style="width: 60%; margin-top: 8px;"></span>
          <span class="skeleton skeleton--text" style="width: 45%; margin-top: 16px;"></span>
        </div>
        <div class="project-feature__visual project-feature__visual--skeleton">
          <span class="skeleton" style="display: block; width: 100%; aspect-ratio: 16 / 10; border-radius: 0;"></span>
        </div>
      </div>

      <div class="project-list">
        <div v-for="n in 2" :key="`project-row-skeleton-${n}`" class="project-row project-row--skeleton">
          <span class="skeleton skeleton--text" style="width: 20px;"></span>
          <div class="project-row__info">
            <span class="skeleton skeleton--text" style="width: 40%; height: 1.375rem;"></span>
            <span class="skeleton skeleton--text" style="width: 80%; margin-top: 8px;"></span>
            <span class="skeleton skeleton--text" style="width: 35%; margin-top: 8px;"></span>
          </div>
          <div class="project-row__thumb project-row__thumb--skeleton">
            <span class="skeleton" style="width: 100%; height: 100%; border-radius: 0;"></span>
          </div>
        </div>
      </div>
    </div>

    <template v-else>
      <div
        v-if="featured"
        ref="featured"
        role="button"
        tabindex="0"
        class="project-feature my-cursor-hover"
        @click="openProject(featured)"
        @keydown.enter.prevent="openProject(featured)"
        @keydown.space.prevent="openProject(featured)"
      >
        <div class="project-feature__info">
          <span class="project-feature__index">01</span>
          <h3 class="project-feature__name">{{ featured.name }}</h3>
          <p class="project-feature__desc">{{ featured.description }}</p>
          <p v-if="techLine(featured)" class="project-feature__tags">{{ techLine(featured) }}</p>
          <div class="project-feature__foot">
            <span class="project-feature__duration">{{ featured.duration }}</span>
            <span class="project-feature__link">View case study &#8594;</span>
          </div>
        </div>
        <div class="project-feature__visual">
          <img
            class="project-feature__image"
            :src="resolveProjectImage(featured.pictures?.[0])"
            :alt="`${featured.name} preview`"
          />
        </div>
      </div>

      <div v-if="restProjects.length" class="project-list">
        <div
          v-for="(project, i) in restProjects"
          :key="i"
          role="button"
          tabindex="0"
          class="project-row my-cursor-hover"
          @click="openProject(project)"
          @keydown.enter.prevent="openProject(project)"
          @keydown.space.prevent="openProject(project)"
        >
          <span class="project-row__index">{{ String(i + 2).padStart(2, '0') }}</span>
          <div class="project-row__info">
            <h4 class="project-row__name">{{ project.name }}</h4>
            <p class="project-row__desc">{{ project.description }}</p>
            <p v-if="techLine(project)" class="project-row__tags">{{ techLine(project) }}</p>
          </div>
          <div class="project-row__thumb">
            <img :src="resolveProjectImage(project.pictures?.[0])" :alt="`${project.name} preview`" />
          </div>
          <span class="project-row__arrow" aria-hidden="true">&#8594;</span>
        </div>
      </div>
    </template>

    <project-item
      :project="activeProject"
      :open="!!activeProject"
      :testimonial="activeProject ? findTestimonialFor(activeProject) : null"
      @close="closeProject"
    />
  </section>
</template>

<script>
import ProjectItem from '@/components/ProjectItem.vue';
import { gsap, ScrollTrigger } from '@/plugins/gsap';
import { fetchProjects, fetchTestimonials } from '@/utils/fetchData';
import { getTechIconName } from '@/utils/techIcons';
import { resolveProjectImage } from '@/utils/projectImage';
import { prefersReducedMotion } from '@/utils/motion';

export default {
  components: {
    ProjectItem,
  },
  data() {
    return {
      isLoading: false,
      projects: [],
      testimonials: [],
      activeProject: null,
    };
  },
  computed: {
    featured() {
      return this.projects[0] || null;
    },
    restProjects() {
      return this.projects.slice(1);
    },
  },
  methods: {
    resolveProjectImage,
    techLine(project) {
      if (!project.techStack?.length) return '';
      return project.techStack.map((key) => getTechIconName(key)).join(' · ');
    },
    findTestimonialFor(project) {
      return this.testimonials.find((t) => t.relatedProject === project.name) || null;
    },
    openProject(project) {
      this.activeProject = project;
      document.body.classList.add('card');
    },
    closeProject() {
      this.activeProject = null;
      document.body.classList.remove('card', 'hover');
    },
    addScrollAnimation() {
      if (prefersReducedMotion()) return;

      gsap.fromTo(
        this.$refs.root.querySelectorAll('.projects__head > *'),
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

      if (this.$refs.featured) {
        gsap.fromTo(
          this.$refs.featured,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: this.$refs.featured, start: 'top 85%' },
          }
        );
      }

      ScrollTrigger.batch('.project-row', {
        start: 'top 92%',
        onEnter: (elements) => {
          gsap.fromTo(
            elements,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.08 }
          );
        },
      });
    },
  },
  async mounted() {
    this.isLoading = true;
    this.projects = await fetchProjects();
    this.testimonials = await fetchTestimonials();
    this.isLoading = false;

    await this.$nextTick();
    this.addScrollAnimation();
  },
};
</script>

<style scoped lang="scss">
.projects {
  max-width: $container-wide;
  margin-inline: auto;
  padding: $space-11 clamp(24px, 6vw, 80px);
}

.projects__head {
  margin-bottom: $space-9;
}

.projects__heading {
  margin: $space-3 0 0;
  font-family: $font-display;
  font-size: $fs-h1;
  font-weight: $fw-medium;
  letter-spacing: $ls-tight;
  color: $color-white;
}

.project-feature {
  width: 100%;
  background: none;
  border: none;
  border-bottom: $border-hairline;
  font: inherit;
  text-align: left;
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: clamp(32px, 5vw, 72px);
  align-items: center;
  padding: 0 0 $space-9;
  margin-bottom: $space-9;
  cursor: inherit;
  outline-offset: 6px;
}

.project-feature__index {
  font-family: $font-mono;
  font-size: $fs-caption;
  color: $color-accent;
  letter-spacing: $ls-wide;
}

.project-feature__name {
  margin: $space-3 0 0;
  font-family: $font-display;
  font-size: clamp(1.75rem, 2vw + 1rem, 2.75rem);
  font-weight: $fw-medium;
  letter-spacing: $ls-tight;
  color: $color-white;
}

.project-feature__desc {
  margin-top: $space-4;
  max-width: 46ch;
  color: $color-text-muted;
  line-height: $lh-loose;
}

.project-feature__tags {
  margin-top: $space-4;
  font-family: $font-mono;
  font-size: $fs-caption;
  color: $color-gray;
}

.project-feature__foot {
  display: flex;
  align-items: center;
  gap: $space-5;
  margin-top: $space-6;
}

.project-feature__duration {
  font-family: $font-mono;
  font-size: $fs-caption;
  color: $color-gray;
}

.project-feature__link {
  font-weight: $fw-medium;
  color: $color-accent;
  border-bottom: 1px solid rgba(205, 168, 121, 0.5);
  padding-bottom: 2px;
  transition: border-color $dur-fast $ease-out;
}

.project-feature:hover .project-feature__link {
  border-color: $color-accent;
}

.project-feature__visual {
  position: relative;
  overflow: hidden;
  border: $border-hairline;
}

.project-feature__visual::after {
  content: '';
  position: absolute;
  inset: 0;
  background: $gradient-accent-soft;
  opacity: 0;
  transition: opacity $dur-normal $ease-out;
  pointer-events: none;
}

.project-feature:hover .project-feature__visual::after {
  opacity: 1;
}

.project-feature__image {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  transition: transform $dur-slow $ease-out;
}

.project-feature:hover .project-feature__image {
  transform: scale(1.04);
}

.project-list {
  display: flex;
  flex-direction: column;
}

.project-row {
  width: 100%;
  background: none;
  border: none;
  font: inherit;
  text-align: left;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) 120px auto;
  align-items: center;
  gap: $space-5;
  padding-block: $space-6;
  border-bottom: $border-hairline-faint;
  cursor: inherit;
  outline-offset: 6px;
  transition: opacity $dur-fast $ease-out;

  &:last-child {
    border-bottom: none;
  }
}

.project-row__index {
  font-family: $font-mono;
  font-size: $fs-caption;
  color: $color-gray;
}

.project-row__name {
  margin: 0;
  font-family: $font-display;
  font-size: $fs-h3;
  font-weight: $fw-medium;
  color: $color-white;
  transition: color $dur-fast $ease-out;
}

.project-row:hover .project-row__name {
  color: $color-accent;
}

.project-row__desc {
  margin: $space-1 0 0;
  max-width: 60ch;
  color: $color-text-muted;
  font-size: $fs-body-sm;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.project-row__tags {
  margin: $space-2 0 0;
  font-family: $font-mono;
  font-size: $fs-caption;
  color: $color-gray;
}

.project-row__thumb {
  position: relative;
  width: 120px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border: $border-hairline-faint;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform $dur-normal $ease-out;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: $gradient-accent-soft;
    opacity: 0;
    transition: opacity $dur-normal $ease-out;
    pointer-events: none;
  }
}

.project-row:hover .project-row__thumb img {
  transform: scale(1.08);
}

.project-row:hover .project-row__thumb::after {
  opacity: 1;
}

.project-row__arrow {
  color: $color-gray;
  transition: transform $dur-fast $ease-out, color $dur-fast $ease-out;
}

.project-row:hover .project-row__arrow {
  color: $color-accent;
  transform: translateX(4px);
}

@media (max-width: 960px) {
  .project-feature {
    grid-template-columns: 1fr;
  }

  .project-feature__visual {
    order: -1;
  }

  .project-row {
    grid-template-columns: auto 1fr;
    grid-template-areas:
      'index thumb'
      'info thumb';
    row-gap: $space-2;
  }

  .project-row__index {
    grid-area: index;
  }

  .project-row__info {
    grid-area: info;
  }

  .project-row__thumb {
    grid-area: thumb;
    width: 96px;
    align-self: start;
  }

  .project-row__arrow {
    display: none;
  }
}
</style>
