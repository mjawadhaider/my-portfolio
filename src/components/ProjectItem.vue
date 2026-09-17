<template>
  <v-dialog
    :model-value="open"
    class="project-dialog"
    @update:model-value="(next) => !next && $emit('close')"
  >
    <v-card v-if="project" class="dialog-card">
      <div class="dialog-header">
        <div class="dialog-header__title">
          <span class="section-eyebrow">Case study</span>
          <h3>{{ project.name }}</h3>
          <span v-if="project.associatedWith" class="dialog-header__meta">
            {{ project.associatedWith }}
          </span>
        </div>
        <button type="button" class="dialog-close my-cursor-hover" aria-label="Close" @click="$emit('close')">
          &times;
        </button>
      </div>

      <div class="dialog-body" :class="{ 'dialog-body--stacked': $vuetify.display.smAndDown }">
        <div class="dialog-narrative">
          <div class="dialog-row-head">
            <h4>The challenge</h4>
            <span v-if="$vuetify.display.smAndDown" class="dialog-duration">{{ project.duration }}</span>
          </div>
          <p>{{ project.description }}</p>

          <h4 class="mt-block">Role &amp; approach</h4>
          <p>{{ project.responsibilities }}</p>

          <template v-if="project.techStack?.length">
            <h4 class="mt-block">Tech stack</h4>
            <ul class="dialog-tech">
              <li v-for="(icon, index) in project.techStack" :key="index">
                <img v-if="getTechIconFile(icon) !== 'no-image.png'" :src="require(`@/assets/svg-icons/${getTechIconFile(icon)}`)" alt="" />
                <span>{{ getTechIconName(icon) }}</span>
              </li>
            </ul>
          </template>

          <div v-if="project.impact" class="impact-callout mt-block">
            <span>{{ project.impact }}</span>
            <span v-if="project.outcomeMetric" class="impact-callout__metric">{{ project.outcomeMetric }}</span>
          </div>

          <blockquote v-if="testimonial" class="dialog-quote mt-block">
            <p>&ldquo;{{ testimonial.quote }}&rdquo;</p>
            <footer>
              &mdash; {{ testimonial.author }}<span v-if="testimonial.role">, {{ testimonial.role }}</span>
            </footer>
          </blockquote>

          <h4 class="mt-block">Links</h4>
          <div class="dialog-links">
            <a
              v-if="project.projectLink"
              class="my-cursor-hover"
              target="_blank"
              :href="project.projectLink"
            >Live project &#8599;</a>
            <span v-else class="dialog-links__disabled">Not publicly available</span>
            <a
              v-if="project.githubLink"
              class="my-cursor-hover"
              target="_blank"
              :href="project.githubLink"
            >Source &#8599;</a>
            <span v-else class="dialog-links__disabled">Private repository</span>
          </div>
        </div>

        <div class="dialog-visual">
          <span v-if="$vuetify.display.mdAndUp" class="dialog-duration">{{ project.duration }}</span>
          <v-carousel
            v-if="project.pictures?.length >= 1"
            cycle
            :height="$vuetify.display.xs ? '200' : '320'"
            hide-delimiters
            :show-arrows="$vuetify.display.smAndDown || 'hover'"
          >
            <v-carousel-item v-for="(slidePic, index) in project.pictures" :key="index" class="fill-height">
              <img
                class="dialog-image"
                :src="resolveProjectImage(slidePic)"
                :alt="`${project.name} screenshot ${index + 1}`"
              />
            </v-carousel-item>
          </v-carousel>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { getTechIconFile, getTechIconName } from '@/utils/techIcons';
import { resolveProjectImage } from '@/utils/projectImage';

export default {
  props: {
    project: {
      type: Object,
      default: null,
    },
    open: {
      type: Boolean,
      default: false,
    },
    testimonial: {
      type: Object,
      default: null,
    },
  },
  emits: ['close'],
  methods: {
    getTechIconFile,
    getTechIconName,
    resolveProjectImage,
  },
};
</script>

