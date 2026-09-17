<template>
  <div class="social-row">
    <v-tooltip
      v-for="(button, index) in socialMediaButtons"
      :key="index"
      location="top"
      :text="button.tooltipText"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          :icon="button.icon"
          class="social-btn my-cursor-hover"
          variant="text"
          :size="iconSize || 'small'"
          @click="routeToLink(button.link)"
        />
      </template>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    iconSize: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      socialMediaButtons: [
        {
          icon: 'mdi-linkedin',
          tooltipText: 'LinkedIn',
          link: 'https://www.linkedin.com/in/mjawadhaider',
        },
        {
          icon: 'mdi-github',
          tooltipText: 'GitHub',
          link: 'https://github.com/mjawadhaider',
        },
        {
          icon: 'mdi-twitter',
          tooltipText: 'Twitter',
          link: 'https://twitter.com/mjawad_haider',
        },
        {
          icon: 'mdi-instagram',
          tooltipText: 'Instagram',
          link: 'https://www.instagram.com/m.jawad_haider/',
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.social-row {
  display: flex;
  align-items: center;
  gap: $space-1;
}

.social-btn {
  // !important: v-btn renders an actual <button type="button">, and
  // Vuetify's own reset stylesheet has a same-specificity
  // `[type=button] { color: inherit }` rule — see FeedbackForm.vue's
  // .hero__cta comment for the full explanation of why a plain class
  // selector isn't enough to win that tie.
  color: $color-gray !important;
  transition: color $dur-fast $ease-out;

  // The icon glyph is a separate element v-btn renders internally from
  // its `icon` prop, wrapped in v-btn's own <span class="v-btn__content">
  // — two levels removed from .social-btn, and neither reachable by this
  // component's own scoped CSS without :deep(). Left unstyled, both are
  // caught only by App.vue's global `* { color: $color-white }` (the
  // universal selector always wins over an ancestor's color, since
  // inheritance never kicks in for a property every element already has
  // an explicit value for) — and because that wrapper span sits in
  // between, even `color: inherit` here would just pick up the wrapper's
  // own (wrong) color rather than .social-btn's, so the value is
  // repeated explicitly instead.
  :deep(.v-icon) {
    color: $color-gray !important;
  }

  &:hover {
    color: $color-accent !important;

    :deep(.v-icon) {
      color: $color-accent !important;
    }
  }
}
</style>
