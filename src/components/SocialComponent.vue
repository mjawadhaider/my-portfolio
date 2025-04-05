<template>
  <v-tooltip
    v-for="(button, index) in socialMediaButtons"
    :key="index"
    location="top"
    :content="button.name"
    max-width="63px"
    max-height="20px"
  >
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        icon
        class="mr-3 custom-btn-hover"
        variant="tonal"
        color="white"
        :size="iconSize || 35"
        elevation="4"
        @click="routeToLink(button.link)"
        @mouseleave="handleMouseLeave"
      >
        <v-icon
          color="white"
          v-bind="button"
          :size="iconSize || 22"
        >
          {{ button.icon }}
        </v-icon>
      </v-btn>
    </template>
    <span
      class="d-flex justify-center"
      style="font-size: 12px; margin-top: -4px"
    >
      {{ button.tooltipText }}
    </span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    iconSize: {
      type: String,
      default: '',
    },
    colored: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      socialMediaButtons: [
        {
          icon: 'mdi-linkedin',
          tooltipText: 'Linkedin',
          link: 'https://www.linkedin.com/in/mjawadhaider',
          background: '#0077b5',
          iconColor: '#007bb6',
        },
        {
          icon: 'mdi-github',
          tooltipText: 'Github',
          link: 'https://github.com/mjawadhaider',
          background: 'grey',
          iconColor: '#181616',
        },
        {
          icon: 'mdi-twitter',
          tooltipText: 'Twitter',
          link: 'https://twitter.com/mjawad_haider',
          background: '#1da1f2',
          iconColor: '#1da1f2',
        },
        {
          icon: 'mdi-instagram',
          tooltipText: 'Instagram',
          link: 'https://www.instagram.com/m.jawad_haider/',
          background: '#1da1f2',
          iconColor: '#517fa4',
        },
      ],
    };
  },
}
</script>

<style lang="scss" scoped>
.v-btn {
  transition: all .3s;
  position: relative;
  overflow: hidden;
  z-index: 1;

  &:before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0%;
    background-color: lighten(#353536, 10%);
    transition: all .3s;
    border-radius: 10rem;
    z-index: -1;
  }

  &:hover {
    color: #353536;

    &:before {
      height: 100%;
    }
  }
}
</style>
