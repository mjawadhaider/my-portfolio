import { toUpper } from 'lodash';
import { gsap } from '@/plugins/gsap';
import { prefersReducedMotion } from '@/utils/motion';

// Shared color tokens (JS-side) + a restrained magnetic-hover
// micro-interaction, mixed into every component via app.mixin() in
// main.js. Keep the colors here in sync with src/styles/_variables.scss —
// this file exists only because :color props / inline :style bindings
// can't read SCSS variables.
export default {
  components: {},
  data: () => {
    return {
      gray: '#8c8f92',
      darkGray: '#17181a',
      lightGray: '#26272b',

      primaryBackground: '#222327',
      primary: '#1c1d20',
      secondary: '#cda879',
      white: '#f2f0ec',
    };
  },
  methods: {
    success() {},
    routeToLink(link) {
      if (link) {
        window.open(link, '_blank');
      }
    },
    capitalize(title) {
      return toUpper(title);
    },
    // Restrained magnetic-hover: the target eases a fraction of the way
    // toward the cursor, then springs back on leave. Kept subtle — this is
    // a micro-interaction, not the focal point.
    handleMouseMove_Small(e) {
      if (this.$vuetify.display.smAndDown || prefersReducedMotion()) return;
      const target = e.currentTarget;
      const rect = target.getBoundingClientRect();
      const deltaX = e.clientX - (rect.left + rect.width / 2);
      const deltaY = e.clientY - (rect.top + rect.height / 2);
      const distance = Math.hypot(deltaX, deltaY);

      if (distance < 400) {
        gsap.to(target, {
          x: deltaX * 0.18,
          y: deltaY * 0.18,
          duration: 0.5,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      }
    },
    handleMouseMove(e) {
      if (this.$vuetify.display.smAndDown || prefersReducedMotion()) return;
      const target = e.currentTarget;
      const rect = target.getBoundingClientRect();
      const deltaX = e.clientX - (rect.left + rect.width / 2);
      const deltaY = e.clientY - (rect.top + rect.height / 2);

      gsap.to(target, {
        x: deltaX * 0.3,
        y: deltaY * 0.3,
        duration: 0.5,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    },
    handleMouseLeave(e) {
      if (this.$vuetify.display.smAndDown || prefersReducedMotion()) return;
      const target = e.currentTarget || e.target;
      if (!target?.style) return;

      gsap.to(target, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
        overwrite: 'auto',
      });
    },
  },
};