<style lang="scss" scoped>
.project-dialog {
  width: min(90vw, 960px);

  .dialog-card {
    background: $gradient-accent-soft, $color-bg-elevated;
    border: $border-hairline;
    border-radius: $radius-md !important;
  }
}

.dialog-header {
  padding: $space-5 $space-6;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: $border-hairline;
}

.dialog-header__title {
  display: flex;
  flex-direction: column;
  gap: $space-1;

  h3 {
    font-family: $font-display;
    font-size: $fs-h2;
    font-weight: $fw-medium;
    color: $color-white;
    margin: $space-1 0 0;
  }
}

.dialog-header__meta {
  font-size: $fs-caption;
  color: $color-text-muted;
}

.dialog-close {
  background: none;
  border: none;
  font-size: 1.75rem;
  line-height: 1;
  // !important: needed to beat Vuetify's `[type=button] { color: inherit }`
  // reset on this equal-specificity single-class selector — see
  // FeedbackForm.vue's .hero__cta comment for the full explanation.
  color: $color-gray !important;
  cursor: inherit;
  transition: color $dur-fast $ease-out, transform $dur-fast $ease-out;
  padding: 4px 6px;

  &:hover {
    color: $color-white !important;
    transform: rotate(90deg);
  }
}

.dialog-body {
  padding: $space-6;
  display: flex;
  gap: $space-7;
}

.dialog-body--stacked {
  flex-direction: column;
}

.dialog-narrative {
  width: 50%;
  font-size: $fs-body-sm;
  line-height: $lh-loose;

  h4 {
    font-family: $font-mono;
    font-size: $fs-micro;
    letter-spacing: $ls-wide;
    text-transform: uppercase;
    color: $color-gray;
    margin: 0 0 $space-2;
  }

  .mt-block {
    margin-top: $space-5;
  }

  p {
    color: $color-text-muted;
    margin: 0;
  }
}

.dialog-row-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.dialog-duration {
  font-family: $font-mono;
  font-size: $fs-caption;
  color: $color-accent;
}

.dialog-tech {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: $space-4;

  li {
    display: flex;
    align-items: center;
    gap: $space-2;
    color: $color-text-muted;
    font-size: $fs-caption;
  }

  img {
    width: 16px;
    height: 16px;
    flex: none;
  }
}

.impact-callout {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: $space-2;
  padding: $space-3 $space-4;
  background: linear-gradient(135deg, rgba(var(--color-accent-rgb), 0.1), rgba(var(--color-accent-rgb), 0.02));
  border: $border-accent;
  color: $color-white;
}

.impact-callout__metric {
  margin-left: auto;
  color: $color-accent;
  font-weight: $fw-semibold;
  font-family: $font-mono;
}

.dialog-quote {
  margin: 0;
  padding: $space-3 $space-4;
  border-left: 2px solid $color-accent;
  font-style: italic;
  color: $color-white;

  p {
    margin: 0;
    color: inherit;
  }

  footer {
    margin-top: $space-2;
    font-style: normal;
    font-size: $fs-caption;
    color: $color-text-muted;
  }
}

.dialog-links {
  display: flex;
  flex-direction: column;
  gap: $space-2;
  align-items: flex-start;

  a {
    color: $color-accent;
    text-decoration: none;
    border-bottom: 1px solid rgba(var(--color-accent-rgb), 0.4);
  }

  a:hover {
    border-color: $color-accent;
  }

  &__disabled {
    color: $color-gray;
    font-size: $fs-caption;
  }
}

.dialog-visual {
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: $space-2;
  align-items: flex-end;
}

.dialog-image {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

:deep(.v-window) {
  width: 100%;
  cursor: inherit !important;
}

@media (max-width: 960px) {
  .dialog-narrative,
  .dialog-visual {
    width: 100%;
    align-items: stretch;
  }
}
</style>
