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
  color: $color-gray;
  transition: color $dur-fast $ease-out;

  &:hover {
    color: $color-accent;
  }
}
</style>
